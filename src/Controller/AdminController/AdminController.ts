import { AdminService } from '@/Service'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'

class Admin {
	async getStatistics(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await AdminService.getStatistics(bot, msg)

			if (!res) {
				console.log('Не удалось отправить статистику')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async generalMailing(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await AdminService.generalMailing(bot, msg)

			if (!res) {
				console.log('Не удалось отправить рассылку')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async start(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await AdminService.start(bot, msg)

			if (!res) {
				console.log('Не удалось отправить стартовое сообщение ')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const AdminController = new Admin()
