import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import { } from 'dotenv'

// Gantikan 'YOUR_TELEGRAM_BOT_TOKEN' dengan token bot yang Anda dapatkan dari BotFather

// const token = '7368378129:AAFyFLKlwNf4O_ffXdQ5dFmzTBGqwQdnnTs';
const token = process.env.TELEGRAM_BOT_TOKEN || '7368378129:AAFyFLKlwNf4O_ffXdQ5dFmzTBGqwQdnnTs';
const bot = new TelegramBot(token, { polling: true });

// Membuat aplikasi express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// const URL = process.env.URL || 'https://bot-wellcome..vercel.app';


bot.setWebHook(`${URL}/bot${token}`)
    .then(() => {
        console.log(`Webhook set to ${URL}/bot${token}`);
    })
    .catch((error) => {
        console.error('Error setting webhook:', error);
    });

// Webhook endpoint
app.post(`/bot${token}`, (req, res) => {
    console.log('Received webhook');
    console.log(req.body);  // Tambahkan log untuk melihat payload yang diterima
    bot.processUpdate(req.body)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.error('Error processing update:', error);
            res.sendStatus(500);
        });
});

app.post('/webhook', (req, res) => {
    try {
        bot.processUpdate(req.body)
        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error)
    }
})


// Menyambut anggota baru
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const newMember = msg.new_chat_members;

  bot.sendMessage(chatId, `WELCOME TO PAVOCOIN, ${newMember.first_name}!`);
});

// Fungsi untuk memulai bot dengan perintah /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! Im a Welcome Bot.');
});

// Fungsi untuk menampilkan informasi Web
bot.onText(/\/web/, (msg) => {
  const chatId = msg.chat.id;
  const webMessage = 'Our Official Website : https://pavocoin.xyz/';
  bot.sendMessage(chatId, webMessage);
});

// Fungsi untuk menampilkan informasi Twitter
bot.onText(/\/twitter/, (msg) => {
  const chatId = msg.chat.id;
  const twitterMessage = 'Our Official X : https://x.com/PavoCoint';
  bot.sendMessage(chatId, twitterMessage);
});

// Fungsi untuk menampilkan informasi Telegram
bot.onText(/\/telegram/, (msg) => {
  const chatId = msg.chat.id;
  const telegramMessage = 'Our Official Telegram : https://t.me/+c2z_F35p-CIxZGU5';
  bot.sendMessage(chatId, telegramMessage);
});

// Fungsi untuk menampilkan informasi Pump
bot.onText(/\/pump/, (msg) => {
  const chatId = msg.chat.id;
  const telegramMessage = 'Pump PavoCoin : https://pump.fun/ECxVCgBYZz6jqwJdnEwWTgByeSR9YXrtyGcr5TLyZ85t';
  bot.sendMessage(chatId, telegramMessage);
});

// Fungsi untuk menampilkan informasi Martket NFT
bot.onText(/\/market/, (msg) => {
  const chatId = msg.chat.id;
  const telegramMessage = 'Market NFT PavoCoin : https://market.pavocoin.xyz/';
  bot.sendMessage(chatId, telegramMessage);
});

// bot untuk trade
bot.onText(/\/trade/, (msg) => {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Buy', callback_data: 'buy' },
          { text: 'Sell', callback_data: 'sell' }
        ]
      ]
    }
  }
  bot.sendMessage(msg.chat.id, 'Please select an options', options)
  // callback trade
  bot.on('callback_query', async (call) => {
    const action = call.data
    const msg = call.message
    const id = msg.chat.id

    if (action === 'buy') {
      bot.sendMessage(msg.chat.id, 'youre choose buy')
      // setTimeout(() => {
      //   bot.sendMessage(id, 'searching marketcap....')
      // }, 1000)
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Buy', callback_data: 'buy' },
              { text: 'Sell', callback_data: 'sell' }
            ]
          ]
        }
      }
      
      bot.sendMessage(id, )

    } else {
      bot.sendMessage(msg.chat.id, 'youre choose sell')
    }
  })
})

bot.onText(/\/get-acc-info/g, async (resp) => {

  bot.sendMessage(resp.chat.id, 'enter a public key of your wallet')
  bot.once('message', async (resp) => {
    const pubKey = resp.text
    const data = await getAccInfo(pubKey)

    const msg = `
your account info
amount : ${(data.lamports / 1_000_000_000).toFixed(5)}
rentEpoch: ${data.rentEpoch}
`
    bot.sendMessage(resp.chat.id, msg)
  })
})

bot.onText(/\/getPavoMarket/g, async (resp) => {

  const msg = `
PAVO coin
marketcap :   
`
  bot.sendMessage(resp.chat.id, msg)
})



// Menyediakan route untuk vercel
app.get('/', (req, res) => {
  res.send('Bot is running...');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log('Bot is running...');