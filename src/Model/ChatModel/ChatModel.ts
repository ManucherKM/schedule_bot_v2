import { IChat } from '@/Service/types'
import { model, Schema } from 'mongoose'

const ChatSchema = new Schema<IChat>(
	{
		chatId: { type: Number, required: true, unique: true },
	},
	{ timestamps: true },
)

export const ChatModel = model<IChat>('Chat', ChatSchema)
