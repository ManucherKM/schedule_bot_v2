import { Commands } from '@/Config'
import { ChatController, SpkApiController } from '@/Controller'
import { CreateTable } from '@/Helper'
import { TeacherModel, UserModel } from '@/Model'
import { ITeacher } from '@/Service/types'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message, SendMessageOptions } from 'node-telegram-bot-api'
import { Menu } from './Buttons/Buttons'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

const bells = [
	{
		start: '8:30',
		end: '9:50',
	},
	{
		start: '10:00',
		end: '11:50',
	},
	{
		start: '12:00',
		end: '13:20',
	},
	{
		start: '13:30',
		end: '14:50',
	},
	{
		start: '15:00',
		end: '16:20',
	},
	{
		start: '16:30',
		end: '17:50',
	},
	{
		start: '18:00',
		end: '19:20',
	},
	{
		start: '19:30',
		end: '20:50',
	},
]

class Teacher {
	async start(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Главное меню'

		await bot.sendMessage(chatId, message, {
			...Menu,
		})

		return true
	}

	async createTeacher(target: ITeacher) {
		const teacher = await TeacherModel.create(target)
		return teacher
	}

	async getPair(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const user: any = await UserModel.findOne({ chatId }).populate('teacher')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		let message = ''

		const schedule = await SpkApiController.getSchedule(user.division, null, user.teacher?.fullName)

		if (!schedule) {
			console.log('Не удалось получить расписание учителя')
			return
		}

		schedule.forEach((item, idx) => {
			message += `<b>${days[idx]}</b>\n`

			item.lessons.forEach((lesson, idx) => {
				const count = idx + 1

				if (count !== lesson.number_lesson) {
					message += `${count}. Нет пары\n`
					return
				}

				const group = lesson.group
				const discipline = lesson.discipline
				const auditoria = lesson.auditoria
				const territory = lesson.territory?.split(')')[0].replace('(', '')

				message += `${count}. ${discipline} ${auditoria} ${territory} Кабинет:${group}\n`
			})
		})

		const options: SendMessageOptions = {
			parse_mode: 'HTML',
		}

		await bot.sendMessage(chatId, message, options)

		return true
	}

	async getBell(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const data = [['№', 'Начало', 'Конец']]

		bells.forEach(({ start, end }, idx) => {
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

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			throw new Error('Не удалось найти чат')
		}

		const user = await UserModel.findOne({ chat: chat._id })
			.populate('teacher')
			.populate('role')
			.populate('activity')
			.populate('division')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const main = []

		if (user.teacher) {
			const [firstName, lastName, patronymic]: string[] = user.teacher.fullName.split(' ')
			const fullName = `${firstName} ${lastName[0]}.${patronymic[0]}`
			main.push(['ФИО', fullName])
		}

		main.push(['Подразделение', user.division.shortName])
		main.push(['Роль', user.role.name])

		const secondary = []

		secondary.push([Commands.getHelp, user.activity.getHelp])
		secondary.push([Commands.getPair, user.activity.getPair])
		secondary.push([Commands.getCabinets, user.activity.getCabinets])
		secondary.push([Commands.getBell, user.activity.getBell])
		secondary.push([Commands.getProfile, user.activity.getProfile])

		const message = `<pre>${CreateTable(main)}</pre>\nСтатистика:\n${CreateTable(secondary)}`

		await bot.sendMessage(chatId, message, {
			parse_mode: 'HTML',
		})

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

export const TeacherService = new Teacher()
