const axios = require("axios");
const { query } = require("express");
const apiKey = "dcba6e5cd3ecfda60e104c381a2f0d33";

async function getPlace(keyword, loc) {
  try {
    const res = await axios.get(
      "https://dapi.kakao.com/v2/local/search/keyword.json",
      {
        headers: { Authorization: `KakaoAK ${apiKey}` },
        params: {
          query: keyword,
          x: 126.9784,
          y: 37.5663,
          radius: 5000,
          size: 10,
        },
      }
    );
    return res.data.documents;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = { getPlace };
