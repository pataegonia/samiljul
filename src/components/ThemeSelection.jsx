import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const themes = ["국내 여행", "해외 여행", "문화생활", "커피", "미식"];

export default function ThemeSelection({ selections, setSelections }) {
  const navigate = useNavigate();
  const [selectedThemes, setSelectedThemes] = useState(selections.theme || []);

  const handleThemeToggle = (theme) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const handleNext = () => {
    setSelections({ ...selections, theme: selectedThemes });
    navigate("/date");
  };

  return (
    <Container>
      {/* 진행 바 */}
      <ProgressBar>
        <Progress style={{ width: "33%" }} />
      </ProgressBar>

      <Title>어떤 주제에 관심 있으신가요?</Title>

      {/* 테마 선택 버튼 */}
      <ThemeContainer>
        {themes.map((theme) => (
          <ThemeButton
            key={theme}
            isSelected={selectedThemes.includes(theme)}
            onClick={() => handleThemeToggle(theme)}
          >
            {theme}
          </ThemeButton>
        ))}
      </ThemeContainer>

      {/* 다음 버튼 */}
      <NextButton
        onClick={handleNext}
        disabled={selectedThemes.length === 0}
      >
        다음
      </NextButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  margin-bottom: 20px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: black;
`;

const Title = styled.h1`
  font-size: 1.2em;
  color: black;
  margin-bottom: 20px;
`;

const ThemeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const ThemeButton = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.isSelected ? "black" : "white")};
  color: ${(props) => (props.isSelected ? "white" : "black")};
  border: 1px solid ${(props) => (props.isSelected ? "black" : "#ccc")};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const NextButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: ${(props) => (props.disabled ? "#ccc" : "black")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
