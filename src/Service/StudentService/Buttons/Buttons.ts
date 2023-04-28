import { Commands } from '@/Config'
import type { SendMessageOptions } from 'node-telegram-bot-api'

const Menu: SendMessageOptions = {
	reply_markup: {
		keyboard: [
			[{ text: Commands.getPair }, { text: Commands.getRatings }],
			[{ text: Commands.getBell }, { text: Commands.getTeacher }],
			[{ text: Commands.getProfile }, { text: Commands.getHelp }],
		],
		resize_keyboard: true,
	},
}

export { Menu }
