import { IDivision } from '@/Service/types'
import { model, Schema } from 'mongoose'

const DivisionSchema = new Schema<IDivision>(
	{
		name: { type: String, unique: true, required: true },
		shortName: { type: String, unique: true, required: true },
		description: { type: String, required: true },
	},
	{ timestamps: true },
)

export const DivisionModel = model<IDivision>('Division', DivisionSchema)
