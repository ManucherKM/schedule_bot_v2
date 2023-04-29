import { RoleService } from '@/Service'
import { IRole } from '@/Service/types'

class Role {
	async getById(id: string) {
		try {
			if (!id) {
				console.log('Не удалось найти id роли')
				return
			}

			const res = await RoleService.getById(id)

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getByName(name: string) {
		try {
			if (!name) {
				console.log('Не удалось найти имя роли')
				return
			}

			const res = await RoleService.getByName(name)

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async create(target: IRole) {
		try {
			if (!target) {
				console.log('Не удалось найти объект роли')
				return
			}

			const res = await RoleService.create(target)

			if (!res) {
				console.log('Не удалось создать роль')
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
				console.log('ID роли не найден')
				return
			}

			const res = await RoleService.removeById(id)

			if (!res) {
				console.log('Не удалось удалить роль')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async updateById(id: string, target: Partial<IRole>) {
		try {
			if (!id || !target) {
				console.log('Не удалось найти id роли или объект с изменениями')
				return
			}

			const res = await RoleService.updateById(id, target)

			if (!res) {
				console.log('Не удалось удалить роль')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getAll() {
		try {
			const res = await RoleService.getAll()

			if (!res) {
				console.log('Не удалось получить список ролей роль')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const RoleController = new Role()
