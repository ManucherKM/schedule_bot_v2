import { Bells, Commands, adminName } from '@/Config'
import { ChatController, SpkApiController } from '@/Controller'
import { CreateTable, GetMessageWithSchedule } from '@/Helper'
import { TeacherModel, UserModel } from '@/Model'
import { ITeacher } from '@/Service/types'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message, SendMessageOptions } from 'node-telegram-bot-api'
import { Menu } from './Buttons/Buttons'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

class Teacher {
	async start(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Главное меню'

		const res = await bot.sendMessage(chatId, message, { ...Menu })

		return res
	}

	async create(target: ITeacher) {
		const teacher = await TeacherModel.create(target)
		return teacher
	}

	async getPair(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getById(chatId)

		if (!chat) {
			throw new Error('Не удалось получить чат')
		}

		const user = await UserModel.findOne({ chat: chat._id }).populate('teacher').populate('division')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const schedule = await SpkApiController.getSchedule(user.division.shortName, null, user.teacher?.fullName)

		if (!schedule) {
			console.log('Не удалось получить расписание учителя')
			return
		}

		const message = GetMessageWithSchedule(schedule)

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
		// secondary.push([Commands.getCabinets, user.activity.getCabinets])
		secondary.push([Commands.getBell, user.activity.getBell])
		secondary.push([Commands.getProfile, user.activity.getProfile])

		const message = `Основное\n<pre>${CreateTable(main)}</pre>\nСтатистика:\n<pre>${CreateTable(secondary)}</pre>`

		await bot.sendMessage(chatId, message, {
			parse_mode: 'HTML',
		})

		return true
	}

	async getHelp(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = `Если возникла какая-либо ошибка или есть идеи по улучшению бота пишите <a href="https://t.me/${adminName}">админу</a>`
		const options: SendMessageOptions = {
			parse_mode: 'HTML',
			disable_web_page_preview: true,
		}

		await bot.sendMessage(chatId, message, options)

		return true
	}
}

export const TeacherService = new Teacher()
