import { SpkApiService } from '@/Service'

class SpkApi {
	async getTeachers(division?: string) {
		try {
			const teachers = await SpkApiService.getTeachers(division)

			if (!teachers) return

			return teachers
		} catch (e) {
			console.log(e)
		}
	}

	async getGroups(division?: string, stage?: string) {
		try {
			const groups = await SpkApiService.getGroups(division, stage)

			if (!groups) return

			return groups
		} catch (e) {
			console.log(e)
		}
	}

	async getSchedule(division?: string, group?: string | null, teacher?: string | null) {
		try {
			const schedule = await SpkApiService.getSchedule(division, group, teacher)

			if (!schedule) return

			return schedule
		} catch (e) {
			console.log(e)
		}
	}

	async getRatings(login: string, password: string) {
		try {
			const ratings = await SpkApiService.getRatings(login, password)

			if (!ratings) return

			return ratings
		} catch (e) {
			console.log(e)
		}
	}
}

export const SpkApiController = new SpkApi()
