import { IRole } from '@/Service/types'
import { model, Schema } from 'mongoose'

const RoleSchema = new Schema<IRole>(
	{
		name: { type: String, unique: true, required: true },
		description: { type: String, required: true },
	},
	{ timestamps: true },
)

export const RoleModel = model<IRole>('Role', RoleSchema)
