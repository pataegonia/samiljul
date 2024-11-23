const axios = require("axios");
const { crwaling } = require("./crawler/placeCrawler.js"); // 크롤링 함수
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { getPlace } = require("./api/kakaoApi.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 1. 좌표 리스트 (예시로 25개 좌표)
const locations = [{ name: "성북구", position: [37.59629, 127.01603] }];

// 2. 카테고리 리스트
const categories = ["FD6", "CE7", "AT4", "CT1"];

// 3. 각 좌표에 대해 카테고리별 장소 정보 가져오기
async function fetchPlacesForAllLocations() {
  const allPlaces = [];

  for (const loc of locations) {
    console.log(`Fetching places for location: ${loc.name}`);
    const locationPlaces = await getPlace(loc); // 이미 구현된 `getPlace` 함수 사용
    allPlaces.push({ location: loc.name, places: locationPlaces });
    await delay(1000); // 요청 간 1초 대기
  }

  return allPlaces;
}

// 4. 크롤링 및 Firestore에 저장
async function crawlAndStore(allPlaces) {
  for (const { location, places } of allPlaces) {
    for (const [category, placeList] of Object.entries(places)) {
      console.log(`Processing category: ${category} in ${location}`);
      for (const place of placeList) {
        const placeUrl = place.place_url;
        const placeId = place.id;

        if (placeUrl) {
          const { rating } = await crwaling(placeUrl);
          console.log(`Crawled rating for ${place.place_name}: ${rating}`);

          const docRef = db.collection(category).doc(placeId);
          const doc = await docRef.get();

          if (doc.exists) {
            const existingData = doc.data();
            await docRef.set({
              ...existingData,
              rating: rating !== "N/A" ? rating : existingData.rating,
              updateAt: new Date().toISOString(),
            });
          } else {
            await docRef.set({
              place_name: place.place_name,
              place_url: place.place_url,
              road_address_name: place.road_address_name,
              rating,
              updateAt: new Date().toISOString(),
            });
          }
        }
        await delay(2000); // 크롤링 간 2초 대기
      }
    }
  }
}

// 유틸리티: 딜레이 함수
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { fetchPlacesForAllLocations, crawlAndStore };
