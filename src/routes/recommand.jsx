import axios from "axios";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// 스타일 컴포넌트 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border-radius: 16px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Subtitle = styled.p`
  color: #dcdcdc;
  font-size: 1rem;
  margin-top: 10px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.7s ease-in-out;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #ff758c, #ff7eb3);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  position: absolute;
  top: 20px;
  left: 20px;
  box-shadow: 0px 4px 15px rgba(255, 118, 117, 0.5);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: linear-gradient(135deg, #ff7eb3, #ff758c);
    box-shadow: 0px 6px 20px rgba(255, 118, 117, 0.7);
  }
`;

const Loading = styled.div`
  font-size: 24px;
  color: #fff;
  text-align: center;
`;

const Error = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-top: 20px;
`;

const CourseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CourseRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const PlaceCard = styled.div`
  width: 200px;
  height: 280px;
  border-radius: 16px;
  background: linear-gradient(145deg, #ffffff, #f3f3f3);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const PhotoPlaceholder = styled.div`
  width: 100%;
  height: 120px;
  background-color: #eaeaea;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1rem;
`;

const PlaceDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  font-size: clamp(0.8rem, 1vw, 1rem);
  color: #333;

  h3 {
    font-weight: bold;
    color: #222;
    margin: 0;
  }

  p {
    margin: 0;
    color: #555;
  }
`;

const Arrow = styled.div`
  font-size: 24px;
  color: #dcdcdc;
  margin: 0 15px;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

export default function Recommand({ selections }) {
  const { theme, date, time, location } = selections;
  const [recommandations, setRecommandations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const numOfCategory = countCategories(selections);

  function countCategories(selection) {
    const numOfCategory = { AT4: 0, CE7: 0, FD6: 0, CT1: 0 };

    if (Array.isArray(selection.theme)) {
      selection.theme.forEach((category) => {
        if (numOfCategory.hasOwnProperty(category)) {
          numOfCategory[category] += 1;
        }
      });
    }

    return numOfCategory;
  }

  function randomRecommend(recommandations, numOfCategory) {
    const selectedReco = {};

    Object.entries(numOfCategory).forEach(([category, count]) => {
      if (recommandations[category] && recommandations[category].length > 0) {
        const shuffled = recommandations[category]
          .slice()
          .sort(() => Math.random() - 0.5);
        selectedReco[category] = shuffled.slice(0, count);
      } else {
        selectedReco[category] = [];
      }
    });

    return selectedReco;
  }
  const navigate = useNavigate();

  const getRandomPlace = (places) => {
    if (!Array.isArray(places) || places.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * places.length);
    return places[randomIndex];
  };

  function getResArr(selections, recommandations) {
    const resArr = [];
    const usedIndexs = {};
    selections.theme.forEach((category) => {
      if (recommandations[category] && recommandations[category].length > 0) {
        if (!usedIndexs[category]) {
          usedIndexs[category] = new Set();
        }

        let randidx;
        do {
          randidx = Math.floor(
            Math.random() * recommandations[category].length
          );
        } while (usedIndexs[category].has(randidx));

        usedIndexs[category].add(randidx);

        resArr.push(recommandations[category][randidx]);
      }
    });

    return resArr;
  }

  function resBatch(selections, recommandations, size) {
    const finRes = [];
    for (let i = 0; i < size; i++) {
      const res = getResArr(selections, recommandations);
      finRes.push(res);
    }
    return finRes;
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
        const resObj = randomRecommend(topRatedPlaces, numOfCategory);
        const resArr = resBatch(selections, resObj, 5);
        setRecommandations(resArr);
      } catch (error) {
        console.error("API 호출 에러:", error);
        setErr("데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommandations();
  }, [theme, date, time, location]);
  console.log(recommandations);

  const handleCardClick = (placeUrl) => {
    if (placeUrl) {
      window.open(placeUrl, "_blank"); // 새 탭에서 카카오맵 링크 열기
    } else {
      alert("카카오맵 링크가 없습니다."); // 링크가 없는 경우 사용자에게 알림
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/theme")}>
          ← 다시 테마 선택
        </BackButton>
        <Title>추천 코스</Title>
        <Subtitle>
          아래 추천 코스는 여러분이 선택한 테마 순서를 기반으로 구성되었습니다.
          마음에 드는 장소를 클릭해 더 많은 정보를 확인하세요!
        </Subtitle>
      </Header>

      {loading && <Loading>로딩 중...</Loading>}
      {err && <Error>{err}</Error>}

      {!loading && !err && recommandations.length > 0 && (
        <CourseContainer>
          {recommandations.map((course, rowIndex) => (
            <CourseRow key={rowIndex}>
              {course.map((place, placeIndex) => (
                <>
                  <PlaceCard
                    key={`${place?.id || placeIndex}`}
                    onClick={() => handleCardClick(place?.place_url)}
                  >
                    <PhotoPlaceholder>이미지</PhotoPlaceholder>
                    <PlaceDetails>
                      <h3>{place?.place_name || "장소 이름 없음"}</h3>
                      <p>★ {place?.rating || "N/A"}</p>
                      <p>{place?.road_address_name || "주소 정보 없음"}</p>
                      <p>{place?.phone || "전화번호 없음"}</p>
                    </PlaceDetails>
                  </PlaceCard>
                  {placeIndex < course.length - 1 && <Arrow>→</Arrow>}
                </>
              ))}
            </CourseRow>
          ))}
        </CourseContainer>
      )}

      {!loading && !err && recommandations.length === 0 && (
        <p>추천할 장소가 없습니다.</p>
      )}
    </Container>
  );
}
