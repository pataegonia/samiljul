const { copyFileSync } = require("fs");
const puppeteer = require("puppeteer");

async function crwaling(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const rating = await page.evaluate(() => {
      const element = document.querySelector(".grade-star-num");
      return element ? element.innerText.trim() : "N/A";
    });

    const hours = await page.evaluate(() => {
      const element = document.querySelector(".openhour-info .time");
      return element ? element.innerText.trim() : "N/A";
    });
    await browser.close();

    return { rating, hours };
  } catch (err) {
    console.error(err);
    return { rating: "N/A", hours: "N/A" };
  }
}

module.exports = { crwaling };
