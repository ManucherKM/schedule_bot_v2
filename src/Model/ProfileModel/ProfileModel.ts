import { IProfile } from '@/Service/types'
import { model, Schema } from 'mongoose'

const ProfileSchema = new Schema<IProfile>(
	{
		login: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		key: { type: String, unique: true },
		session: { type: String, unique: true },
	},
	{ timestamps: true },
)

export const ProfileModel = model<IProfile>('Profile', ProfileSchema)
