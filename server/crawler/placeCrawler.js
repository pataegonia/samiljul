const { copyFileSync } = require("fs");
const puppeteer = require("puppeteer");

async function crwaling(url) {
  console.log(`crawl: ${url}`);
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const rating = await page.evaluate(() => {
      const element = document.querySelector("em.num_rate");
      return element ? element.innerText.trim() : null;
    });
    await browser.close();

    return { rating: rating || "N/A" };
  } catch (err) {
    console.error(err);
    return { rating: "N/A" };
  }
}

module.exports = { crwaling };
