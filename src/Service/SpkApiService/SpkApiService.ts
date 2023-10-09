import { EDivision } from '@/Config'
import { getMondayTime } from '@/Helper'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import * as uuid from 'uuid'
import { IResponseKey, IResponseRatings, IResponseStageList, ISpkApiInit, ISpkApiSchedule } from './Types'

class SpkApi {
	private dataUrl = 'https://surpk.ru/api/schedule/index'
	private schedultUrl = 'https://surpk.ru/api/schedule/schedule?date='
	private data: ISpkApiInit | null = null
	private schedule: ISpkApiSchedule | null = null
	private cacheDuration = 60 * 60 * 1000 // 30 минут в миллисекундах
	private cacheIntervalId: NodeJS.Timeout | null = null

	constructor() {
		this.startCacheInterval()
	}

	private async startCacheInterval() {
		if (this.cacheIntervalId) {
			clearInterval(this.cacheIntervalId)
		}

		this.cacheIntervalId = setInterval(async () => {
			await this.getData()
		}, this.cacheDuration)
	}

	private async getData() {
		try {
			const info = await axios.get<ISpkApiInit>(this.dataUrl)

			if (!info.data.success) {
				this.data = null
			}

			this.data = info.data

			const urlSchedule = this.schedultUrl + getMondayTime()

			const schedule = await axios.get<ISpkApiSchedule>(urlSchedule)

			if (!schedule.data.success) {
				this.schedule = null
			}

			this.schedule = schedule.data
		} catch (e) {
			console.log(e)
			this.data = null
			this.schedule = null
		}
	}

	async getTeachers(division?: string) {
		if (!this.data) await this.getData()

		if (!this.data || !this.data.success) {
			throw new Error('Не удалось получить данные с API СПК')
		}

		const teachersData = this.data.baseInfo.data.teachers

		if (!division) return teachersData

		const { divisions } = this.data.baseInfo.data

		const idx = Object.values(EDivision).indexOf(division as EDivision)

		if (idx === -1) return []

		const { id } = divisions[idx]

		const teachers = teachersData.filter(({ divisions }) => divisions.includes(id))

		return teachers
	}

	async getGroups(division?: string, stage?: string) {
		if (!this.data) await this.getData()

		if (!this.data || !this.data.success) {
			throw new Error('Не удалось получить данные с API СПК')
		}

		const groupsData = this.data.baseInfo.data.groups

		const divisionsData = this.data.baseInfo.data.divisions

		if (!division) return groupsData.map(({ name }) => name)

		const idx = Object.values(EDivision).indexOf(division as EDivision)

		if (idx === -1) return []

		const groups = groupsData
			.filter(groupData => {
				let isCurrentStage = false

				if (groupData.curse.toString() === stage) {
					isCurrentStage = true
				}

				const currentIdx = divisionsData.findIndex(({ id }) => id === groupData.division)

				const isCurrentDivision = currentIdx === idx

				return isCurrentStage && isCurrentDivision
			})
			.map(({ name }) => name)

		return groups
	}

	async getSchedule(division?: string, group?: string | null, teacher?: string | null) {
		if (!this.data || !this.schedule) {
			await this.getData()
		}

		if (!this.data || !this.schedule || !this.data.success || !this.schedule.success) {
			return []
		}

		const data = this.schedule

		let schedule = data.schedule.data.schedule.slice(6, 12)

		if (division) {
			const { territories } = this.data.baseInfo.data

			const idx = Object.values(EDivision).indexOf((division as EDivision) || '')

			if (idx !== -1) {
				schedule = schedule.map(({ lessons, date }) => {
					const filteredLessons = lessons.filter(_ => {
						const lessonTerritoryIndex = territories.findIndex(({ name }) => name.includes(division))

						if (lessonTerritoryIndex === -1) {
							return false
						}

						return true
					})

					return { date, lessons: filteredLessons }
				})
			}
		}

		if (group) {
			const { groups } = this.data.baseInfo.data

			schedule = schedule.map(({ lessons, date }) => {
				const filterLessons = lessons.filter(lesson => {
					const groupId = lesson.group

					const currentGroup = groups.find(g => g.id === groupId)

					if (!currentGroup) return false

					if (currentGroup.name === group) return true
				})

				return {
					date,
					lessons: filterLessons,
				}
			})
		}

		if (teacher) {
			const { teachers } = this.data.baseInfo.data

			schedule = schedule.map(({ lessons, date }) => {
				const filterLessons = lessons.filter(lesson => {
					const teacherId = lesson.teacher

					const currentTeacher = teachers.find(t => t.id === teacherId)

					if (!currentTeacher) return false

					if (currentTeacher.name === teacher) return true
				})

				return {
					date,
					lessons: filterLessons,
				}
			})
		}

		const { disciplines, audithories, territories, groups, teachers } = this.data.baseInfo.data

		const res = schedule.map(({ lessons, date }) => {
			const filterLessons = lessons.map(lesson => {
				const discipline = disciplines.find(({ id }) => id === lesson.discipline)?.name
				const auditoria = audithories.find(({ id }) => id === lesson.auditoria)?.name
				const territory = territories.find(({ id }) => id === lesson.territory)?.name
				const group = groups.find(({ id }) => id === lesson.group)?.name
				const teacher = teachers.find(({ id }) => id === lesson.teacher)?.name

				const info = {
					number_lesson: lesson.number_lesson,
					discipline,
					auditoria,
					territory,
					group,
					teacher,
				}

				return info
			})

			return { date, lessons: filterLessons }
		})

		return res
	}

	private encrypt(str: string) {
		const base64 = CryptoJS.enc.Base64.stringify((0, CryptoJS.SHA1)(str))
		return base64
	}

	private async getStageList(key: string, session: string) {
		const url = `https://learn.surpk.ru/el-study/hs/rur_assessment/periods?key=${key}&session=${session}`

		const { data } = await axios.post<IResponseStageList>(url)

		if (!data) {
			throw new Error('Не удалось получить список периодов')
		}

		return data.data
	}

	private async getKeysRatings(login: string, password: string) {
		const url = 'https://learn.surpk.ru/el-study/hs/users/session/new/standard'

		const version = '2.0.2'
		const clientID = uuid.v4()
		const passwordHash = this.encrypt(password)

		const key = this.encrypt(version + passwordHash + clientID)

		const params = {
			clientID,
			key,
			login,
			version,
			pinCode: '',
			pinCodeOption: '',
			usePinCode: false,
			userUUID: '',
		}

		const { data } = await axios.post<IResponseKey>(url, params)

		if (!data || data.error) {
			throw new Error('Не удалось получить ключи к журналу с оценками')
		}

		const res = {
			key,
			session: data.data.session,
		}

		return res
	}

	async getRatings(login: string, password: string) {
		const { key, session } = await this.getKeysRatings(login, password)

		const periods = await this.getStageList(key, session)

		const period: string | undefined = periods.reverse().filter(p => p.Текущий)[0].Код

		if (!period) {
			throw new Error('Не удалось найти текущий семестр')
		}

		const url = `https://learn.surpk.ru/el-study/hs/rur_assessment/assessment/${period}?key=${key}&session=${session}`

		const { data } = await axios.post<IResponseRatings>(url)

		if (!data || data.error) {
			throw new Error('Не удалось получить список оценок')
		}

		return data.data
	}
}

export const SpkApiService = new SpkApi()
