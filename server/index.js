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
      const updatedPlaces = {};

      for (const category of categories) {
        if (places[category]) {
          updatedPlaces[category] = await Promise.all(
            places[category].map(async (place) => {
              const placeId = place.id;
              const docRef = db.collection(category).doc(placeId);
              const doc = await docRef.get();

              let rating = "N/A";
              if (doc.exists) {
                const data = doc.data();
                rating = data.rating || "N/A";
              }

              return {
                category_name: place.category_name,
                id: place.id,
                phone: place.phone,
                place_name: place.place_name,
                place_url: place.place_url,
                road_address_name: place.road_address_name,
                rating,
              };
            })
          );
        } else {
          updatedPlaces[category] = [];
        }
      }

      const leisurePlaces = updatedPlaces["CE7"].filter((place) =>
        place.category_name.includes("여가시설")
      );

      updatedPlaces["CT1"] = [...updatedPlaces["CT1"], ...leisurePlaces];

      updatedPlaces["CE7"] = updatedPlaces["CE7"].filter(
        (place) => !place.category_name.includes("여가시설")
      );
      updatedPlaces["CE7"] = updatedPlaces["CE7"].filter((place) =>
        place.category_name.includes("카페")
      );
      res.json({ date, time, loc, course: updatedPlaces });
    } else {
      res.status(500).json({ error: "fail" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server" });
  }
});

app.post("/api/crawl-now", async (req, res) => {
  console.log("cn");
  console.log(Object.entries(Urls));
  try {
    for (const [category, urls] of Object.entries(Urls)) {
      if (urls && urls.length > 0) {
        console.log(`Category: ${category}, URLs: ${urls.length}`);
        await crawlAndSave(category, urls);
      }
    }
    res.json({ message: "success" });
  } catch (err) {
    res.status(500).json({ error: "fail" });
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
