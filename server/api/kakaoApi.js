const axios = require("axios");
const apiKey = "dcba6e5cd3ecfda60e104c381a2f0d33";

async function fetchPlace(categoryCode, loc) {
  const results = [];
  const size = 15;
  let page = 1;
  let isLastPage = false;
  try {
    while (!isLastPage && page <= 4) {
      const res = await axios.get(
        "https://dapi.kakao.com/v2/local/search/category.json",
        {
          headers: { Authorization: `KakaoAK ${apiKey}` },
          params: {
            category_group_code: categoryCode,
            x: 126.9784,
            y: 37.5663,
            radius: 5000,
            size,
            page,
          },
        }
      );

      results.push(...res.data.documents);

      if (res.data.documents.length < size) {
        isLastPage = true;
      } else {
        page++;
      }
    }
    return results;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getPlace(loc) {
  const categories = ["FD6", "CE7", "AT4", "CT1"];
  const results = {};

  try {
    const promises = categories.map((category) => fetchPlace(category, loc));
    const responses = await Promise.all(promises);

    categories.forEach((category, idx) => {
      results[category] = responses[idx];
    });
    return results;
  } catch (err) {
    console.error(err);
    return {};
  }
}

module.exports = { getPlace };
