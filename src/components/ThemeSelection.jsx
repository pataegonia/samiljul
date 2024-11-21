import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

export default function ThemeSelection({ selections, setSelections }) {
  const navigate = useNavigate();
  const [selectedThemes, setSelectedThemes] = useState(selections.theme || []);

  const themes = [
    {
      name: "음식점",
      description: "다양한 맛집을 탐방하세요.",
      icon: "🍴",
      code: "FD6",
    },
    {
      name: "카페",
      description: "여유로운 카페 탐방을 떠나보세요.",
      icon: "☕",
      code: "CE7",
    },
    {
      name: "관광명소",
      description: "주변의 멋진 관광명소를 발견하세요.",
      icon: "🗺️",
      code: "AT4",
    },
    {
      name: "문화시설",
      description: "박물관, 공연 등을 즐겨보세요.",
      icon: "🎭",
      code: "CT1",
    },
  ];

  // 테마 선택 처리
  const handleThemeClick = (theme) => {
    if (selectedThemes.length >= 8) {
      alert("최대 8개까지만 선택할 수 있습니다!");
      return;
    }

    // 중복 허용: 선택한 순서대로 배열에 추가
    setSelectedThemes((prev) => [...prev, theme]);
  };

  const handleNext = () => {
    if (selectedThemes.length > 0) {
      setSelections({ ...selections, theme: selectedThemes });
      navigate("/samiljul/date");
    } else {
      alert("최소 하나 이상의 테마를 선택해주세요!!");
    }
  };

  const handleReset = () => {
    setSelectedThemes([]); // 선택 초기화
  };

  return (
    <Container>
      {/* 안내 메시지 */}
      <WelcomeMessage>
        <h1>데이트 테마를 선택해주세요! 💕</h1>
        <p>여러 테마를 선택하여 당신만의 특별한 데이트를 구성해보세요!</p>
      </WelcomeMessage>

      {/* 테마 선택 UI */}
      <ButtonGroup>
        {themes.map((theme) => (
          <CourseCard
            key={`${theme.name}-${Math.random()}`}
            onClick={() => handleThemeClick(theme.code)}
            isSelected={selectedThemes.includes(theme.code)}
          >
            <CourseIcon>{theme.icon}</CourseIcon>
            <CourseName>{theme.name}</CourseName>
            <Description>{theme.description}</Description>
          </CourseCard>
        ))}
      </ButtonGroup>

      {selectedThemes.length > 0 && (
        <SelectedCourses>
          <h3>선택한 데이트 코스</h3>
          <CourseFlow>
            {selectedThemes.map((themeCode, index) => {
              const theme = themes.find((t) => t.code === themeCode); // 코드로 테마 찾기
              return (
                <CourseFlowItem key={index}>
                  <CourseIcon>{theme.icon}</CourseIcon>
                  <CourseName>{theme.name}</CourseName>{" "}
                  {/* 이모티콘 + 텍스트 */}
                  {index < selectedThemes.length - 1 && (
                    <FlowArrow>➜</FlowArrow>
                  )}{" "}
                  {/* 화살표 */}
                </CourseFlowItem>
              );
            })}
          </CourseFlow>
        </SelectedCourses>
      )}

      {/* 초기화 및 다음 버튼 */}
      <Footer>
        <ResetButton onClick={handleReset}>초기화</ResetButton>
        <NextButton onClick={handleNext} disabled={selectedThemes.length === 0}>
          다음
        </NextButton>
      </Footer>
    </Container>
  );
}

// 스타일 코드 (기존 UI 유지)
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  text-align: center;
  padding: 20px;
`;

const WelcomeMessage = styled.div`
  margin-bottom: 30px;
  text-align: center;

  h1 {
    font-size: 2em;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #ff758c, #ff7eb3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.2em;
    color: #f5f5f5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const CourseCard = styled.div`
  background: ${(props) =>
    props.isSelected
      ? "linear-gradient(135deg, #ff758c, #ff7eb3)"
      : "rgba(255, 255, 255, 0.2)"};
  color: white;
  border-radius: 15px;
  padding: 20px;
  width: 180px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${(props) =>
    props.isSelected ? "0px 4px 20px rgba(255, 118, 117, 0.5)" : "none"};
  &:hover {
    transform: scale(1.05);
  }
`;

const CourseIcon = styled.div`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const CourseName = styled.h3`
  font-size: 1em;
  margin-bottom: 5px;
`;

const Description = styled.p`
  font-size: 0.9em;
  color: #f5f5f5;
`;

const SelectedCourses = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const CourseFlow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const CourseFlowItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* 아이콘과 텍스트 간격 */
  font-size: 1.2em;
  margin: 0 10px;
  animation: ${fadeIn} 0.5s ease-in-out;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
  }
`;

const FlowArrow = styled.div`
  font-size: 1.5em;
  margin: 0 10px;
  color: rgba(255, 255, 255, 0.8);
`;
const Footer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s;
  }
`;

const NextButton = styled.button`
  padding: 15px 30px;
  font-size: 1.2em;
  background: ${(props) =>
    props.disabled
      ? "rgba(255, 255, 255, 0.3)"
      : "linear-gradient(135deg, #6a11cb, #2575fc)"};
  color: ${(props) => (props.disabled ? "#999" : "white")};
  border: none;
  border-radius: 30px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "scale(1.1)")};
    transition: transform 0.2s ease-in-out;
  }
`;
