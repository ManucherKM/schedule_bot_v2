import { ChatService } from '@/Service'
import { IChat } from '@/Service/types'

class Chat {
	async getChat(chatId: number) {
		try {
			if (!chatId) {
				console.log('ID чата не найден')
				return
			}

			const res = await ChatService.getChat(chatId)

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async createChat(target: IChat) {
		try {
			if (!target) {
				console.log('Не удалось найти объект чата')
				return
			}

			const res = await ChatService.createChat(target)

			if (!res) {
				console.log('Не удалось создать чат')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async removeChat(chatId: number) {
		try {
			if (!chatId) {
				console.log('ID чата не найден')
				return
			}

			const res = await ChatService.removeChat(chatId)

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
