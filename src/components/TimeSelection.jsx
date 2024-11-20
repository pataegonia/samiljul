import styled from "styled-components";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

// 시간에 따른 추천 메시지 제공 함수
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

  const handleSliderChange = ([newStart, newEnd]) => {
    setStartTime(newStart);
    setEndTime(newEnd);
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
        <StyledSlider
          range
          min={0}
          max={24}
          step={1}
          defaultValue={[startTime, endTime]}
          onChange={handleSliderChange}
          trackStyle={[{ backgroundColor: "#ff758c" }]}
          handleStyle={[
            { borderColor: "#ff758c", backgroundColor: "white" },
            { borderColor: "#ff758c", backgroundColor: "white" },
          ]}
        />
        <TimeLabels>
          <TimeLabel position={(startTime / 24) * 100}>{`${startTime}:00`}</TimeLabel>
          <TimeLabel position={(endTime / 24) * 100}>{`${endTime}:00`}</TimeLabel>
        </TimeLabels>
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
  position: relative;
  width: 80%;
  margin-bottom: 40px;
`;

const StyledSlider = styled(Slider)`
  .rc-slider-rail {
    background-color: #d3d3d3;
  }

  .rc-slider-track {
    background-color: #ff758c;
  }

  .rc-slider-handle {
    border: 2px solid #ff758c;
    background: white;
    cursor: pointer;
  }
`;

const TimeLabels = styled.div`
  position: relative;
  width: 100%;
`;

const TimeLabel = styled.div`
  position: absolute;
  top: -30px;
  left: ${(props) => props.position}%;
  transform: translateX(-50%);
  background-color: white;
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: bold;
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
