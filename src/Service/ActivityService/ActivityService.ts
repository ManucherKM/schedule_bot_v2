import { ActivityController, ChatController, UserController } from '@/Controller'
import { ActivityModel } from '@/Model'
import { Types } from 'mongoose'
import { IActivity } from './Types'

class Activity {
	async getById(id: Types.ObjectId) {
		const activity = await ActivityModel.findById({ _id: id })
		return activity
	}

	async create(target: IActivity) {
		const activity = await ActivityModel.create(target)
		return activity
	}

	async removeById(id: string) {
		const res = await ActivityModel.deleteOne({ _id: id })
		return res
	}

	async updateById(id: Types.ObjectId, target: Partial<IActivity>) {
		const res = await ActivityModel.updateOne({ _id: id }, target)
		return res
	}

	async updateByChat(chatId: number, callback: (prev: IActivity) => Partial<IActivity>) {
		const chat = await ChatController.getById(chatId)

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

		const res = await ActivityController.updateById(user.activity as Types.ObjectId, callback(activity))

		return res?.acknowledged
	}
}

export const ActivityService = new Activity()
