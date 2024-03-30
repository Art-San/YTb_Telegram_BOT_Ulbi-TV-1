import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'
import { gameOptions, againOptions } from './options.js'

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

// uibitv
const chats = {}
// const gameOptions = {
//   reply_markup: {
//     inline_keyboard: [
//       [
//         { text: '1', callback_data: '1' },
//         { text: '2', callback_data: '2' },
//         { text: '3', callback_data: '3' }
//       ],
//       [
//         { text: '4', callback_data: '4' },
//         { text: '5', callback_data: '5' },
//         { text: '6', callback_data: '6' }
//       ],

//       [
//         { text: '7', callback_data: '7' },
//         { text: '8', callback_data: '8' },
//         { text: '9', callback_data: '9' }
//       ],
//       [{ text: '0', callback_data: '0' }]
//     ]
//   }
// }
// const againOptions = {
//   reply_markup: {
//     inline_keyboard: [[{ text: 'Игррать еще раз', callback_data: '/again' }]]
//   }
// }

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас я загадай цифру от 0 до 9, а ты ее должен угадать`
  )

  const randomNumber = Math.floor(Math.random() * 10)
  console.log(1, randomNumber)
  chats[chatId] = randomNumber

  await bot.sendMessage(chatId, `Отгадай`, gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра число' }
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendMessage(
        chatId,
        'https://tlgrm.ru/_/stickers/343/879/34387965-f2d4-4e99-b9e9-85e53b0dbd1f/10.jpg'
      )
      return bot.sendMessage(chatId, 'Добро пожаловать в наш бот')
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
    }
    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, `Не понимаю я тебя, пробуй еще раз`)
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    // console.log(1, typeof data)
    // console.log(2, typeof chats[chatId])
    if (data === String(chats[chatId])) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал цифру ${chats[chatId]}`,
        againOptions
      )
    } else {
      return await bot.sendMessage(
        chatId,
        `Ты не угадал цифру ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
