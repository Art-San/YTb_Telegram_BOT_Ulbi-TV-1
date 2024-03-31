import connectMongoDB from './db/connectMongoDB.js'
import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
import { gameOptions, againOptions } from './options.js'
import './db/connectMongoDB.js'
import User from './db/models.js'

dotenv.config()
// telegram-bot-game
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадай цифру от 0 до 9, а ты ее должен угадать`
  )

  const randomNumber = Math.floor(Math.random() * 10)
  // console.log(1, randomNumber)
  chats[chatId] = randomNumber

  await bot.sendMessage(chatId, `Отгадай`, gameOptions)
}

const start = async () => {
  connectMongoDB()
  // try {
  //   console.log('Соединение успешно установлено.')
  // } catch (error) {
  //   console.log(0, 'Подключение к БД сломалось')
  // }

  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра число' }
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    try {
      if (text === '/start') {
        const oldUser = await User.findOne({ chatId })
        console.log(0, oldUser)

        if (!oldUser) {
          await User.create({ chatId: chatId })
          await bot.sendPhoto(
            chatId,
            'https://tlgrm.ru/_/stickers/343/879/34387965-f2d4-4e99-b9e9-85e53b0dbd1f/10.jpg'
          )
          return bot.sendMessage(chatId, 'Добро пожаловать в наш бот')
        }

        return bot.sendMessage(chatId, 'Команда старт работает только раз')
      }

      if (text === '/info') {
        const user = await User.findOne({ chatId })
        console.log(0, user)

        return bot.sendMessage(
          chatId,
          // ` ${msg.from.first_name}, `
          ` ${msg.from.first_name}, у тебя неправильных ответов ${user.wrong}, а правильных ${user.right}`
        )
      }
      if (text === '/game') {
        return startGame(chatId)
      }

      return bot.sendMessage(chatId, `Не понимаю я тебя, пробуй еще раз`)
    } catch (error) {
      return bot.sendMessage('Произошла ошибка')
    }
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }

    const user = await User.findOne({ chatId })

    // console.log(2, typeof chats[chatId])
    if (data === String(chats[chatId])) {
      user.right += 1
      // await user.save()
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал цифру ${chats[chatId]}`,
        againOptions
      )
    } else {
      user.wrong += 1
      // await user.save()
      await bot.sendMessage(
        chatId,
        `Ты не угадал цифру ${chats[chatId]}`,
        againOptions
      )
    }
    await user.save()
  })
}

start()
