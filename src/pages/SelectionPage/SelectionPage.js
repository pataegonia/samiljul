import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateSelector from '../../components/selector/DateSelector';
import TimeSelector from '../../components/selector/TimeSelector';
import ThemeSelector from '../../components/selector/ThemeSelector';

const SelectionPage = () => {
    // 날짜, 시간, 테마 상태 관리
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [theme, setTheme] = useState('');
    const navigate = useNavigate();

    // MapPage로 이동하는 함수
    const handleSubmit = () => {
     // 상태 객체에 선택한 정보를 담아서 이동
        navigate('/map', { state: { date, time, theme } });
    };

    return (
        <div>
            <h2>Select Date, Time, and Theme</h2>
            <DateSelector onDateChange={setDate} />
            <TimeSelector onTimeChange={setTime} />
            <ThemeSelector onThemeChange={setTheme} />
            <button onClick={handleSubmit}>Go to Map</button>
        </div>
    );
}

export default SelectionPage;

