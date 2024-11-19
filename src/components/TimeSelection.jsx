import styled from "styled-components"; // styled-components 추가
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const getRecommendation = (startTime, endTime) => {
  if (startTime >= 6 && endTime <= 10) {
    return "신선한 공기를 마시며 조깅하기 좋은 시간입니다! 🏃‍♂️";
  } else if (startTime >= 10 && endTime <= 14) {
    return "브런치와 함께 데이트를 즐겨보세요! 🥞";
  } else if (startTime >= 14 && endTime <= 18) {
    return "활동적인 야외 데이트를 즐기기 좋은 시간이에요! 🚴‍♀️";
  } else if (startTime >= 18 && endTime <= 22) {
    return "로맨틱한 저녁 식사와 야경을 즐겨보세요. 🌃";
  } else if ((startTime >= 22 && endTime <= 24) || (startTime >= 0 && endTime <= 6)) {
    return "조용한 카페나 밤 산책을 추천합니다. 🌌";
  } else {
    return "여러분만의 특별한 시간을 만들어보세요! 🌟";
  }
};

export default function TimeSelection({ selections, setSelections }) {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState(selections.startTime || 6);
  const [endTime, setEndTime] = useState(selections.endTime || 8);

  const handleNext = () => {
    setSelections({ ...selections, startTime, endTime });
    navigate("/summary");
  };

  const handlePrev = () => {
    setSelections({ ...selections, startTime, endTime });
    navigate("/date");
  };

  const recommendation = getRecommendation(startTime, endTime);

  return (
    <Container>
      <Header>
        <Title>시간 설정</Title>
        <Subtitle>원하는 데이트 시간을 설정하세요 ⏰</Subtitle>
      </Header>

      <Instruction>{`선택된 시간: ${startTime}:00 ~ ${endTime}:00`}</Instruction>

      <SliderWrapper>
        <TimeLabel>시작 시간</TimeLabel>
        <Slider
          type="range"
          min="0"
          max="23"
          value={startTime}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value < endTime) setStartTime(value);
          }}
        />
        <TimeValue>{startTime}:00</TimeValue>
      </SliderWrapper>

      <SliderWrapper>
        <TimeLabel>종료 시간</TimeLabel>
        <Slider
          type="range"
          min="1"
          max="24"
          value={endTime}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > startTime) setEndTime(value);
          }}
        />
        <TimeValue>{endTime}:00</TimeValue>
      </SliderWrapper>

      <RecommendationBox>
        <RecommendationText>{recommendation}</RecommendationText>
      </RecommendationBox>

      <Footer>
        <PrevButton onClick={handlePrev}>이전</PrevButton>
        <NextButton onClick={handleNext}>선택</NextButton>
      </Footer>
    </Container>
  );
}

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  font-family: "Pretendard", sans-serif;
  color: white;
`;

const Header = styled.div`
  margin: 20px 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin-top: 10px;
  opacity: 0.8;
`;

const Instruction = styled.div`
  margin: 20px 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  width: 80%;
`;

const TimeLabel = styled.div`
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 600;
`;

const Slider = styled.input`
  width: 100%;
  appearance: none;
  height: 10px;
  background: linear-gradient(to right, #ff758c, #ff7eb3);
  border-radius: 5px;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: white;
    border: 2px solid #ff758c;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const TimeValue = styled.div`
  margin-top: 10px;
  font-size: 1rem;
  font-weight: 600;
`;

const RecommendationBox = styled.div`
  background: rgba(255, 255, 255, 0.2);
  margin: 20px 0;
  padding: 15px;
  border-radius: 10px;
  max-width: 80%;
`;

const RecommendationText = styled.p`
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  width: 90%;
`;

const PrevButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #a6c1ee, #fbc2eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const NextButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;
