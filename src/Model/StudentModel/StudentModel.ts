import { IStudent } from '@/Service/types'
import { model, Schema } from 'mongoose'

const StudentSchema = new Schema<IStudent>({
	stage: { type: String, required: true },
	group: { type: String, required: true },
	profile: {
		type: Schema.Types.ObjectId,
		unique: true,
		ref: 'Profile',
	},
})

export const StudentModel = model<IStudent>('Student', StudentSchema)
