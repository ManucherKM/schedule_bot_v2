interface ILesson {
	auditoria: string
	discipline: string
	group: string
	lesson_type: string
	number_lesson: number
	subgroup: number
	teacher: string
	territory: string
}

interface IScheduleItem {
	date: number
	lessons: ILesson[]
}

interface IData {
	schedule: IScheduleItem[]
}

interface IDataSchedule {
	data: IData
	error: string
}

interface ISpkApiSchedule {
	schedule: IDataSchedule
	success: boolean
}

export { ISpkApiSchedule }
