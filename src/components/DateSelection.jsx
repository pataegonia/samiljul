import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export default function DateSelection({ selections, setSelections }) {
  const navigate = useNavigate();
  const [currentYearMonth, setCurrentYearMonth] = useState(dayjs());
  const [selectedDates, setSelectedDates] = useState(selections.date || []);
  const [selectedRange, setSelectedRange] = useState([]);
  const [isRangeMode, setIsRangeMode] = useState(false); // Toggle for single/range selection mode
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handlePrevMonth = () => {
    setCurrentYearMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentYearMonth((prev) => prev.add(1, "month"));
  };

  const handleDateClick = (date) => {
    if (isRangeMode) {
        if (selectedRange.length === 0) {
            // 범위의 시작 날짜 설정
            setSelectedRange([date]);
            setSelectedDates([date]); // 첫 번째 선택된 날짜를 표시
            setSelectedMessage(`종료 날짜를 선택해주세요.`);
        } else if (selectedRange.length === 1) {
            const startDate = dayjs(selectedRange[0]);
            const endDate = dayjs(date);

            if (startDate.isBefore(endDate)) {
                // 범위 완료
                const range = [];
                let current = startDate;

                // 시작 날짜부터 종료 날짜까지의 날짜를 배열로 채우기
                while (current.isBefore(endDate) || current.isSame(endDate)) {
                    range.push(current.format("YYYY-MM-DD"));
                    current = current.add(1, "day");
                }

                setSelectedRange(range);
                setSelectedDates(range);
                setSelectedMessage(`${startDate.format("M월 D일")}~${endDate.format("M월 D일")}에 완벽한 데이트 코스를 추천해드릴게요! 😊`);
            } else {
                // 종료 날짜가 시작 날짜보다 이전인 경우
                alert("시작 날짜보다 이후 날짜를 선택해주세요!");
            }
        } else {
            // 선택을 초기화하고 새로운 시작 날짜 설정
            setSelectedRange([date]);
            setSelectedDates([date]);
            setSelectedMessage(`종료 날짜를 선택해주세요.`);
        }
    } else {
        // 단일 날짜 선택 모드
        setSelectedDates([date]);
        setSelectedMessage(`${dayjs(date).format("M월 D일")}에 완벽한 데이트 코스를 추천해드릴게요! 😊`);
    }
};
  
  

  const handleNext = () => {
    setSelections({ ...selections, date: selectedDates });
    navigate("/time");
  };

  const handlePrev = () => {
    setSelections({ ...selections, date: selectedDates });
    navigate("/theme");
  };

  const generateCalendar = () => {
    const startOfMonth = currentYearMonth.startOf("month");
    const endOfMonth = currentYearMonth.endOf("month");
    const startDay = startOfMonth.startOf("week");
    const endDay = endOfMonth.endOf("week");

    let calendar = [];
    let day = startDay;

    while (day.isBefore(endDay, "day")) {
      calendar.push(day);
      day = day.add(1, "day");
    }

    return calendar;
  };

  const isDateSelected = (date) => selectedDates.includes(date);

  return (
    <Container>

      {/* 안내 메시지 */}
      <Instruction>데이트할 날짜를 선택해주세요! ❤️</Instruction>

      {/* 선택 모드 전환 버튼 */}
      <ToggleMode>
        <ModeButton
          isActive={!isRangeMode}
          onClick={() => {
            setIsRangeMode(false);
            setSelectedDates([]);
            setSelectedRange([]);
            setSelectedMessage(null);
          }}
        >
          단일 날짜 선택
        </ModeButton>
        <ModeButton
          isActive={isRangeMode}
          onClick={() => {
            setIsRangeMode(true);
            setSelectedDates([]);
            setSelectedRange([]);
            setSelectedMessage(null);
          }}
        >
          기간 선택
        </ModeButton>
      </ToggleMode>

      {/* 년, 월 이동 */}
      <Header>
        <NavButton onClick={handlePrevMonth}>◀</NavButton>
        <YearMonth>{currentYearMonth.format("YYYY년 M월")}</YearMonth>
        <NavButton onClick={handleNextMonth}>▶</NavButton>
      </Header>

      {/* 달력 */}
      <Calendar>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        {generateCalendar().map((day) => (
          <DateBox
            key={day.format("YYYY-MM-DD")}
            isCurrentMonth={day.month() === currentYearMonth.month()}
            isSelected={isDateSelected(day.format("YYYY-MM-DD"))}
            onClick={() => handleDateClick(day.format("YYYY-MM-DD"))}
          >
            {day.date()}
          </DateBox>
        ))}
      </Calendar>

      {/* 선택 메시지 */}
      {selectedMessage && <Message>{selectedMessage}</Message>}

      {/* 하단 버튼 */}
      <Footer>
        <PrevButton onClick={handlePrev}>이전</PrevButton>
        <NextButton onClick={handleNext} disabled={selectedDates.length === 0}>
          다음
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
  padding-top: 40px; /* 상단 여백 추가 */
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
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 40px; /* 하단 여백 추가 */
  color: white;
  animation: ${fadeIn} 0.5s ease;
`;

const ToggleMode = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px; /* 추가 여백 */
`;


const ModeButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => (props.isActive ? "linear-gradient(135deg, #ff758c, #ff7eb3)" : "rgba(255, 255, 255, 0.3)")};
  color: ${(props) => (props.isActive ? "white" : "#999")};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 90%;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2);
  }
`;

const YearMonth = styled.h2`
  margin: 0;
  font-size: 1.6rem;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  width: 90%;
  margin-top: 20px; /* 상단 여백 추가 */
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const DateBox = styled.div`
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  background: ${(props) =>
    props.isSelected
      ? "linear-gradient(135deg, #ff758c, #ff7eb3)"
      : props.isCurrentMonth
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(255, 255, 255, 0.1)"};
  color: ${(props) =>
    props.isSelected ? "white" : props.isCurrentMonth ? "white" : "#999"};
  cursor: ${(props) => (props.isCurrentMonth ? "pointer" : "default")};
  user-select: none;
  transition: all 0.3s;

  &:hover {
    background: ${(props) =>
      props.isCurrentMonth && !props.isSelected
        ? "rgba(255, 255, 255, 0.3)"
        : null};
    transform: ${(props) => (props.isCurrentMonth ? "scale(1.05)" : "none")};
  }

  ${(props) =>
    props.isSelected &&
    css`
      box-shadow: 0px 4px 20px rgba(255, 118, 117, 0.5);
      transform: scale(1.1);
    `}
`;

const Message = styled.div`
  margin-top: 20px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 20px;
  border-radius: 8px;
  animation: ${fadeIn} 0.5s ease;
`;

const Footer = styled.div`
  margin-top: 40px; /* 달력과 버튼 사이 여백 추가 */
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
