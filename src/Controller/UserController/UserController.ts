import { UserService } from '@/Service'
import { IDtosUser } from '@/Service/types'
import { Types } from 'mongoose'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'

class User {
	async getById(id: number) {
		try {
			if (!id) {
				console.log('ID пользователя не найден')
				return
			}

			const res = UserService.getById(id)

			if (!res) {
				console.log('Не удалось получить пользователя')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getByChatId(chatId: Types.ObjectId) {
		try {
			if (!chatId) {
				console.log('ID чата не найден')
				return
			}

			const res = UserService.getByChatId(chatId)

			if (!res) {
				console.log('Не удалось получить пользователя')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async create(target: IDtosUser) {
		try {
			if (!target) {
				console.log('Объект кандидата не найден')
				return
			}

			const res = UserService.create(target)

			if (!res) {
				console.log('Не удалось создать пользователя')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async update(id: number, target: Partial<IDtosUser>) {
		try {
			if (!id || !target) {
				console.log('Не удалось найти ID пользователя или объект с обновлениями')
				return
			}

			const res = UserService.update(id, target)

			if (!res) {
				console.log('Не удалось обновить пользователя')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async remove(id: number) {
		try {
			if (!id) {
				console.log('ID пользователя не найден')
				return
			}

			const res = await UserService.remove(id)

			if (!res) {
				console.log('Не удалось удалить пользователя')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async register(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await UserService.register(bot, msg)

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const UserController = new User()
