import { Commands } from '@/Config'
import type { SendMessageOptions } from 'node-telegram-bot-api'

const Menu: SendMessageOptions = {
	reply_markup: {
		keyboard: [[{ text: Commands.getStatistics }], [{ text: Commands.generalMailing }]],
		resize_keyboard: true,
	},
}

export { Menu }
