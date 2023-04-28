import { DivisionModel } from '@/Model'
import { Types } from 'mongoose'
import { IDivision } from './types'

class Division {
	async getById(id: Types.ObjectId) {
		const division = await DivisionModel.findById({ _id: id })
		return division
	}

	async getByName(name: string) {
		const division = await DivisionModel.findOne({ name })
		return division
	}

	async createDivision(target: IDivision) {
		const division = await DivisionModel.create(target)
		return division
	}

	async removeDivision(id: string) {
		const res = await DivisionModel.deleteOne({ _id: id })
		return res
	}

	async updateDivision(id: string, target: Partial<IDivision>) {
		const res = await DivisionModel.updateOne({ _id: id }, target)
		return res
	}

	async getAll() {
		const res = await DivisionModel.find()
		return res
	}
}

export const DivisionService = new Division()
