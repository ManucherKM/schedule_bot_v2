import { Commands } from '@/Config'
import { ActivityController, ChatController } from '@/Controller'
import { CreateTable, NextMessage } from '@/Helper'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'
import { Menu } from './Buttons/Buttons'

class Admin {
	async getStatistics(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const activities: any[] | undefined = await ActivityController.getAll()

		if (!activities) {
			const message = 'Не удалось получить активность пользователей.'
			await bot.sendMessage(chatId, message)
			console.log(message)
			return
		}

		const activity = {
			getRatings: 0,
			getHelp: 0,
			getProfile: 0,
			getPair: 0,
			getTeacher: 0,
			getBell: 0,
			getCabinets: 0,
			getStatistics: 0,
			generalMailing: 0,
			start: 0,
		}

		for (const item of activities) {
			activity.getRatings += item.getRatings
			activity.getHelp += item.getHelp
			activity.getProfile += item.getProfile
			activity.getPair += item.getPair
			activity.getTeacher += item.getTeacher
			activity.getBell += item.getBell
			activity.getCabinets += item.getCabinets
			activity.getStatistics += item.getStatistics
			activity.generalMailing += item.generalMailing
			activity.start += item.start
		}

		const data = []

		data.push([Commands.getRatings, activity.getRatings])
		data.push([Commands.getHelp, activity.getHelp])
		data.push([Commands.getProfile, activity.getProfile])
		data.push([Commands.getPair, activity.getPair])
		data.push([Commands.getTeacher, activity.getTeacher])
		data.push([Commands.getBell, activity.getBell])
		data.push([Commands.getStatistics, activity.getStatistics])
		data.push([Commands.generalMailing, activity.generalMailing])
		data.push([Commands.start, activity.start])

		const message = 'Статистика:\n\n' + `<pre>${CreateTable(data)}</pre>`

		await bot.sendMessage(chatId, message, { parse_mode: 'HTML' })

		return true
	}

	async generalMailing(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Рассылка'

		const chats: any[] | undefined = await ChatController.getAll()

		if (!chats) {
			const message = 'Не удалось получить список чатов.'
			await bot.sendMessage(chatId, message)
			return
		}

		const { message_id } = await bot.sendMessage(
			chatId,
			'Введите сообщение которое вы хотите разослать (нужно ответить на это сообщение).',
		)

		NextMessage.skip(chatId)

		bot.onReplyToMessage(chatId, message_id, async msg => {
			const text = msg.text

			if (!text) {
				console.log('Не удалось найти текст для рассылки.')
				return
			}

			for (const chat of chats) {
				await bot.sendMessage(chat.chatId, text)
			}
		})

		return true
	}

	async start(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Главное меню'

		await bot.sendMessage(chatId, message, {
			...Menu,
		})

		return true
	}
}

export const AdminService = new Admin()
