import { ActivityService } from '@/Service'
import { IActivity } from '@/Service/types'

class Activity {
	async getById(id: string) {
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

	async createActivity(target: IActivity) {
		try {
			if (!target) {
				console.log('Не удалось найти объект активности')
				return
			}

			const res = await ActivityService.createActivity(target)

			if (!res) {
				console.log('Не удалось создать активность')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async removeActivity(id: string) {
		try {
			if (!id) {
				console.log('ID активности не найден')
				return
			}

			const res = await ActivityService.removeActivity(id)

			if (!res) {
				console.log('Не удалось удалить активность')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async updateActivity(id: string, target: Partial<IActivity>) {
		try {
			if (!id || !target) {
				console.log('Не удалось найти id активности или объект с изменениями')
				return
			}

			const res = await ActivityService.updateActivity(id, target)

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
