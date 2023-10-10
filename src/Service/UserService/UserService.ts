import { ERoles, EStage, adminName } from '@/Config'
import {
	ActivityController,
	ChatController,
	DivisionController,
	RoleController,
	SpkApiController,
	StudentController,
	TeacherController,
	UserController,
} from '@/Controller'
import { ArrayToChunks, CreateInlineKeyboard } from '@/Helper'
import { UserModel } from '@/Model'
import { Types, UpdateQuery } from 'mongoose'
import type TelegramApi from 'node-telegram-bot-api'
import type { InlineKeyboardButton, Message, SendMessageOptions } from 'node-telegram-bot-api'
import path from 'path'
import { ICandidate, IDtosUser } from './Types'

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

		const foundChat = await ChatController.getById(chatId)

		if (foundChat) {
			return
		}

		const sticker = path.join(__dirname, '..', '..', 'Sticker', 'run.tgs')

		await bot.sendDocument(chatId, sticker)

		const next = 'Продолжить'

		const message = `Привет ${msg.chat.first_name} 👋\n\nCмотрю ты новенький 👀\n\nПеред тем, как начать пользоваться ботом, тебе необходимо пройти быструю регистрацию.\n\nНажимая кнопку "Продолжить" ты соглашаешься с <a href="https://www.google.com">политикой бота</a>`

		await bot.sendMessage(chatId, message, {
			reply_markup: CreateInlineKeyboard([[{ text: next, callback_data: next }]]),
			parse_mode: 'HTML',
		})

		const roles = await RoleController.getAll()

		if (!roles) {
			throw new Error('Не удалось получить роли')
		}

		const divisions = await DivisionController.getAll()

		if (!divisions) {
			throw new Error('Не удалось получить подразделения')
		}

		const stages: string[] = Object.values(EStage)

		const candidats: ICandidate[] = []

		const groups = await SpkApiController.getGroups()

		if (!groups) {
			throw new Error('Не удалось получить группы')
		}

		const teachers = (await SpkApiController.getTeachers())?.map(t => t.name)

		if (!teachers) {
			throw new Error('Не удалось получить учителей')
		}

		const isHandlerExists = bot.listenerCount('callback_query')

		if (isHandlerExists) return

		bot.on('callback_query', async ({ data }) => {
			const idx = candidats.findIndex(p => p.chatId === chatId)

			if (idx === -1) {
				candidats[candidats.length] = { chatId }
			}

			if (!data) {
				console.log('Не удалось получить параметры кнопки')
				return
			}

			const foundChat = await ChatController.getById(chatId)

			if (foundChat) {
				return
			}

			if (data === next) {
				const btns: InlineKeyboardButton[][] = []

				for (const { shortName } of divisions) {
					btns.push([{ text: shortName, callback_data: shortName }])
				}

				const message =
					'Отлично 🎉\n\nТеперь тебе нужно ответить на пару вопросов.\n\n<b>Выбери структурное подразделение:</b>'

				const options: SendMessageOptions = { reply_markup: CreateInlineKeyboard(btns), parse_mode: 'HTML' }

				return await bot.sendMessage(chatId, message, options)
			}

			if (divisions.find(d => d.shortName === data)) {
				candidats[idx].division = data

				const btns: InlineKeyboardButton[][] = []

				for (const { name } of roles) {
					btns.push([{ text: name, callback_data: name }])
				}

				const options: SendMessageOptions = { reply_markup: CreateInlineKeyboard(btns), parse_mode: 'HTML' }

				const message = 'Записал ✍\n\nСледующий вопрос.\n\n<b>Выбери свою роль:</b>'

				return await bot.sendMessage(chatId, message, options)
			}

			if (data === ERoles.admin) {
				const message = `Чтобы стать администратором напиши <a href="https://t.me/${adminName}">мне</a>`

				return await bot.sendMessage(chatId, message, { parse_mode: 'HTML', disable_web_page_preview: true })
			}

			if (data === ERoles.student) {
				candidats[idx].role = data

				const btns: InlineKeyboardButton[][] = []

				for (const stage of stages) {
					btns.push([{ text: stage, callback_data: stage }])
				}

				const options: SendMessageOptions = { reply_markup: CreateInlineKeyboard(btns), parse_mode: 'HTML' }

				const message = 'Записал ✍\n\nСледующий вопрос.\n\n<b>Выбери свой курс:</b>'

				return await bot.sendMessage(chatId, message, options)
			}

			if (data === ERoles.teacher) {
				candidats[idx].role = data

				const btns: InlineKeyboardButton[] = []

				const teachers = await SpkApiController.getTeachers(candidats[idx].division)

				if (!teachers) {
					const message = 'Бот не смог получить список учителей'
					await bot.sendMessage(chatId, message)
					throw new Error('Не удалось получить учителей')
				}

				for (const { name } of teachers) {
					btns.push({ text: `${name.split(' ')[0]}`, callback_data: name })
				}

				const formatBtns = ArrayToChunks(btns, 4)

				const options: SendMessageOptions = { reply_markup: CreateInlineKeyboard(formatBtns), parse_mode: 'HTML' }

				const message = 'Записал ✍\n\nСледующий вопрос.\n\n<b>Найди себя в списке:</b>'

				return await bot.sendMessage(chatId, message, options)
			}

			if (stages.includes(data)) {
				candidats[idx].stage = data

				const groups = await SpkApiController.getGroups(candidats[idx].division, data)

				if (!groups?.length) {
					await bot.sendMessage(chatId, 'Не удалось найти группы по заданным параметрам')
					return
				}

				const btns: InlineKeyboardButton[] = []

				for (const group of groups) {
					btns.push({ text: group, callback_data: group })
				}

				const formatBtns = ArrayToChunks(btns, 4)

				const options: SendMessageOptions = { reply_markup: CreateInlineKeyboard(formatBtns), parse_mode: 'HTML' }

				const message = 'Записал ✍\n\nСледующий вопрос.\n\n<b>Выбери свою группу:</b>'

				return await bot.sendMessage(chatId, message, options)
			}

			if (groups.includes(data)) {
				candidats[idx].group = data

				const message =
					'Успех 🎉\n\nРегистрация окончена, чтобы использовать функционал бота перезапусти его командой /start	'

				if (!candidats[idx].stage) {
					await bot.sendMessage(chatId, 'Не удалось получить курс студента')
					return
				}

				const student = await StudentController.create({
					group: candidats[idx].group as string,
					stage: candidats[idx].stage as string,
				})

				if (!student) {
					console.log('Не удалось создать учителя')
					return
				}

				const chat = await ChatController.create({ chatId })

				if (!chat) {
					console.log('Не удалось создать чат')
					return
				}

				const activity = await ActivityController.create({})

				if (!activity) {
					console.log('Не удалось создать модель активности')
					return
				}

				const roleId = roles.find(r => r.name === candidats[idx].role)?._id

				if (!roleId) {
					console.log('Не удалось получить роль')
					return
				}

				const divisionId = divisions.find(d => d.shortName === candidats[idx].division)?._id

				if (!divisionId) {
					console.log('Не удалось получить подразделение')
					return
				}

				const user = await UserController.create({
					division: divisionId,
					role: roleId,
					tgId: msg.chat.username,
					student: student._id,
					chat: chat._id,
					activity: activity._id,
				})

				if (!user) {
					console.log('Не удалось создать пользователя "Студент"')
					return
				}

				candidats.splice(idx, 1)

				return await bot.sendMessage(chatId, message)
			}

			if (teachers.includes(data)) {
				candidats[idx].fullName = data

				const message =
					'Успех 🎉\n\nРегистрация окончена, чтобы использовать функционал бота перезапусти его командой /start	'

				const teacher = await TeacherController.create({ fullName: candidats[idx].fullName as string })

				if (!teacher) {
					console.log('Не удалось создать учителя')
					return
				}

				const chat = await ChatController.create({ chatId })

				if (!chat) {
					console.log('Не удалось создать чат')
					return
				}

				const activity = await ActivityController.create({})

				if (!activity) {
					console.log('Не удалось создать модель активности')
					return
				}

				const roleId = roles.find(r => r.name === candidats[idx].role)?._id

				if (!roleId) {
					console.log('Не удалось получить роль')
					return
				}

				const divisionId = divisions.find(d => d.shortName === candidats[idx].division)?._id

				if (!divisionId) {
					console.log('Не удалось получить подразделение')
					return
				}

				const user = await UserController.create({
					division: divisionId,
					role: roleId,
					tgId: msg.chat.username,
					teacher: teacher._id,
					chat: chat._id,
					activity: activity._id,
				})

				if (!user) {
					console.log('Не удалось создать пользователя "Учитель"')
					return
				}

				candidats.splice(idx, 1)

				return await bot.sendMessage(chatId, message)
			}
		})

		return true
	}
}

export const UserService = new User()
