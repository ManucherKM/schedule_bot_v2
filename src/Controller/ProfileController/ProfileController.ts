import { ProfileService } from '@/Service'
import { IProfile } from '@/Service/types'
import { Types } from 'mongoose'

class Profile {
	async getById(id: Types.ObjectId) {
		try {
			if (!id) {
				console.log('Не удалось найти id роли')
				return
			}

			const res = await ProfileService.getById(id)

			if (!res) {
				console.log('Не удалось получить роль')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async create(target: IProfile) {
		try {
			if (!target) {
				console.log('Не удалось найти объект профиля')
				return
			}

			const res = await ProfileService.create(target)

			if (!res) {
				console.log('Не удалось создать профиль')
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
				console.log('ID профиля не найден')
				return
			}

			const res = await ProfileService.removeById(id)

			if (!res) {
				console.log('Не удалось удалить профиль')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async updateById(id: string, target: Partial<IProfile>) {
		try {
			if (!id || !target) {
				console.log('Не удалось найти id роли или объект с изменениями')
				return
			}

			const res = await ProfileService.updateById(id, target)

			if (!res) {
				console.log('Не удалось удалить профиль')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const ProfileController = new Profile()
