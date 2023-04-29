import { ProfileModel } from '@/Model'
import { IProfile } from './Types'

class Profile {
	async getById(id: string) {
		const profile = await ProfileModel.findById({ _id: id })
		return profile
	}

	async create(target: IProfile) {
		const profile = await ProfileModel.create(target)
		return profile
	}

	async removeById(id: string) {
		const res = await ProfileModel.deleteOne({ _id: id })
		return res
	}

	async updateById(id: string, target: Partial<IProfile>) {
		const res = await ProfileModel.updateOne({ _id: id }, target)
		return res
	}
}

export const ProfileService = new Profile()
