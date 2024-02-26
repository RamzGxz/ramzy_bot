// const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const scraper = require('images-scraper')


// const scrape = async () => {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
//   await page.goto('https://uistellar.com/products', {
//     waitUntil: 'networkidle0'
//   })
//   const html = await page.content()
//   const $ = cheerio.load(html)
//   $('#cardAssets').each((index, el)=>{
//     console.log($(el).find('button').text())
//   })

// }

// scrape()

const google = new scraper({
  puppeteer : {
    headless: true
  }
})


const imageScraper = async (query) => {
  const result = await google.scrape(query, 5)
  return result
}

module.exports = imageScraper