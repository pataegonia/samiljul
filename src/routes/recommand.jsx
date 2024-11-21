import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

// 스타일 설정 (필요시 수정 가능)
const Loading = styled.div`
  font-size: 24px;
  color: #333;
  text-align: center;
`;

const Error = styled.div`
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const RecommendationsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecommendationItem = styled.li`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default function Recommand({ selections }) {
  console.log(selections);
  const { theme, date, time, location } = selections;
  const [recommandations, setRecommandations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  function extractPlaces(course) {
    const filteredPlace = {};

    Object.entries(course).forEach(([key, category]) => {
      if (Array.isArray(category)) {
        filteredPlace[key] = category
          .filter(
            (item) =>
              item.road_address_name &&
              item.road_address_name.includes(location.name)
          )
          .map((place) => ({
            category_name: place.category_name,
            id: place.id,
            phone: place.phone,
            place_name: place.place_name,
            place_url: place.place_url,
            rating: place.rating || "N/A",
            road_address_name: place.road_address_name,
          }));
      } else {
        filteredPlace[key] = [];
      }
    });
    return filteredPlace;
  }

  function getTopRatedPlaces(filteredPlaces) {
    const topRatedPlaces = {};

    Object.entries(filteredPlaces).forEach(([category, places]) => {
      if (Array.isArray(places)) {
        topRatedPlaces[category] = places
          .filter((place) => place.rating !== "N/A")
          .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
          .slice(0, 10);
      } else {
        topRatedPlaces[category] = [];
      }
    });

    return topRatedPlaces;
  }

  useEffect(() => {
    const fetchRecommandations = async () => {
      setLoading(true);
      setErr(null);

      try {
        const res = await axios.post("http://localhost:4000/api/recommand", {
          theme,
          date,
          time,
          location,
        });
        const places = extractPlaces(res.data.course);
        const topRatedPlaces = getTopRatedPlaces(places);
        setRecommandations(topRatedPlaces);
      } catch (error) {
        setErr("fail to load");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommandations();
  }, [theme, date, time, location]);

  console.log(recommandations);
  return (
    <div>
      <h1>추천 코스</h1>

      {/* 로딩 화면 */}
      {loading && <Loading>로딩 중...</Loading>}

      {/* 오류 메시지 */}
      {err && <Error>{err}</Error>}

      {/* 추천 장소 목록 */}
      {!loading && !err && recommandations.length > 0 && (
        <RecommendationsList>
          {recommandations.map((place, index) => (
            <RecommendationItem key={index}>
              <h3>{place.place_name}</h3>
              <p>{place.road_address_name || place.address_name}</p>
              <p>전화번호: {place.phone || "정보 없음"}</p>
              <a
                href={place.place_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                자세히 보기
              </a>
            </RecommendationItem>
          ))}
        </RecommendationsList>
      )}

      {/* 데이터가 없는 경우 */}
      {!loading && !err && recommandations.length === 0 && (
        <p>추천할 장소가 없습니다.</p>
      )}
    </div>
  );
}
