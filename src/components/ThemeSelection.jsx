import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";

export default function ThemeSelection({ selections, setSelections }) {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null);

  const themes = [
    { name: "국내 여행", description: "국내 숨은 명소를 탐험해 보세요." },
    { name: "해외 여행", description: "세계 곳곳의 문화를 경험하세요." },
    { name: "문화생활", description: "박물관, 공연 등을 즐겨보세요." },
    { name: "커피", description: "여유로운 카페 탐방을 떠나보세요." },
    { name: "미식", description: "다양한 맛집을 탐방하세요." },
  ];

  const handleThemeClick = (theme) => {
    setSelectedTheme(theme);
  };

  const handleCancel = () => {
    setSelectedTheme(null); // 선택 초기화
  };

  const handleNext = () => {
    if (selectedTheme) {
      setSelections({ ...selections, theme: selectedTheme });
      navigate("/date"); // 다음 페이지로 이동
    } else {
      alert("테마를 선택해주세요!");
    }
  };

  return (
    <Container>
      {/* 진행 바 */}
      <ProgressBar>
        <Progress style={{ width: "33%" }} />
      </ProgressBar>

      {/* 선택창 */}
      <Content>
        <Question>어떤 주제에 관심 있으신가요?</Question>
        <ButtonGroup>
          {themes.map((theme) => (
            <ThemeButton
              key={theme.name}
              onClick={() => handleThemeClick(theme.name)}
              isSelected={theme.name === selectedTheme}
            >
              {theme.name}
              <Description>{theme.description}</Description>
            </ThemeButton>
          ))}
        </ButtonGroup>
      </Content>

      {/* 선택 메시지 */}
      {selectedTheme && (
        <Message>
          {selectedTheme}를 선택하셨군요! <br />
          {selectedTheme} 테마에 맞춘 데이트 코스를 추천해드릴게요!
        </Message>
      )}

      {/* 하단 버튼 */}
      <Footer>
        {selectedTheme && (
          <CancelButton onClick={handleCancel}>취소</CancelButton>
        )}
        <NextButton onClick={handleNext} disabled={!selectedTheme}>
          다음
        </NextButton>
      </Footer>
    </Container>
  );
}

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

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc); /* 인스타그램 느낌 */
  color: white;
  text-align: center;
  padding: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 20px;
  border-radius: 4px;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(to right, #ff9a9e, #fad0c4);
  border-radius: 4px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const Question = styled.h1`
  font-size: 1.8em;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const ThemeButton = styled.button`
  background: ${(props) =>
    props.isSelected
      ? "linear-gradient(135deg, #ff758c, #ff7eb3)"
      : "rgba(255, 255, 255, 0.2)"};
  color: ${(props) => (props.isSelected ? "white" : "#fff")};
  border: none;
  border-radius: 20px;
  padding: 15px 20px;
  font-size: 1em;
  cursor: pointer;
  width: 220px;
  transition: all 0.3s;
  box-shadow: ${(props) =>
    props.isSelected ? "0px 4px 20px rgba(255, 118, 117, 0.5)" : "none"};

  &:hover {
    background: ${(props) =>
      props.isSelected
        ? "linear-gradient(135deg, #ff758c, #ff92c2)"
        : "rgba(255, 255, 255, 0.3)"};
    transform: scale(1.05);
  }
`;

const Description = styled.p`
  margin-top: 5px;
  font-size: 0.8em;
  color: #ddd;
`;

const Message = styled.div`
  margin-top: 20px;
  font-size: 1.2em;
  color: white;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Footer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const NextButton = styled.button`
  padding: 15px 30px;
  font-size: 1.2em;
  font-weight: bold;
  background: ${(props) =>
    props.disabled
      ? "rgba(255, 255, 255, 0.3)"
      : "linear-gradient(135deg, #6a11cb, #2575fc)"};
  color: ${(props) => (props.disabled ? "#999" : "white")};
  border: none;
  border-radius: 30px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;

  ${(props) =>
    !props.disabled &&
    css`
      animation: ${pulse} 1.5s infinite;
    `}

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "scale(1.1)")};
  }
`;
