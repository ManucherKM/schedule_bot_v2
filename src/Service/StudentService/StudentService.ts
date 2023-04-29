import { Bells, Commands } from '@/Config'
import { ChatController, SpkApiController } from '@/Controller'
import { CreateTable, SupplyReduction } from '@/Helper'
import { StudentModel, UserModel } from '@/Model'
import { IStudent } from '@/Service/types'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message, SendMessageOptions } from 'node-telegram-bot-api'
import { Menu } from './Buttons/Buttons'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

class Student {
	async start(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Главное меню'

		await bot.sendMessage(chatId, message, {
			...Menu,
		})

		return true
	}

	async create(target: IStudent) {
		const student = await StudentModel.create(target)

		if (!student) {
			throw new Error('Не удалось создать студента')
		}

		return student
	}

	async getPair(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getById(chatId)

		if (!chat) {
			throw new Error('Не удалось получить чат')
		}

		const user = await UserModel.findOne({ chat: chat._id }).populate('student').populate('division')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const schedule = await SpkApiController.getSchedule(user.division.shortName, user.student?.group)

		if (!schedule) {
			await bot.sendMessage(chatId, 'Не удалось получить расписание студента')
			console.log('Не удалось получить расписание студента')
			return
		}

		let message = ''

		for (let i = 0; i < schedule.length; i++) {
			const item = schedule[i]

			message += `\n<b>${days[i]}</b>: `

			if (item.lessons.length === 0) {
				message += 'выходной :)'
				continue
			}

			item.lessons.forEach(lesson => {
				const discipline = SupplyReduction(lesson.discipline || '-', 26)
				const auditoria = lesson.auditoria || '-'
				const territory = lesson.territory?.split(')')[0].replace('(', '') || '-'

				message += `\n<b>Пара ${
					lesson.number_lesson
				}.</b>\nПредмет: ${discipline}\nМесто: ${auditoria.toLowerCase()}\nПодразделение: ${territory}\n`
			})
		}

		const res = await bot.sendMessage(chatId, message, { parse_mode: 'HTML' })

		return res
	}

	async getBell(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const data = [['№', 'Начало', 'Конец']]

		Bells.forEach(({ start, end }, idx) => {
			const row = [`${idx + 1}`, `${start}`, `${end}`]
			data.push(row)
		})

		const options: SendMessageOptions = { parse_mode: 'HTML' }

		const table = CreateTable(data)

		const message = '<pre>' + table + '</pre>'

		await bot.sendMessage(chatId, message, options)

		return true
	}

	async getProfile(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getById(chatId)

		if (!chat) {
			throw new Error('Не удалось найти чат')
		}

		const user = await UserModel.findOne({ chat: chat._id })
			.populate('student')
			.populate('role')
			.populate('activity')
			.populate('division')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const main = []

		main.push(['Группа', user.student?.group])
		main.push(['Курс', user.student?.stage])
		main.push(['Подразделение', user.division.shortName])
		main.push(['Роль', user.role.name])

		const secondary = []

		secondary.push([Commands.getHelp, user.activity.getHelp])
		secondary.push([Commands.getPair, user.activity.getPair])
		secondary.push([Commands.getBell, user.activity.getBell])
		secondary.push([Commands.getProfile, user.activity.getProfile])
		secondary.push([Commands.getRatings, user.activity.getRatings])
		secondary.push([Commands.getTeacher, user.activity.getTeacher])

		const message = `Основное\n<pre>${CreateTable(main)}</pre>\nСтатистика:\n<pre>${CreateTable(secondary)}</pre>`

		const res = await bot.sendMessage(chatId, message, { parse_mode: 'HTML' })

		return res
	}

	async getRatings(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const user: any = await UserModel.findOne({ chatId }).populate('student')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isKeys = !user.student.profile

		if (isKeys) {
			const message = 'Для просмотра оценок необходимо предоставить логин и пароль от учетной записи СПК'

			const { message_id } = await bot.sendMessage(chatId, message)

			bot.onReplyToMessage(chatId, message_id, async msg => {
				const student = await StudentModel.findOne({ chatId })

				if (!student) {
					throw new Error('Не удалось найти студента')
				}

				const { text } = msg

				if (!text) return

				const [login, password] = text.split(' ')

				const target = {
					profile: {
						login,
						password,
					},
				} as IStudent

				const updateStudent = await StudentModel.updateOne({ chatId }, target)

				console.log(updateStudent.acknowledged)

				if (!updateStudent.acknowledged) {
					const message = 'Не удалось обновить профиль'

					await bot.sendMessage(chatId, message)
					return
				}

				const message = 'Данные успешно сохранены\nЧтобы посмотреть оценки введите команду "Оценки"'

				await bot.sendMessage(chatId, message)
			})

			return
		}

		const { login, password } = user.student.profile

		const ratings = await SpkApiController.getRatings(login, password)

		if (!ratings) {
			bot.sendMessage(chatId, 'Не удалось получить оценки')
			return
		}

		const data = [['Предмет', 'Оценки', 'Балл']]

		const config: any = {
			columns: [
				{
					width: 13,
					truncate: 30,
				},
				{
					width: 8,
				},
			],
			border: {
				topBody: `-`,
				topJoin: `+`,
				topLeft: `+`,
				topRight: `+`,

				bottomBody: `-`,
				bottomJoin: `+`,
				bottomLeft: `+`,
				bottomRight: `+`,

				bodyLeft: `|`,
				bodyRight: `|`,
				bodyJoin: `|`,

				joinBody: `-`,
				joinLeft: `+`,
				joinRight: `+`,
				joinJoin: `+`,
			},
		}

		ratings.forEach(item => {
			const subject = item.Дисциплина.trim()
			const score = item.СреднийБалл || '-'
			const currentRatings: string[] = []

			item.Оценка.forEach(({ Оценка }) => {
				if (/^\d+$/.test(Оценка[0])) {
					currentRatings.push(Оценка[0])
				}
			})

			data.push([subject, currentRatings.join(', ') || '-', score.toString()])
		})

		const message = '<pre>' + CreateTable(data, config) + '</pre>'

		const options: SendMessageOptions = {
			parse_mode: 'HTML',
		}

		bot.sendMessage(chatId, message, options)

		return true
	}

	async getTeacher(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const message = 'Учителя'

		const options: SendMessageOptions = {}

		await bot.sendMessage(chatId, message, options)

		return true
	}

	async getHelp(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message =
			'Если возникла какая-либо ошибка или есть идеи по улучшению бота пишите <a href="https://t.me/Manucher0504">админу</a>'
		const options: SendMessageOptions = {
			parse_mode: 'HTML',
			disable_web_page_preview: true,
		}

		await bot.sendMessage(chatId, message, options)

		return true
	}
}

export const StudentService = new Student()
