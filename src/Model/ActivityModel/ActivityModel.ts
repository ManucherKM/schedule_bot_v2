import { IActivity } from '@/Service/types'
import { model, Schema } from 'mongoose'

const ActivitySchema = new Schema<IActivity>(
	{
		getRatings: { type: Number, default: 0 },
		getHelp: { type: Number, default: 0 },
		getProfile: { type: Number, default: 0 },
		getPair: { type: Number, default: 0 },
		getTeacher: { type: Number, default: 0 },
		getBell: { type: Number, default: 0 },
		getCabinets: { type: Number, default: 0 },
		getStatistics: { type: Number, default: 0 },
		generalMailing: { type: Number, default: 0 },
		start: { type: Number, default: 0 },
	},
	{ timestamps: true },
)

export const ActivityModel = model<IActivity>('Activity', ActivitySchema)
