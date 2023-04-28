import { ChatModel } from '@/Model'
import { IChat } from './types'

class Chat {
	async getChat(chatId: number) {
		const chat = await ChatModel.findOne({ chatId })
		return chat
	}

	async createChat(target: IChat) {
		const newChat = await ChatModel.create(target)

		return newChat
	}

	async removeChat(chatId: number) {
		const res = await ChatModel.deleteOne({ chatId })
		const isDeleted = !!res.deletedCount
		return isDeleted
	}
}

export const ChatService = new Chat()
