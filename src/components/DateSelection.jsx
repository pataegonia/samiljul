import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export default function DateSelection({ selections, setSelections }) {
  const navigate = useNavigate();
  const [currentYearMonth, setCurrentYearMonth] = useState(dayjs());
  const [selectedDates, setSelectedDates] = useState(selections.date || []);

  const handlePrevMonth = () => {
    setCurrentYearMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentYearMonth((prev) => prev.add(1, "month"));
  };

  const handleDateClick = (date) => {
    setSelectedDates((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date].sort((a, b) => dayjs(a).isBefore(dayjs(b) ? -1 : 1))
    );
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
      {/* 진행 바 */}
      <ProgressBar>
        <Progress style={{ width: "66%" }} />
      </ProgressBar>

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: black;
  font-size: 20px;
  cursor: pointer;
`;

const YearMonth = styled.h2`
  margin: 0;
  font-size: 1.5em;
  color: black;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  width: 100%;
  max-width: 400px;
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  color: black;
`;

const DateBox = styled.div`
  text-align: center;
  padding: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.isSelected ? "black" : props.isCurrentMonth ? "white" : "#f0f0f0")};
  color: ${(props) => (props.isSelected ? "white" : props.isCurrentMonth ? "black" : "#cccccc")};
  cursor: ${(props) => (props.isCurrentMonth ? "pointer" : "default")};
  user-select: none;

  &:hover {
    background-color: ${(props) => (props.isCurrentMonth && !props.isSelected ? "#ddd" : null)};
  }
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

const NextButton = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.disabled ? "#ccc" : "black")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;
