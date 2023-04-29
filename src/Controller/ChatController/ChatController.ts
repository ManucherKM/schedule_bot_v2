import { ChatService } from '@/Service'
import { IChat } from '@/Service/types'

class Chat {
	async getById(chatId: number) {
		try {
			if (!chatId) {
				console.log('ID чата не найден')
				return
			}

			const res = await ChatService.getById(chatId)

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async create(target: IChat) {
		try {
			if (!target) {
				console.log('Не удалось найти объект чата')
				return
			}

			const res = await ChatService.create(target)

			if (!res) {
				console.log('Не удалось создать чат')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async removeById(chatId: number) {
		try {
			if (!chatId) {
				console.log('ID чата не найден')
				return
			}

			const res = await ChatService.removeById(chatId)

			if (!res) {
				console.log('Не удалось создать чат')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const ChatController = new Chat()
