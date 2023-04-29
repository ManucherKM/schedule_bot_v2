import { Types } from 'mongoose'

interface IProfile {
	userId: Types.ObjectId
	login: string
	password: string
	key?: string
	session?: string
}

export { IProfile }
