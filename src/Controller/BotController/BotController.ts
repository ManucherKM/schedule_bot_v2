import { BotService } from '@/Service'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'

class Bot {
	async generalMailing(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await BotService.generalMailing(bot, msg)

			if (!res) {
				console.log('Не удалось отправить рассылку')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getTeacher(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			await BotService.getTeacher(bot, msg)
		} catch (e) {
			console.log(e)
		}
	}

	async getStatistics(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			await BotService.getStatistics(bot, msg)
		} catch (e) {
			console.log(e)
		}
	}

	async getCabinets(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			await BotService.getCabinets(bot, msg)
		} catch (e) {
			console.log(e)
		}
	}

	async getProfile(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			await BotService.getProfile(bot, msg)
		} catch (e) {
			console.log(e)
		}
	}

	async getRatings(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			await BotService.getRatings(bot, msg)
		} catch (e) {
			console.log(e)
		}
	}

	async getPair(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			await BotService.getPair(bot, msg)
		} catch (e) {
			console.log(e)
		}
	}

	async getBell(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			await BotService.getBell(bot, msg)
		} catch (e) {
			console.log(e)
		}
	}

	async getHelp(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			await BotService.getHelp(bot, msg)
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

			await BotService.start(bot, msg)
		} catch (e) {
			console.log(e)
		}
	}
}

export const BotController = new Bot()
