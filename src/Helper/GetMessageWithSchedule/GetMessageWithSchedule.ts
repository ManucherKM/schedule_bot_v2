import { SupplyReduction } from '../SupplyReduction/SupplyReduction'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

export interface ISchedule {
	date: number
	lessons: {
		number_lesson: number
		discipline: string | undefined
		auditoria: string | undefined
		territory: string | undefined
		group: string | undefined
		teacher: string | undefined
	}[]
}

export function GetMessageWithSchedule(schedule: ISchedule[]) {
	let message = ''

	for (let i = 0; i < schedule.length; i++) {
		const item = schedule[i]

		message += `\n<b>${days[i]}</b>: `

		if (item.lessons.length === 0) {
			message += 'выходной :)'
			continue
		}

		item.lessons.forEach(lesson => {
			const group = lesson.group || '-'
			const discipline = SupplyReduction(lesson.discipline || '-', 26)
			const auditoria = lesson.auditoria || '-'
			const territory = lesson.territory?.split(')')[0].replace('(', '') || '-'

			message += `\n<b>Пара ${
				lesson.number_lesson
			}.</b>\nПредмет: ${discipline}\nМесто: ${auditoria.toLowerCase()}\nПодразделение: ${territory}\nГруппа: ${group}\n`
		})
	}

	return message
}
