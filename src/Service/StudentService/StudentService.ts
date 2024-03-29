import { Bells, Commands, adminName } from '@/Config'
import { ChatController, ProfileController, SpkApiController, StudentController, UserController } from '@/Controller'
import {
	ArrayToChunks,
	CreateInlineKeyboard,
	CreateTable,
	GetMessageWithSchedule,
	NextMessage,
	SupplyReduction,
} from '@/Helper'
import { StudentModel, UserModel } from '@/Model'
import { IStudent } from '@/Service/types'
import { Types } from 'mongoose'
import type TelegramApi from 'node-telegram-bot-api'
import type { InlineKeyboardButton, Message, SendMessageOptions } from 'node-telegram-bot-api'
import { Menu } from './Buttons/Buttons'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

class Student {
	async start(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Главное меню'

		await bot.sendMessage(chatId, message, {
			...Menu,
		})

		return true
	}

	async create(target: IStudent) {
		const student = await StudentModel.create(target)

		if (!student) {
			throw new Error('Не удалось создать студента')
		}

		return student
	}

	async getPair(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getById(chatId)

		if (!chat) {
			throw new Error('Не удалось получить чат')
		}

		const user = await UserModel.findOne({ chat: chat._id }).populate('student').populate('division')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const schedule = await SpkApiController.getSchedule(user.division.shortName, user.student?.group)

		if (!schedule) {
			await bot.sendMessage(chatId, 'Не удалось получить расписание студента')
			console.log('Не удалось получить расписание студента')
			return
		}

		let message = ''

		for (let i = 0; i < schedule.length; i++) {
			const item = schedule[i]

			message += `\n<b>${days[i]}</b>: `

			if (item.lessons.length === 0) {
				message += 'нет пар'
				continue
			}

			item.lessons.forEach(lesson => {
				const discipline = SupplyReduction(lesson.discipline || '-', 26)
				const auditoria = lesson.auditoria || '-'
				const territory = lesson.territory?.split(')')[0].replace('(', '') || '-'

				message += `\n<b>Пара ${lesson.number_lesson}.</b>\nПредмет: ${discipline}\nМесто: ${auditoria}\nПодразделение: ${territory}\n`
			})
		}

		const res = await bot.sendMessage(chatId, message, { parse_mode: 'HTML' })

		return res
	}

	async getBell(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const data = [['№', 'Начало', 'Конец']]

		Bells.forEach(({ start, end }, idx) => {
			const row = [`${idx + 1}`, `${start}`, `${end}`]
			data.push(row)
		})

		const options: SendMessageOptions = { parse_mode: 'HTML' }

		const table = CreateTable(data)

		const message = '<pre>' + table + '</pre>'

		await bot.sendMessage(chatId, message, options)

		return true
	}

	async getProfile(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getById(chatId)

		if (!chat) {
			throw new Error('Не удалось найти чат')
		}

		const user = await UserModel.findOne({ chat: chat._id })
			.populate('student')
			.populate('role')
			.populate('activity')
			.populate('division')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const main = []

		main.push(['Группа', user.student?.group])
		main.push(['Курс', user.student?.stage])
		main.push(['Подразделение', user.division.shortName])
		main.push(['Роль', user.role.name])

		const secondary = []

		secondary.push([Commands.getHelp, user.activity.getHelp])
		secondary.push([Commands.getPair, user.activity.getPair])
		secondary.push([Commands.getBell, user.activity.getBell])
		secondary.push([Commands.getProfile, user.activity.getProfile])
		secondary.push([Commands.getRatings, user.activity.getRatings])
		secondary.push([Commands.getTeacher, user.activity.getTeacher])

		const message = `Основное\n<pre>${CreateTable(main)}</pre>\nСтатистика:\n<pre>${CreateTable(secondary)}</pre>`

		const res = await bot.sendMessage(chatId, message, { parse_mode: 'HTML' })

		return res
	}

