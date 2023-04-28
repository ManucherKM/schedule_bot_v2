import type TelegramApi from 'node-telegram-bot-api'
import type { EditMessageTextOptions, Message, SendMessageOptions } from 'node-telegram-bot-api'

async function ChangeableMessage(
	bot: TelegramApi,
	incomingMsg: Message,
	initialMsg: string,
	options?: SendMessageOptions | undefined,
) {
	const chatId = incomingMsg.chat.id

	const { message_id } = await bot.sendMessage(chatId, initialMsg, options)

	return async function (msg: string, options?: Omit<EditMessageTextOptions, 'chat_id' | 'message_id'>) {
		return await bot.editMessageText(msg, {
			chat_id: chatId,
			message_id,
			...options,
		})
	}
}

export { ChangeableMessage }
