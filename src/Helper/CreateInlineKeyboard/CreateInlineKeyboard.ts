import type { InlineKeyboardButton } from 'node-telegram-bot-api'

function CreateInlineKeyboard(keyboards: InlineKeyboardButton[][]) {
	const keyboard = {
		inline_keyboard: keyboards,
	}

	return keyboard
}

export { CreateInlineKeyboard }
