import { DivisionController, RoleController } from '@/Controller'
import { IDivision, IRole } from '@/Service/types'
import { EDivision, ERoles } from '.'

const roles: IRole[] = [
	{
		name: ERoles.admin,
		description: 'Управляет ботом',
	},
	{
		name: ERoles.student,
		description: 'Использует функционал студента',
	},
	{
		name: ERoles.teacher,
		description: 'Использует функционал учителя',
	},
]

const divisions: IDivision[] = [
	{
		name: 'Структурное подразделение 1',
		shortName: EDivision.SP1,
		description: 'Описание подразделения',
	},
	{
		name: 'Структурное подразделение 2',
		shortName: EDivision.SP2,
		description: 'Описание подразделения',
	},
	{
		name: 'Структурное подразделение 3',
		shortName: EDivision.SP3,
		description: 'Описание подразделения',
	},
	{
		name: 'Структурное подразделение 4',
		shortName: EDivision.SP4,
		description: 'Описание подразделения',
	},
]

export async function init() {
	for (const role of roles) {
		const candidate = await RoleController.getByName(role.name)

		if (candidate) continue

		await RoleController.createRole(role)
	}

	for (const division of divisions) {
		const candidate = await DivisionController.getByName(division.name)

		if (candidate) continue

		await DivisionController.createDivision(division)
	}
}
