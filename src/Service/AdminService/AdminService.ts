import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'
import { Menu } from './Buttons/Buttons'

class Admin {
	async getStatistics(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Статистика'

		await bot.sendMessage(chatId, message)

		return true
	}

	async generalMailing(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Рассылка'

		await bot.sendMessage(chatId, message)

		return true
	}

	async start(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Админ'

		await bot.sendMessage(chatId, message, {
			...Menu,
		})

		return true
	}
}

export const AdminService = new Admin()
