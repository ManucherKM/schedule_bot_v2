import { IActivity, IChat, IDivision, IProfile, IRole } from '@/Service/types'
import { Types } from 'mongoose'

interface IStudent {
	stage: string
	group: string
	profile?: IProfile
}

interface ITeacher {
	fullName: string
}

interface IUser {
	chat: IChat
	role: IRole
	division: IDivision
	activity: IActivity
	teacher?: ITeacher
	student?: IStudent
	tgId?: string
}

interface IDtosUser {
	chat: Types.ObjectId
	role: Types.ObjectId
	division: Types.ObjectId
	activity: Types.ObjectId
	teacher?: Types.ObjectId
	student?: Types.ObjectId
	tgId?: string
}

interface ICandidate {
	chatId: number
	division?: string
	role?: string
	stage?: string
	group?: string
	fullName?: string
}

export { IUser, IStudent, ITeacher, ICandidate, IDtosUser }
