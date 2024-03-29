import { ChatModel } from '@/Model'
import { IChat } from './Types'

class Chat {
	async getById(chatId: number) {
		const chat = await ChatModel.findOne({ chatId })
		return chat
	}

	async create(target: IChat) {
		const newChat = await ChatModel.create(target)

		return newChat
	}

	async removeById(chatId: number) {
		const res = await ChatModel.deleteOne({ chatId })
		const isDeleted = !!res.deletedCount
		return isDeleted
	}

	async getAll() {
		return await ChatModel.find()
	}
}

export const ChatService = new Chat()
