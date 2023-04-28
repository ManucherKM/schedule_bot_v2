import { ProfileModel } from '@/Model'
import { IProfile } from './types'

class Profile {
	async getById(id: string) {
		const profile = await ProfileModel.findById({ _id: id })
		return profile
	}

	async createProfile(target: IProfile) {
		const profile = await ProfileModel.create(target)
		return profile
	}

	async removeProfile(id: string) {
		const res = await ProfileModel.deleteOne({ _id: id })
		return res
	}

	async updateProfile(id: string, target: Partial<IProfile>) {
		const res = await ProfileModel.updateOne({ _id: id }, target)
		return res
	}
}

export const ProfileService = new Profile()
