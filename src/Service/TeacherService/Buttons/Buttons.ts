import { Commands } from '@/Config'
import type { SendMessageOptions } from 'node-telegram-bot-api'

const Menu: SendMessageOptions = {
	reply_markup: {
		keyboard: [
			[{ text: Commands.getPair }, { text: Commands.getBell }],
			[{ text: Commands.getCabinets }, { text: Commands.getProfile }],
			[{ text: Commands.getHelp }],
		],
		resize_keyboard: true,
	},
}

export { Menu }
