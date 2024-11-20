const express = require("express");
const cors = require("cors");
const { getPlace } = require("./api/kakaoApi.js");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const schedule = require("node-schedule");
const { crwaling } = require("./crawler/placeCrawler.js");

const app = express();
const port = 5000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());
const Urls = {};

async function crawlAndSave(category, urls) {
  try {
    for (const url of urls) {
      console.log(`Crawling URL: ${url}`);
      const { rating } = await crwaling(url);

      const placeId = url.split("/").pop();
      console.log(`Saving to Firestore: ${category} - ${placeId}`);
      await db.collection(category).doc(placeId).set({
        url,
        rating,
        updateAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error(err);
  }
}

app.post("/api/recommand", async (req, res) => {
  const { theme, date, time, loc } = req.body;
  try {
    const places = await getPlace(loc);
    if (places) {
      const categories = ["AT4", "CE7", "FD6", "CT1"];

      categories.forEach((category) => {
        if (places[category]) {
          Urls[category] = places[category]
            .map((place) => place.place_url)
            .filter(Boolean);
        }
      });
      res.json({ date, time, loc, course: places });
    } else {
      res.status(500).json({ error: "fail" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server" });
  }
});

schedule.scheduleJob("0 3 * * *", async () => {
  try {
    for (const [category, urls] of Object.entries(Urls)) {
      if (urls && urls.length > 0) {
        await crawlAndSave(category, urls);
      }
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log("server on");
});
