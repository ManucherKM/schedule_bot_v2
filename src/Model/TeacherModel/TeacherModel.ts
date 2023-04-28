import { ITeacher } from '@/Service/types'
import { model, Schema } from 'mongoose'

const TeacherSchema = new Schema<ITeacher>({
	fullName: { type: String, required: true },
})

export const TeacherModel = model<ITeacher>('Teacher', TeacherSchema)
