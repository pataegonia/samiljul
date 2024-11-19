import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

export default function TimeSelection({ selections, setSelections }) {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(selections.time || "");

  const handleTimeClick = (time) => {
    setSelectedTime(time === selectedTime ? "" : time); // Toggle selection
  };

  const handleNext = () => {
    setSelections({ ...selections, time: selectedTime });
    navigate("/summary");
  };

  const handlePrev = () => {
    setSelections({ ...selections, time: selectedTime });
    navigate("/date");
  };

  return (
    <Container>
      {/* 진행 바 */}
      <ProgressBar>
        <Progress style={{ width: "100%" }} />
      </ProgressBar>

      {/* 안내 메시지 */}
      <Instruction>
        {selectedTime
          ? `선택된 시간: ${selectedTime}~`
          : "데이트 시작 시간을 선택해주세요! ⏰"}
      </Instruction>

      {/* 시간 선택 버튼 */}
      <TimeGrid>
        {Array.from({ length: 24 }, (_, i) => {
          const time = `${i.toString().padStart(2, "0")}:00`;
          return (
            <TimeButton
              key={time}
              isSelected={selectedTime === time}
              onClick={() => handleTimeClick(time)}
            >
              {time}~
            </TimeButton>
          );
        })}
      </TimeGrid>

      {/* 하단 버튼 */}
      <Footer>
        <PrevButton onClick={handlePrev}>이전</PrevButton>
        <NextButton onClick={handleNext} disabled={!selectedTime}>
          선택
        </NextButton>
      </Footer>
    </Container>
  );
}

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

const scaleUp = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
`;

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

const ProgressBar = styled.div`
  width: 90%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-bottom: 20px;
  border-radius: 4px;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(to right, #ff758c, #ff7eb3);
  border-radius: 4px;
`;

const Instruction = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
  animation: ${fadeIn} 0.5s ease;
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  width: 90%;
  margin-bottom: 20px;
`;

const TimeButton = styled.button`
  padding: 15px 10px;
  border-radius: 20px;
  background: ${(props) =>
    props.isSelected
      ? "linear-gradient(135deg, #ff758c, #ff7eb3)"
      : "rgba(255, 255, 255, 0.2)"};
  color: white;
  font-size: 1rem;
  font-weight: ${(props) => (props.isSelected ? "bold" : "normal")};
  border: none;
  cursor: pointer;
  transition: all 0.3s;

  ${(props) =>
    props.isSelected &&
    css`
      animation: ${scaleUp} 0.3s ease-in-out infinite alternate;
      box-shadow: 0px 4px 20px rgba(255, 118, 117, 0.9);
    `}

  &:hover {
    background: ${(props) =>
      props.isSelected
        ? "linear-gradient(135deg, #ff758c, #ff7eb3)"
        : "rgba(255, 255, 255, 0.3)"};
    transform: scale(1.05);
  }
`;

const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 90%;
`;

const PrevButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #a6c1ee, #fbc2eb);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const NextButton = styled.button`
  padding: 10px 20px;
  background: ${(props) =>
    props.disabled
      ? "rgba(255, 255, 255, 0.3)"
      : "linear-gradient(135deg, #6a11cb, #2575fc)"};
  color: ${(props) => (props.disabled ? "#999" : "white")};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "scale(1.05)")};
  }
`;
