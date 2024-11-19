const axios = require("axios");
const apiKey = "dcba6e5cd3ecfda60e104c381a2f0d33";

async function getPlace(categoryCode, loc) {
  const result = [];
  const size = 15;
  try {
    const res = await axios.get(
      "https://dapi.kakao.com/v2/local/search/category.json",
      {
        headers: { Authorization: `KakaoAK ${apiKey}` },
        params: {
          category_group_code: categoryCode,
          x: 126.9784,
          y: 37.5663,
          radius: 5000,
          size: 15,
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
