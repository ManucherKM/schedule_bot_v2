import { BotController } from '@/Controller'
import type TelegramApi from 'node-telegram-bot-api'
import type { Message } from 'node-telegram-bot-api'
import { Commands } from '.'

interface ICommand {
	regexp: RegExp
	func: (bot: TelegramApi, msg: Message) => void
}

export const commands: ICommand[] = [
	{
		regexp: new RegExp(`${Commands.generalMailing}`),
		func: async (bot, msg) => BotController.generalMailing(bot, msg),
	},
	{
		regexp: new RegExp(`${Commands.getTeacher}`),
		func: async (bot, msg) => BotController.getTeacher(bot, msg),
	},
	{
		regexp: new RegExp(`${Commands.getStatistics}`),
		func: async (bot, msg) => BotController.getStatistics(bot, msg),
	},
	// {
	// 	regexp: new RegExp(`${Commands.getCabinets}`),
	// 	func: async (bot, msg) => BotController.getCabinets(bot, msg),
	// },
	{
		regexp: new RegExp(`${Commands.getProfile}`),
		func: async (bot, msg) => BotController.getProfile(bot, msg),
	},
	{
		regexp: new RegExp(`${Commands.getRatings}`),
		func: async (bot, msg) => BotController.getRatings(bot, msg),
	},
	{
		regexp: new RegExp(`${Commands.getPair}`),
		func: async (bot, msg) => BotController.getPair(bot, msg),
	},
	{
		regexp: new RegExp(`${Commands.getBell}`),
		func: async (bot, msg) => BotController.getBell(bot, msg),
	},
	{
		regexp: new RegExp(`${Commands.getHelp}`),
		func: async (bot, msg) => BotController.getHelp(bot, msg),
	},
	{
		regexp: new RegExp(`${Commands.start}`),
		func: async (bot, msg) => BotController.start(bot, msg),
	},
]
