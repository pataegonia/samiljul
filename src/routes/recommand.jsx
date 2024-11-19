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
  //const { theme, date, time, location } = selections;
  const [theme, date, time, location] = ["FD6", 12, 12, "강남구"];
  const [recommandations, setRecommandations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchRecommandations = async () => {
      setLoading(true);
      setErr(null);

      try {
        const res = await axios.post("http://localhost:5000/api/recommand", {
          theme,
          date,
          time,
          location,
        });
        setRecommandations(res.data.course);
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
