import { ERoles, adminName } from '@/Config'
import {
	ActivityController,
	ChatController,
	SpkApiController,
	StudentController,
	TeacherController,
	UserController,
} from '@/Controller'
import { ArrayToChunks, CreateInlineKeyboard, GetRegisterValue } from '@/Helper'
import 'dotenv/config'
import mongoose from 'mongoose'
import type { InlineKeyboardButton, SendMessageOptions } from 'node-telegram-bot-api'
import TelegramApi from 'node-telegram-bot-api'
import { commands } from './Config/commands'
import { init } from './Config/init'
import { NextMessage } from './Helper'
import { ICandidate } from './Service/types'
;(async () => {
	const { TOKEN, DB_URL } = process.env

	if (!TOKEN || !DB_URL) {
		console.log('Не удалось найти TOKEN бота или URL от БД')
		return
	}

	try {
		await mongoose.connect(DB_URL)

		console.log('Бот подключился к БД')

		await init()

		const bot = new TelegramApi(TOKEN, { polling: true })

		// Commands
		commands.forEach(({ regexp, func }) => {
			bot.onText(regexp, msg => func(bot, msg))
		})

		const next = 'Продолжить'

		const { divisions, groups, roles, teachers, stages } = await GetRegisterValue()

		const candidats: ICandidate[] = []

		const isHandlerExists = bot.listenerCount('callback_query')

		if (isHandlerExists) {
			return
		}

		bot.on('callback_query', async ({ message, data }) => {
			const msg = message

			if (!msg) {
				return
			}

			const chatId = msg.chat.id

			const idx = candidats.findIndex(p => p.chatId === chatId)

			if (idx === -1) {
				candidats[candidats.length] = { chatId }
			}

			if (!data) {
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

				return bot.sendMessage(chatId, message, options)
			}

			if (divisions.find(d => d.shortName === data)) {
				candidats[idx].division = data

				const btns: InlineKeyboardButton[][] = []

				for (const { name } of roles) {
					btns.push([{ text: name, callback_data: name }])
				}

				const options: SendMessageOptions = { reply_markup: CreateInlineKeyboard(btns), parse_mode: 'HTML' }

				const message = 'Записал ✍\n\nСледующий вопрос.\n\n<b>Выбери свою роль:</b>'

				return bot.sendMessage(chatId, message, options)
			}

			if (data === ERoles.admin) {
				const message = `Чтобы стать администратором напиши <a href="https://t.me/${adminName}">мне</a>`

				return bot.sendMessage(chatId, message, { parse_mode: 'HTML', disable_web_page_preview: true })
			}

			if (data === ERoles.student) {
				candidats[idx].role = data

				const btns: InlineKeyboardButton[][] = []

				for (const stage of stages) {
					btns.push([{ text: stage, callback_data: stage }])
				}

				const options: SendMessageOptions = { reply_markup: CreateInlineKeyboard(btns), parse_mode: 'HTML' }

				const message = 'Записал ✍\n\nСледующий вопрос.\n\n<b>Выбери свой курс:</b>'

				return bot.sendMessage(chatId, message, options)
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

				return bot.sendMessage(chatId, message, options)
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

				return bot.sendMessage(chatId, message)
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

				return bot.sendMessage(chatId, message)
			}
		})

		// Unknown command
		bot.on('message', async msg => {
			const text = msg.text

			if (!text) return

			const isOther = !commands.some(({ regexp }) => regexp.test(text))

			if (isOther) {
				const chatId = msg.chat.id

				if (NextMessage.queque.includes(chatId)) {
					NextMessage.remove(chatId)
					return
				}

				const message = 'Похоже что ты ошибся командой'
				await bot.sendMessage(chatId, message)
			}
		})
	} catch (e) {
		console.log('Не удалось запустить бота\n\n', e)
	}
})()
