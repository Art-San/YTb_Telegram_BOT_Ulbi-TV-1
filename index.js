import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
import { gameOptions, againOptions } from './options.js'
import { PrismaClient } from '@prisma/client'

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const prisma = new PrismaClient()
dotenv.config()
const chats = {}
console.log(0, 'chats', chats)

// ====================== Module BOTa =====================
const start = async () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветствие' },
		{ command: '/info', description: 'Получить информацию о пользователе' },
		{ command: '/game', description: 'Игра число' },
	])

	bot.on('message', async (msg) => {
		const text = msg.text
		const chatId = String(msg.chat.id)
		const firstName = msg.chat.first_name

		try {
			if (text === '/start') {
				// const user = await prisma.user.findUnique({ where: { chatId } })
				const user = await getUser(chatId)
				console.log(0, user)
				if (!user) {
					const newUser = await prisma.user.create({
						data: {
							first_name: firstName,
							chatId: chatId,
						},
					})
					await bot.sendPhoto(
						chatId,
						'https://tlgrm.ru/_/stickers/343/879/34387965-f2d4-4e99-b9e9-85e53b0dbd1f/10.jpg'
					)
					return bot.sendMessage(
						chatId,
						`Добро пожаловать в наш бот: ${newUser.first_name}`
					)
				}

				return bot.sendMessage(chatId, `команда старт работает только раз`)
			}

			if (text === '/info') {
				// const user = await prisma.user.findUnique({ where: { chatId } })

				const user = await getUser(chatId)

				return bot.sendMessage(
					chatId,
					` ${user.first_name}, у тебя неправильных ответов ${user.wrong}, а правильных ${user.right}`
				)
			}
			if (text === '/game') {
				return startGame(chatId)
			}

			return bot.sendMessage(chatId, `Не понимаю я тебя, пробуй еще раз`)
		} catch (error) {
			console.log(error)
			return bot.sendMessage(chatId, 'Произошла ошибка 2')
		}
	})

	// ===================
	bot.on('callback_query', async (msg) => {
		const data = msg.data
		const chatId = String(msg.message.chat.id)

		if (data === '/again') {
			return startGame(chatId)
		}

		// const user = await prisma.user.findUnique({ where: { chatId } })
		const user = await getUser(chatId)

		if (data === String(chats[chatId])) {
			user.right += 1

			await bot.sendMessage(
				chatId,
				`Поздравляю, ты угадал цифру ${chats[chatId]}`,
				againOptions
			)
		} else {
			user.wrong += 1

			await bot.sendMessage(
				chatId,
				`Ты не угадал цифру ${chats[chatId]}`,
				againOptions
			)
		}

		// Обновляем оба поля в базе данных
		await prisma.user.update({
			where: { chatId: chatId },
			data: {
				right: user.right,
				wrong: user.wrong,
			},
		})
	})
}

// ===================== отдельные fun  =====================
async function startGame(chatId) {
	await bot.sendMessage(
		chatId,
		`Сейчас я загадай цифру от 0 до 9, а ты ее должен угадать`
	)
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber
	await bot.sendMessage(chatId, `Отгадай`, gameOptions)
}

async function getUser(chatId) {
	try {
		const user = await prisma.user.findUnique({ where: { chatId } })
		return user
	} catch (error) {
		console.log('Ошибка в getUser', error)
		return error
	}
}

start()
