import { CreateInlineKeyboard } from '@/Helper'
import { UserModel } from '@/Model'
import { Types, UpdateQuery } from 'mongoose'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'
import path from 'path'
import { IDtosUser } from './Types'

class User {
	async getById(id: number) {
		const user = await UserModel.findOne({ chatId: id })
		return user
	}

	async create(target: IDtosUser) {
		const user = await UserModel.create(target)

		if (!user) {
			throw new Error('Не удалось создать пользователя')
		}

		return user
	}

	async update(id: number, updates: UpdateQuery<IDtosUser>) {
		const user = await UserModel.findOne({ chatId: id })

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const updateUser = await UserModel.updateOne({ chatId: id }, { ...updates })

		return updateUser
	}

	async remove(id: number) {
		const user = await UserModel.findOne({ chatId: id })

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const res = await UserModel.deleteOne({ chatId: id })
		const isRemove = !!res.deletedCount

		if (!isRemove) {
			throw new Error('Не удалось удалить пользователя')
		}

		return isRemove
	}

	async getByChatId(chatId: Types.ObjectId) {
		const user = await UserModel.findOne({ chat: chatId })
		return user
	}

	async register(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const sticker = path.join('Sticker', 'run.tgs')

		await bot.sendSticker(chatId, sticker)

		const next = 'Продолжить'

		const message = `Привет ${msg.chat.first_name} 👋\n\nCмотрю ты новенький 👀\n\nПеред тем, как начать пользоваться ботом, тебе необходимо пройти быструю регистрацию.\n\nНажимая кнопку "Продолжить" ты соглашаешься с <a href="https://www.google.com">политикой бота</a>`

		bot.sendMessage(chatId, message, {
			reply_markup: CreateInlineKeyboard([[{ text: next, callback_data: next }]]),
			parse_mode: 'HTML',
		})

		return true
	}
}

export const UserService = new User()
