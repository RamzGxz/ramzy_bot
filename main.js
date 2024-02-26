require('dotenv').config()
const telebot = require('node-telegram-bot-api')
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
// const scrape = require('./scrape')
const imageScraper = require('./scrape')

// use this to development
const options = {
  polling: true
}
const bot = new telebot(process.env.API_TOKEN, options)

// use this to production
// const bot = new telebot(process.env.API_TOKEN)


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// webHook telebots

// this code to post a webhook
// app.post('/webhook', (req, res) => {
//   try {
//     bot.processUpdate(req.body)
//     res.sendStatus(200)
//   } catch (error) {
//     res.status(500).send(error)
//   }
// })


const cap = (str) => {
  return str
    .toLowerCase()
    .replace(/\w/, firstLetter => firstLetter.toUpperCase());
}

app.post('/sendMessage', (req, res) => {
  const { productName, photo } = req.body

  const msgWebDesign = `
  🎉 Exciting News Alert: Presenting ${cap(productName)} by uistellar.com!
  
  🔗 Ready to elevate your web design game? Explore ${cap(productName)}
  
  Join us as we redefine the standards of web design, one Figma template at a time! 💫
  
  #UIstellarReveals #FigmaDesignMastery #DigitalTransformation 🚀 
`

  try {
    bot.sendPhoto(process.env.CHAT_ID, photo, {
      caption: msgWebDesign
    })
    res.send('sending message')
  } catch (error) {
    res.status(500).send(error)
  }
})

// anounce new member
bot.on('new_chat_members', (resp) => {
  const newMembers = resp.new_chat_members

  newMembers.forEach((member) => {
    const msgSend = `
Hello ${member.first_name} ${member.last_name} Welcome to
UISTELLAR COMMUNITY!💫
We hope your enjoy to this conversations! 🤓
  `
    bot.sendMessage(process.env.CHAT_ID, msgSend)
  })
})

bot.onText(new RegExp('^/start$'), (resp) => {
  const isGroupChat = resp.chat.type === 'group' || resp.chat.type === 'supergroup'
  
  if (isGroupChat) {
    // Percakapan grup
    const msg = `
Hello everyone! Welcome to RamziBOT!
This is a bot for UISTELLAR.
If you want to use this bot for yourself, it's okay.

Here are commands to use RamziBOT:

Information:
/earthquake - to see information about earthquakes in Indonesia
Note: This command is still under update.
/userinfo - to see information about your Telegram account
/getimages - to get an images
`

    bot.sendMessage(resp.chat.id, msg)
  } else {
    // Percakapan personal
    const msg = `
Hello ${resp.from.first_name}! Welcome to RamziBOT!
This is a bot for UISTELLAR.
If you want to use this bot for yourself, it's okay.

Here are commands to use RamziBOT:

Information:
/earthquake - to see information about earthquakes in Indonesia
Note: This command is still under update.
/userinfo - to see information about your Telegram account
/getimages - to get an images
`
    bot.sendMessage(resp.from.id, msg)
  }
})


bot.onText(new RegExp('^/earthquake$'), async (resp) => {
  const data = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
  const respData = await data.json()
  const info = respData.Infogempa.gempa
  const isGroupChat = resp.chat.type === 'group' || resp.chat.type === 'supergroup'
  
    const dataMsg = `
Date : ${info.Tanggal}
Time (Indonesian) : ${info.Jam}
Coordinates : ${info.Coordinates}
Magnitude : ${info.Magnitude} SR
location : ${info.Wilayah}
Potency : ${info.Potensi}
`

  if(isGroupChat) {
    bot.sendPhoto(process.env.CHAT_ID, `https://data.bmkg.go.id/DataMKG/TEWS/${info.Shakemap}`, {
      caption: dataMsg
    })
  } else {
    bot.sendPhoto(resp.from.id, `https://data.bmkg.go.id/DataMKG/TEWS/${info.Shakemap}`, {
      caption: dataMsg
    })
  }
  
})


bot.onText(new RegExp('^/userinfo$'), (resp)=>{
  const isGroupChat = resp.chat.type === 'group' || resp.chat.type === 'supergroup'

  const msg = `
First Name : ${resp.from.first_name}
Last Name : ${resp.from.last_name}
Username : ${resp.from.username}
Laguage : ${resp.from.language_code}
Bot : ${resp.from.is_bot}
`

  if(isGroupChat){
    bot.sendMessage(process.env.CHAT_ID, msg)
  } else{
    bot.sendMessage(resp.from.id, msg)
  }

})

bot.onText(new RegExp('^/getimages$'), (resp)=>{
  const isGroupChat = resp.chat.type === 'group' || resp.chat.type === 'supergroup'
  const question = `
Hello ${resp.from.first_name}!

What name of images do you want to see?   
` 
  if(isGroupChat) {
    bot.sendMessage(process.env.CHAT_ID, question)
    bot.once('message', async (responseMsg)=>{
      bot.sendMessage(process.env.CHAT_ID, 'OK, your image will be visible as soon as possible. please wait!')
      const text = responseMsg.text
      try {
        const result = await imageScraper(text);
      
        for (const item of result) {
          await bot.sendPhoto(process.env.CHAT_ID, item.url, {
            caption: item.title
          })
        }
      
        // Setelah semua foto dikirim, kirim pesan lain
        await bot.sendMessage(process.env.CHAT_ID, 'That\'s all, if you want more please retype /getimages')
      } catch (error) {
        console.error('Error:', error)
      }
      
    })
    
  } else {
    bot.sendMessage(resp.from.id, question)
    bot.once('message', async (responseMsg)=>{
      bot.sendMessage(responseMsg.from.id, 'OK, your image will be visible as soon as possible. please wait!')
      const text = responseMsg.text
      try {
        const result = await imageScraper(text);
      
        for (const item of result) {
          await bot.sendPhoto(responseMsg.from.id, item.url, {
            caption: item.title
          })
        }
      
        // Setelah semua foto dikirim, kirim pesan lain
        await bot.sendMessage(responseMsg.from.id, 'That\'s all, if you want more please retype /getimages')
      } catch (error) {
        console.error('Error:', error)
      }
      
    })
  }
})

app.listen(port, () => {
  console.log(`app listen on http://localhost:${port}`)

  // change this your https url
  // bot.setWebHook('http://localhost:3000/webhook')
})
