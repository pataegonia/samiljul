const express = require("express");
const cors = require("cors");
const { getPlace } = require("./api/kakaoApi.js");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { crwaling } = require("./crawler/placeCrawler.js");

const app = express();
const port = 5000;

admin.initializeApp({
  Credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());
const Urls = {};

app.post("/api/recommand", async (req, res) => {
  const { theme, date, time, loc } = req.body;
  try {
    const places = await getPlace(loc);
    if (places) {
      const categories = ["AT4", "CE7", "FD6", "CT1"];
      let isUrlsEmpty = true;

      categories.forEach((category) => {
        if (places[category]) {
          Urls[category] = places[category]
            .map((place) => place.place_url)
            .filter(Boolean);

          if (Urls[category].length > 0) {
            isUrlsEmpty = false;
          }
        }
      });

      if (isUrlsEmpty) {
        for (const [category, urls] of Object.entries(Urls)) {
          for (const url of urls) {
            const { rating, hours } = await crwaling(url);

            const placeID = url.split("/").pop();
            await db.collection(category).doc(placeID).set({
              url,
              rating,
              hours,
              updateAt: new Date().toISOString(),
            });
          }
        }
      }

      res.json({ date, time, loc, course: places });
    } else {
      res.status(500).json({ error: "fail" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server" });
  }
});

app.listen(port, () => {
  console.log("server on");
});
