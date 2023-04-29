import { ActivityService } from '@/Service'
import { IActivity } from '@/Service/types'
import { Types } from 'mongoose'

class Activity {
	async getById(id: Types.ObjectId) {
		try {
			if (!id) {
				console.log('Не удалось найти id активности')
				return
			}

			const res = await ActivityService.getById(id)

			if (!res) {
				console.log('Не удалось получить активность')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async create(target: IActivity) {
		try {
			if (!target) {
				console.log('Не удалось найти объект активности')
				return
			}

			const res = await ActivityService.create(target)

			if (!res) {
				console.log('Не удалось создать активность')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async removeById(id: string) {
		try {
			if (!id) {
				console.log('ID активности не найден')
				return
			}

			const res = await ActivityService.removeById(id)

			if (!res) {
				console.log('Не удалось удалить активность')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async updateById(id: Types.ObjectId, target: Partial<IActivity>) {
		try {
			if (!id || !target) {
				console.log('Не удалось найти id активности или объект с изменениями')
				return
			}

			const res = await ActivityService.updateById(id, target)

			if (!res) {
				console.log('Не удалось удалить активность')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async updateByChat(chatId: number, callback: (prev: IActivity) => Partial<IActivity>) {
		try {
			if (!chatId || !callback) {
				console.log('Не удалось найти id чата или коллбэк с изменениями')
				return
			}

			const res = await ActivityService.updateByChat(chatId, callback)

			if (!res) {
				console.log('Не удалось удалить активность')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const ActivityController = new Activity()
