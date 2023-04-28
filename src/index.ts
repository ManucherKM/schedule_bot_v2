import 'dotenv/config'
import mongoose from 'mongoose'
import TelegramApi from 'node-telegram-bot-api'
import { commands } from './Config/commands'
import { init } from './Config/init'
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

		// Unknown command
		bot.on('message', async msg => {
			const text = msg.text

			if (!text) return

			const isOther = !commands.some(({ regexp }) => regexp.test(text))

			if (isOther) {
				const chatId = msg.chat.id
				const message = 'Похоже что ты ошибся командой'
				await bot.sendMessage(chatId, message)
			}
		})
	} catch (e) {
		console.log('Не удалось запустить бота\n\n', e)
	}
})()
