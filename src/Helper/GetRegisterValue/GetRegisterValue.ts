import { EStage } from '@/Config'
import { DivisionController, RoleController, SpkApiController } from '@/Controller'

export async function GetRegisterValue() {
	const roles = await RoleController.getAll()

	if (!roles) {
		throw new Error('Не удалось получить роли')
	}

	const divisions = await DivisionController.getAll()

	if (!divisions) {
		throw new Error('Не удалось получить подразделения')
	}

	const groups = await SpkApiController.getGroups()

	if (!groups) {
		throw new Error('Не удалось получить группы')
	}

	const teachers = (await SpkApiController.getTeachers())?.map(t => t.name)

	if (!teachers) {
		throw new Error('Не удалось получить учителей')
	}

	const stages: string[] = Object.values(EStage)

	return {
		teachers,
		groups,
		divisions,
		roles,
		stages,
	}
}
