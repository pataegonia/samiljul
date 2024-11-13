import React, { useEffect, useRef, useState} from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

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
    <div>
      <h1>Hello World!</h1>

      {/* 날짜 선택 */}
      <label>
        날짜 선택:
        <input type="text" ref={dateRef} placeholder="날짜를 선택하세요" />
      </label>

      {/* 시간 선택 */}
      <label>
        시간 선택:
        <select value={time} onChange={handleTimeChange}>
          <option value="">시간을 선택하세요</option>
          <option value="18:00">18:00</option>
          <option value="19:00">19:00</option>
          <option value="20:00">20:00</option>
        </select>
      </label>

      {/* 테마 선택 */}
      <label>
        테마 선택:
        <select value={theme} onChange={handleThemeChange}>
          <option value="">테마를 선택하세요</option>
          <option value="romantic">로맨틱</option>
          <option value="casual">캐주얼</option>
          <option value="adventure">모험</option>
          <option value="gourmet">미식</option>
        </select>
      </label>

      {/* 예약 버튼 */}
      <button onClick={handleReservation}>예약하기</button>
    </div>
  );
}
