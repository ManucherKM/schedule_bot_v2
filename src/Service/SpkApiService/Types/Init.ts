interface IAudience {
	id: string
	name: string
	short_name?: string
}

interface IDiscipline {
	id: string
	name: string
}

interface IDivision {
	id: string
	name: string
}

interface IEducation {
	id: string
	name: string
}

interface IGroup {
	curse: string
	division: string
	id: string
	name: string
}

interface ILessonType {
	id: string
	name: string
}

interface ISemester {
	id: string
	name: string
}

interface ISpecialization {
	id: string
	name: string
}

interface ITeacher {
	divisions: string[]
	id: string
	name: string
}

interface ITerritorie {
	id: string
	name: string
}

interface IWorkSemester {
	id: string
	name: string
}

interface IDataSPKApi {
	audithories: IAudience[]
	disciplines: IDiscipline[]
	divisions: IDivision[]
	edu_types: IEducation[]
	groups: IGroup[]
	lesson_Types: ILessonType[]
	semesters: ISemester[]
	specializations: ISpecialization[]
	teachers: ITeacher[]
	territories: ITerritorie[]
	work_semesters: IWorkSemester[]
}

interface IBaseInfo {
	data: IDataSPKApi
	error: string
}

interface ISpkApiInit {
	baseInfo: IBaseInfo
	success: boolean
}

export { ISpkApiInit, ITeacher }
