import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function TimeSelection({ selections, setSelections }) {
  const navigate = useNavigate();
  const [selectedTimes, setSelectedTimes] = useState(selections.time || []);

  const handleTimeToggle = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time) // 중복 선택 해제
        : [...prev, time]
    );
  };

  const handleSubmit = () => {
    setSelections({ ...selections, time: selectedTimes });
    alert(`최종 선택:\n테마: ${selections.theme.join(", ")}\n날짜: ${selections.date}\n시간: ${selectedTimes.join(", ")}`);
  };

  const handlePrev = () => {
    setSelections({ ...selections, time: selectedTimes }); // 현재 데이터 저장
    navigate("/date"); // 날짜 선택 페이지로 이동
  };

  return (
    <Container>
      {/* 진행 바 */}
      <ProgressBar>
        <Progress style={{ width: "100%" }} />
      </ProgressBar>

      {/* 선택된 날짜 표시 */}
      <Header>
        <SelectedDate>{selections.date || "날짜를 선택하세요"}</SelectedDate>
      </Header>

      {/* 시간 선택 */}
      <TimeContainer>
        {Array.from({ length: 24 }, (_, i) => {
          const time = `${String(i).padStart(2, "0")}:00`;
          return (
            <TimeButton
              key={time}
              isSelected={selectedTimes.includes(time)}
              onClick={() => handleTimeToggle(time)}
            >
              {time}
            </TimeButton>
          );
        })}
      </TimeContainer>

      {/* 하단 버튼 */}
      <Footer>
        <PrevButton onClick={handlePrev}>이전</PrevButton>
        <SubmitButton onClick={handleSubmit} disabled={selectedTimes.length === 0}>
          선택
        </SubmitButton>
      </Footer>
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

const Header = styled.div`
  margin-bottom: 20px;
`;

const SelectedDate = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: black;
`;

const TimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const TimeButton = styled.button`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.isSelected ? "black" : "#ccc")};
  background-color: ${(props) => (props.isSelected ? "black" : "white")};
  color: ${(props) => (props.isSelected ? "white" : "black")};
  cursor: pointer;
  font-size: 0.9em;
`;

const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const PrevButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  border: 1px solid black;
  color: black;
  border-radius: 4px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.disabled ? "#ccc" : "black")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

