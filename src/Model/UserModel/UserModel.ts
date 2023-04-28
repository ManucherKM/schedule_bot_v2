import { IUser } from '@/Service/types'
import { Schema, model } from 'mongoose'

const UserSchema = new Schema<IUser>({
	chat: { type: Schema.Types.ObjectId, unique: true, required: true, ref: 'Chat' },
	role: { type: Schema.Types.ObjectId, required: true, ref: 'Role' },
	activity: {
		type: Schema.Types.ObjectId,
		unique: true,
		required: true,
		ref: 'Activity',
	},
	division: { type: Schema.Types.ObjectId, required: true, ref: 'Division' },
	teacher: { type: Schema.Types.ObjectId, unique: true, ref: 'Teacher' },
	student: { type: Schema.Types.ObjectId, unique: true, ref: 'Student' },
	tgId: { type: String, unique: true },
})

export const UserModel = model<IUser>('User', UserSchema)
