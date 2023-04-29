import { RoleModel } from '@/Model'
import { IRole } from './Types'

class Role {
	async getById(id: string) {
		const role = await RoleModel.findById({ _id: id })
		return role
	}

	async getByName(name: string) {
		const role = await RoleModel.findOne({ name })
		return role
	}

	async create(target: IRole) {
		const role = await RoleModel.create(target)
		return role
	}

	async removeById(id: string) {
		const res = await RoleModel.deleteOne({ _id: id })
		return res
	}

	async updateById(id: string, target: Partial<IRole>) {
		const res = await RoleModel.updateOne({ _id: id }, target)
		return res
	}

	async getAll() {
		const res = await RoleModel.find()
		return res
	}
}

export const RoleService = new Role()
