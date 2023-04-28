import { SpkApiController } from '@/Controller'
import { CreateTable, SupplyReduction } from '@/Helper'
import { StudentModel, UserModel } from '@/Model'
import { IStudent } from '@/Service/types'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message, SendMessageOptions } from 'node-telegram-bot-api'
import { TableUserConfig } from 'table'
import { Menu } from './Buttons/Buttons'

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
const bells = [
	{
		start: '8:30',
		end: '9:50',
	},
	{
		start: '10:00',
		end: '11:50',
	},
	{
		start: '12:00',
		end: '13:20',
	},
	{
		start: '13:30',
		end: '14:50',
	},
	{
		start: '15:00',
		end: '16:20',
	},
	{
		start: '16:30',
		end: '17:50',
	},
	{
		start: '18:00',
		end: '19:20',
	},
	{
		start: '19:30',
		end: '20:50',
	},
]

class Student {
	async start(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message = 'Главное меню'

		await bot.sendMessage(chatId, message, {
			...Menu,
		})

		return true
	}

	async createStudent(target: IStudent) {
		const student = await StudentModel.create(target)

		if (!student) {
			throw new Error('Не удалось создать студента')
		}

		return student
	}

	async getPair(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const user: any = await UserModel.findOne({ chatId }).populate('student')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const schedule = await SpkApiController.getSchedule(user.division, user.student?.group)

		if (!schedule) {
			console.log('Не удалось получить расписание студента')
			return
		}

		// schedule.forEach((item, idx) => {
		// 	let message = `<b>${days[idx]}</b>\n`
		// 	const data = []

		// 	for (let i = 1; i <= 8; i++) {
		// 		if (!item.lessons[i]) continue

		// 		const number = i.toString()
		// 		const discipline = SupplyReduction(item.lessons[i]?.discipline, 22) || '-'
		// 		const auditoria = item.lessons[i]?.auditoria?.split('№')[1] || '-'
		// 		const territory = item.lessons[i]?.territory?.split(')')[0].replace('(', '') || '-'

		// 		data.push([number, discipline, auditoria, territory])
		// 	}

		// 	data.unshift(['№', 'Предмет', 'Кабинет', 'Подразделение'])

		// 	const table = CreateTable(data)

		// 	message += '<pre style="overflow-x: auto;">' + table + '</pre>\n\n'
		// 	const options: SendMessageOptions = {
		// 		parse_mode: 'HTML',
		// 	}

		// 	bot.sendMessage(chatId, message, options)

		// 	console.log(message)
		// })
		let message = ''

		schedule.forEach((item, idx) => {
			message += `<b>${days[idx]}</b>\n`

			for (let i = 0; i < 8; i++) {
				const number = (i + 1).toString()
				const discipline = SupplyReduction(item.lessons[i]?.discipline, 22) || 'Нет пары'
				const auditoria = item.lessons[i]?.auditoria?.split('№')[1]
				const formatAuditoria = auditoria ? `[${auditoria}]` : ''

				message += `${number}. ` + `${discipline} ` + formatAuditoria + '\n'
			}
		})

		const options: SendMessageOptions = {
			parse_mode: 'HTML',
		}

		bot.sendMessage(chatId, message, options)

		return true
	}

	async getBell(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const data = [['№', 'Начало', 'Конец']]

		bells.forEach(({ start, end }, idx) => {
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

		const user: any = await UserModel.findOne({ chatId }).populate('student')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const data = []

		data.push(['Группа', user.student.group])
		data.push(['Курс', user.student.stage])
		data.push(['Подразделение', user.division])
		data.push(['Роль', user.role])

		const message = '<pre>' + CreateTable(data) + '</pre>'

		const options: SendMessageOptions = {
			parse_mode: 'HTML',
		}

		await bot.sendMessage(chatId, message, options)

		return true
	}

	async getRatings(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const user: any = await UserModel.findOne({ chatId }).populate('student')

		if (!user) {
			throw new Error('Не удалось найти пользователя')
		}

		const isKeys = !user.student.profile

		if (isKeys) {
			const message = 'Для просмотра оценок необходимо предоставить логин и пароль от учетной записи СПК'

			const { message_id } = await bot.sendMessage(chatId, message)

			bot.onReplyToMessage(chatId, message_id, async msg => {
				const student = await StudentModel.findOne({ chatId })

				if (!student) {
					throw new Error('Не удалось найти студента')
				}

				const { text } = msg

				if (!text) return

				const [login, password] = text.split(' ')

				const target = {
					profile: {
						login,
						password,
					},
				} as IStudent

				const updateStudent = await StudentModel.updateOne({ chatId }, target)

				console.log(updateStudent.acknowledged)

				if (!updateStudent.acknowledged) {
					const message = 'Не удалось обновить профиль'

					await bot.sendMessage(chatId, message)
					return
				}

				const message = 'Данные успешно сохранены\nЧтобы посмотреть оценки введите команду "Оценки"'

				await bot.sendMessage(chatId, message)
			})

			return
		}

		const { login, password } = user.student.profile

		const ratings = await SpkApiController.getRatings(login, password)

		if (!ratings) {
			bot.sendMessage(chatId, 'Не удалось получить оценки')
			return
		}

		const data = [['Предмет', 'Оценки', 'Балл']]

		const config: TableUserConfig = {
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
			console.log(currentRatings)

			data.push([subject, currentRatings.join(', ') || '-', score.toString()])
		})
		console.log(CreateTable(data, config))

		const message = '<pre>' + CreateTable(data, config) + '</pre>'

		const options: SendMessageOptions = {
			parse_mode: 'HTML',
		}

		bot.sendMessage(chatId, message, options)

		return true
	}

	async getTeacher(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id

		const message = 'Учителя'

		const options: SendMessageOptions = {}

		await bot.sendMessage(chatId, message, options)

		return true
	}

	async getHelp(bot: TelegramApi, msg: Message) {
		const chatId = msg.chat.id
		const message =
			'Если возникла какая-либо ошибка или есть идеи по улучшению бота пишите <a href="https://t.me/Manucher0504">админу</a>'
		const options: SendMessageOptions = {
			parse_mode: 'HTML',
			disable_web_page_preview: true,
		}

		await bot.sendMessage(chatId, message, options)

		return true
	}
}

export const StudentService = new Student()
