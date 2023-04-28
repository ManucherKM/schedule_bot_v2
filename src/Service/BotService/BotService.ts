import { ERoles } from '@/Config'
import { AdminController, ChatController, StudentController, TeacherController, UserController } from '@/Controller'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'

class Bot {
	async generalMailing(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isAdmin = user.role.name === ERoles.admin

		if (isAdmin) {
			const res = await AdminController.generalMailing(bot, msg)
			return res
		}

		return false
	}

	async getTeacher(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isStudent = user.role.name === ERoles.student

		if (isStudent) {
			const res = await StudentController.getTeacher(bot, msg)
			return res
		}
	}

	async getStatistics(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isAdmin = user.role.name === ERoles.admin

		if (isAdmin) {
			const res = await AdminController.getStatistics(bot, msg)
			return res
		}
	}

	async getCabinets(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isTeacher = user.role.name === ERoles.teacher

		if (isTeacher) {
			const res = await TeacherController.getBell(bot, msg)
			return res
		}
	}

	async getProfile(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isStudent = user.role.name === ERoles.student

		if (isStudent) {
			const res = await StudentController.getProfile(bot, msg)
			return res
		}

		const isTeacher = user.role.name === ERoles.teacher

		if (isTeacher) {
			const res = await TeacherController.getProfile(bot, msg)
			return res
		}
	}

	async getRatings(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isStudent = user.role.name === ERoles.student

		if (isStudent) {
			const res = await StudentController.getRatings(bot, msg)
			return res
		}
	}

	async getPair(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isStudent = user.role.name === ERoles.student

		if (isStudent) {
			const res = await StudentController.getPair(bot, msg)
			return res
		}

		const isTeacher = user.role.name === ERoles.teacher

		if (isTeacher) {
			const res = await TeacherController.getPair(bot, msg)
			return res
		}
	}

	async getBell(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isStudent = user.role.name === ERoles.student

		if (isStudent) {
			const res = await StudentController.getBell(bot, msg)
			return res
		}

		const isTeacher = user.role.name === ERoles.teacher

		if (isTeacher) {
			const res = await TeacherController.getBell(bot, msg)
			return res
		}
	}

	async getHelp(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isStudent = user.role.name === ERoles.student

		if (isStudent) {
			const res = await StudentController.getHelp(bot, msg)
			return res
		}

		const isTeacher = user.role.name === ERoles.teacher

		if (isTeacher) {
			const res = await TeacherController.getHelp(bot, msg)
			return res
		}
	}

	async start(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getChat(chatId)

		if (!chat) {
			const res = await UserController.register(bot, msg)
			return res
		}

		const user = await (await UserController.getByChatId(chat._id))?.populate('role')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isStudent = user.role.name === ERoles.student

		if (isStudent) {
			const res = await StudentController.start(bot, msg)
			return res
		}

		const isTeacher = user.role.name === ERoles.teacher

		if (isTeacher) {
			const res = await TeacherController.start(bot, msg)
			return res
		}

		const isAdmin = user.role.name === ERoles.admin

		if (isAdmin) {
			const res = await AdminController.start(bot, msg)
			return res
		}
	}
}
export const BotService = new Bot()
