import { TeacherService } from '@/Service'
import { ITeacher } from '@/Service/types'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'

class Teacher {
	async start(bot: TelegramApi, msg: Message) {
		try {
			if (!bot || !msg) {
				console.log('Не удалось найти объект бота или сообщения')
				return
			}

			const res = await TeacherService.start(bot, msg)

			if (!res) {
				console.log('Не удалось отправить стартовое сообщение учителю')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}

	async create(target: ITeacher) {
		try {
			if (!target) {
				console.log('Не удалось создать учителя')
				return
			}

			const res = await TeacherService.create(target)

			if (!res) {
				console.log('Не удалось создать учителя')
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

			const res = await TeacherService.getPair(bot, msg)

			if (!res) {
				console.log('Не удалось отправить сообщение с расписанием учителю')
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

			const res = await TeacherService.getBell(bot, msg)

			if (!res) {
				console.log('Не удалось отправить сообщение со звонками учителю')
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

			const res = await TeacherService.getProfile(bot, msg)

			if (!res) {
				console.log('Не удалось отправить сообщение с профилем учителю')
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

			const res = await TeacherService.getHelp(bot, msg)

			if (!res) {
				console.log('Не удалось отправить сообщение о помощи учителю')
				return
			}

			return res
		} catch (e) {
			console.log(e)
		}
	}
}

export const TeacherController = new Teacher()
