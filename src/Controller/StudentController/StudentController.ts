import { StudentService } from '@/Service'
import { IStudent } from '@/Service/types'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'

class Student {
	async start(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await StudentService.start(bot, msg)

			if (!res) {
				console.log('Не удалось отправить стартовое сообщение студенту')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async create(target: IStudent) {
		try {
			if (!target) {
				console.log('Не удалось создать студента')
				return
			}

			const res = await StudentService.create(target)

			if (!res) {
				console.log('Не удалось создать студента')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getPair(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await StudentService.getPair(bot, msg)

			if (!res) {
				console.log('Не удалось отправить расписание пар студенту')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getBell(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await StudentService.getBell(bot, msg)

			if (!res) {
				console.log('Не удалось отправить расписание звонков студенту')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getProfile(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await StudentService.getProfile(bot, msg)

			if (!res) {
				console.log('Не удалось отправить сообщение с профилем студенту')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getRatings(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await StudentService.getRatings(bot, msg)

			if (!res) {
				console.log('Не удалось отправить сообщение с оценкми студенту')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getTeacher(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await StudentService.getTeacher(bot, msg)

			if (!res) {
				console.log('Не удалось отправить расписание учителя студенту')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async getHelp(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await StudentService.getHelp(bot, msg)

			if (!res) {
				console.log('Не удалось отправить сообщение о помощи студенту')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const StudentController = new Student()
