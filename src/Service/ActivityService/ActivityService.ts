import { ActivityModel } from '@/Model'
import { IActivity } from './types'

class Activity {
	async getById(id: string) {
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

	async updateActivity(id: string, target: Partial<IActivity>) {
		const res = await ActivityModel.updateOne({ _id: id }, target)
		return res
	}
}

export const ActivityService = new Activity()
