import React, { useEffect, useRef, useState} from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import styled from "styled-components"

export default function Greeting() {

  const dateRef = useRef(null);
  const [time, setTime] = useState("");
  const [theme, setTheme] = useState("");

  useEffect(() => {
    flatpickr(dateRef.current, {
      minDate: "today", 
      dateFormat: "Y-m-d",
      locale: "ko",
    });
  }, []);

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleReservation = () => {
    if (!dateRef.current.value || !time || !theme) {
      alert("모든 옵션을 선택해 주세요.")
      return;
    }
    alert('예약 완료!\n날짜: ${dateRef.current.value}\n시간: ${time}\n테마: ${theme}');
  };





  return (
    <Container>
      <h1>안녕하세요!</h1>

      {/* 날짜 선택 */}
      <FieldContainer>
        <Label>날짜 선택:</Label>
        <StyledInput type="text" ref={dateRef} placeholder="날짜를 선택하세요" />
      </FieldContainer>

      {/* 시간 선택 */}
      <FieldContainer>
        <Label>시간 선택:</Label>
        <StyledSelect value={time} onChange={handleTimeChange}>
          <option value="">시간을 선택하세요</option>
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={`${String(i).padStart(2, "0")}:00`}>
              {String(i).padStart(2, "0")}:00
            </option>
          ))}
        </StyledSelect>
      </FieldContainer>

      {/* 테마 선택 */}
      <FieldContainer>
        <Label>테마 선택:</Label>
        <StyledSelect value={theme} onChange={handleThemeChange}>
          <option value="">테마를 선택하세요</option>
          <option value="romantic">로맨틱</option>
          <option value="casual">캐주얼</option>
          <option value="adventure">모험</option>
          <option value="gourmet">미식</option>
        </StyledSelect>
      </FieldContainer>

      {/* 예약 버튼 */}
      <StyledButton onClick={handleReservation}>예약하기</StyledButton>
    </Container>
  );
}

// 스타일 컴포넌트 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px; /* 상하 패딩 증가 */
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%; /* 너비를 100%로 설정 */
  max-width: 400px; /* 최대 너비 유지 */
`;
const Title = styled.h1`
  font-size: 1.5em;
  color: #00509e;
  margin-bottom: 1.5rem;
`;

const FieldContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  color: #00509e;
  margin-bottom: 8px;
  display: block;
`;

const StyledInput = styled.input`
  padding: 12px;
  width: 100%;
  border: 1px solid #00509e;
  border-radius: 4px;
  font-size: 1em;
  outline: none;

  &:focus {
    border-color: #0077cc;
    box-shadow: 0 0 0 0.2rem rgba(0, 119, 204, 0.25);
  }
`;

const StyledSelect = styled.select`
  padding: 12px;
  width: 100%;
  border: 1px solid #00509e;
  border-radius: 4px;
  font-size: 1em;
  outline: none;

  &:focus {
    border-color: #0077cc;
    box-shadow: 0 0 0 0.2rem rgba(0, 119, 204, 0.25);
  }
`;

const StyledButton = styled.button`
  background-color: #00509e;
  color: #ffffff;
  padding: 12px;
  width: 100%;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: #0077cc;
  }

  &:active {
    background-color: #004080;
  }
`;