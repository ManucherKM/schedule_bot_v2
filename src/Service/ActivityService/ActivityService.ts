import { ActivityController, ChatController, UserController } from '@/Controller'
import { ActivityModel } from '@/Model'
import { Types } from 'mongoose'
import { IActivity } from './types'

class Activity {
	async getById(id: Types.ObjectId) {
		const activity = await ActivityModel.findById({ _id: id })
		return activity
	}

	async createActivity(target: IActivity) {
		const activity = await ActivityModel.create(target)
		return activity
	}

	async removeActivity(id: string) {
		const res = await ActivityModel.deleteOne({ _id: id })
		return res
	}

	async updateActivity(id: Types.ObjectId, target: Partial<IActivity>) {
		const res = await ActivityModel.updateOne({ _id: id }, target)
		return res
	}

	async updateByChat(chatId: number, callback: (prev: IActivity) => Partial<IActivity>) {
		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			throw new Error('Не удалось получить чат')
		}

		const user = await UserController.getByChatId(chat._id)

		if (!user) {
			throw new Error('Не удалось получить пользователя')
		}

		const activity = await ActivityController.getById(user.activity as Types.ObjectId)

		if (!activity) {
			throw new Error('Не удалось получить активность пользователя')
		}

		const res = await ActivityController.updateActivity(user.activity as Types.ObjectId, callback(activity))

		return true
	}
}

export const ActivityService = new Activity()
