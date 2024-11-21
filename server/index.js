const express = require("express");
const cors = require("cors");
const { getPlace } = require("./api/kakaoApi.js");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const schedule = require("node-schedule");
const { crwaling } = require("./crawler/placeCrawler.js");

const app = express();
const port = 4000;

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

      const docRef = db.collection(category).doc(placeId);
      const doc = await docRef.get();

      if (doc.exists) {
        const existingData = doc.data();
        await docRef.set({
          url,
          rating: rating !== "N/A" ? rating : existingData.rating,
          updateAt: new Date().toISOString(),
        });
      } else {
        await docRef.set({
          url,
          rating,
          updateAt: new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchFirestoreData(category, size = 500) {
  const results = [];
  let lastDoc = null;

  while (1) {
    let query = db
      .collection(category)
      .select("rating", "updateAt")
      .limit(size);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    if (snapshot.size < size) break;
    lastDoc = snapshot.docs[snapshot.doc.length - 1];
  }

  return results;
}

async function updatePlaceFire(places) {
  const categories = ["AT4", "CE7", "FD6", "CT1"]; // 관광명소, 카페, 음식점, 문화시설
  const updatedPlaces = {};

  for (const category of categories) {
    if (places[category]) {
      const firesotreData = await fetchFirestoreData(category);

      updatedPlaces[category] = places[category].map((place) => {
        const matchedData = firesotreData.find((data) => data.id === place.id);
        return {
          ...place,
          rating: matchedData ? matchedData.rating : "N/A",
        };
      });

      if (category === "CE7") {
        const leisurePlaces = updatedPlaces["CE7"].filter((place) =>
          place.category_name.includes("여가시설")
        );

        updatedPlaces["CE7"] = updatedPlaces["CE7"].filter(
          (place) =>
            !place.category_name.includes("여가시설") &&
            place.category_name.includes("카페")
        );
      }
    } else {
      updatedPlaces[category] = [];
    }
  }

  return updatedPlaces;
}

app.post("/api/recommand", async (req, res) => {
  const { theme, date, time, location } = req.body;
  console.log("location:", location);
  try {
    const places = await getPlace(location);
    if (places) {
      const updatedPlaces = await updatePlaceFire(places);
      res.json({ date, time, location, course: updatedPlaces });
    } else {
      res.status(500).json({ error: "fail" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server" });
  }
});

app.post("/api/crawl-now", async (req, res) => {
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