	async getRatings(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const chat = await ChatController.getById(chatId)

		if (!chat) {
			throw new Error('Не удалось найти чат')
		}

		const user = await UserModel.findOne({ chat: chat._id })

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const student = await StudentModel.findById({ _id: user.student })

		if (!student) {
			throw new Error('Не удалось найти студента')
		}

		if (!student.profile) {
			const message = 'Для просмотра оценок необходимо предоставить логин и пароль от учетной записи СПК.'

			await bot.sendMessage(chatId, message)

			const messageForReply = 'Ответь на это сообщение указав свой логин и пароль в формате: ЛОГИН ПАРОЛЬ'

			const { message_id } = await bot.sendMessage(chatId, messageForReply)

			NextMessage.skip(chatId)

			bot.onReplyToMessage(chatId, message_id, async msg => {
				const text = msg.text

				if (!text) return

				const [login, password] = text.split(' ')

				const ratings = await SpkApiController.getRatings(login, password)

				if (!ratings) {
					console.log('Не удалось получить оценки')
					await bot.sendMessage(chatId, 'Неверный логин или пароль')
					return
				}

				const profile = await ProfileController.create({
					login,
					password,
				})

				if (!profile) {
					await bot.sendMessage(chatId, 'Не удалось создать профиль студента')
					console.log('Не удалось создать профиль студента')
					return
				}

				const studentId = user.student as unknown as Types.ObjectId

				const student = await StudentController.update(studentId, { profile: profile._id })

				if (!student) {
					await bot.sendMessage(chatId, 'Не удалось обновить профиль')
					return
				}

				const res = await bot.sendMessage(
					chatId,
					'Данные успешно сохранены\nЧтобы посмотреть оценки введите команду "Оценки"',
				)

				return res
			})

			return true
		}

		const profile = await ProfileController.getById(student.profile as Types.ObjectId)

		if (!profile) {
			await bot.sendMessage(chatId, 'Не удалось получить профиль студента')
			throw new Error('Не удалось получить профиль студента')
		}

		const { login, password } = profile

		const ratings = await SpkApiController.getRatings(login, password)

		if (!ratings) {
			console.log('Не удалось получить оценки')
			await bot.sendMessage(chatId, 'Не удалось получить оценки')
			return
		}

		const data = [['Предмет', 'Оценки', 'Балл']]

		const config: any = {
			columns: [
				{
					width: 13,
					truncate: 30,
				},
				{
					width: 8,
				},
			],
			border: {
				topBody: `-`,
				topJoin: `+`,
				topLeft: `+`,
				topRight: `+`,

				bottomBody: `-`,
				bottomJoin: `+`,
				bottomLeft: `+`,
				bottomRight: `+`,

				bodyLeft: `|`,
				bodyRight: `|`,
				bodyJoin: `|`,

				joinBody: `-`,
				joinLeft: `+`,
				joinRight: `+`,
				joinJoin: `+`,
			},
		}

		ratings.forEach(item => {
			const subject = item.Дисциплина.trim()
			const score = item.СреднийБалл || '-'
			const currentRatings: string[] = []

			item.Оценка.forEach(({ Оценка }) => {
				if (/^\d+$/.test(Оценка[0])) {
					currentRatings.push(Оценка[0])
				}
			})

			data.push([subject, currentRatings.join(', ') || '-', score.toString()])
		})

		const message = '<pre>' + CreateTable(data, config) + '</pre>'

		const options: SendMessageOptions = {
			parse_mode: 'HTML',
		}

		bot.sendMessage(chatId, message, options)

		return true
	}

	async getTeacher(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const foundChat = await ChatController.getById(chatId)

		if (!foundChat) {
			console.log('Не удалось найти чат.')
			return
		}

		const foundUser = await (await UserController.getByChatId(foundChat._id))?.populate('division')

		if (!foundUser) {
			console.log('Не удалось найти пользователя.')
			return
		}

		const message = 'Выбери учителя из списка:'

		const btns: InlineKeyboardButton[] = []

		const teachers = await SpkApiController.getTeachers(foundUser.division.shortName)

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

		await bot.sendMessage(chatId, message, options)

		const isHandlerExists = bot.listenerCount('callback_query') >= 2

		if (isHandlerExists) return

		bot.on('callback_query', async ({ data }) => {
			if (!data) {
				console.log('Не удалось получить параметры кнопки')
				return
			}

			const teacherName = data.split('.')[0]

			const schedule = await SpkApiController.getSchedule(foundUser.division.shortName, null, teacherName)

			if (!schedule) {
				console.log('Не удалось получить расписание учителя')
				return
			}

			const message = GetMessageWithSchedule(schedule)

			await bot.sendMessage(chatId, message, { parse_mode: 'HTML' })
		})

		return true
	}

	async getHelp(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = `Если возникла какая-либо ошибка или есть идеи по улучшению бота пишите <a href="https://t.me/${adminName}">админу</a>`
		const options: SendMessageOptions = {
			parse_mode: 'HTML',
			disable_web_page_preview: true,
		}

		await bot.sendMessage(chatId, message, options)

		return true
	}

	async update(id: Types.ObjectId, target: Partial<IStudent>) {
		const res = await StudentModel.updateOne({ _id: id }, target)
		return res.acknowledged
	}
}

export const StudentService = new Student()
