import { DivisionService } from '@/Service'
import { IDivision } from '@/Service/types'
import { Types } from 'mongoose'

class Division {
	async getById(id: Types.ObjectId) {
		try {
			if (!id) {
				console.log('Не удалось найти id подразделения')
				return
			}

			const res = await DivisionService.getById(id)

			if (!res) {
				console.log('Не удалось получить подразделение')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getByName(name: string) {
		try {
			if (!name) {
				console.log('Не удалось найти имя подразделения')
				return
			}

			const res = await DivisionService.getByName(name)

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async createDivision(target: IDivision) {
		try {
			if (!target) {
				console.log('Не удалось найти объект подразделения')
				return
			}

			const res = await DivisionService.createDivision(target)

			if (!res) {
				console.log('Не удалось создать подразделение')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async removeDivision(id: string) {
		try {
			if (!id) {
				console.log('ID подразделения не найден')
				return
			}

			const res = await DivisionService.removeDivision(id)

			if (!res) {
				console.log('Не удалось удалить подразделение')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async updateDivision(id: string, target: Partial<IDivision>) {
		try {
			if (!id || !target) {
				console.log('Не удалось найти id подразделения или объект с изменениями')
				return
			}

			const res = await DivisionService.updateDivision(id, target)

			if (!res) {
				console.log('Не удалось удалить подразделение')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getAll() {
		try {
			const res = await DivisionService.getAll()

			if (!res) {
				console.log('Не удалось получить подразделения')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const DivisionController = new Division()
