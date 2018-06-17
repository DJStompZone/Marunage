// const puppeteer = require('puppeteer');
// const { launchhOption } = require('../../config/puppeteer.config');

// module.exports = class Browser {
//   constructor({ url }) {
//     this.url = url;
//   }

//   async go({ task }) {
//     const browser = await puppeteer.launch(launchhOption);
//     const page = await browser.newPage();
//     await page.goto(this.url, { waitUntil: 'networkidle2' });
//     await task({ page });
//     await browser.close();
//   }
// };
