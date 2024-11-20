import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";

export default function CourseSelection() {
  const navigate = useNavigate();
  const [selectedCourses, setSelectedCourses] = useState([]);

  const courses = [
    { name: "음식점", description: "다양한 맛집을 탐방하세요.", icon: "🍴" },
    { name: "카페", description: "여유로운 카페 탐방을 떠나보세요.", icon: "☕" },
    { name: "관광명소", description: "주변의 멋진 관광명소를 발견하세요.", icon: "🗺️" },
    { name: "문화시설", description: "박물관, 공연 등을 즐겨보세요.", icon: "🎭" },
  ];

  const handleCourseClick = (course) => {
    if (selectedCourses.length >= 8) {
      alert("최대 8개까지만 선택할 수 있습니다!");
      return;
    }

    setSelectedCourses((prev) => [...prev, course]); // 중복 선택 허용
  };

  const handleReset = () => {
    setSelectedCourses([]); // 선택 초기화
  };

  const handleNext = () => {
    if (selectedCourses.length > 0) {
      navigate("/date", { state: { courses: selectedCourses } });
    } else {
      alert("코스를 최소 하나 이상 선택해주세요!");
    }
  };

  return (
    <Container>
      {/* 환영 메시지 */}
      <WelcomeMessage>
        <h1>데이트 코스 추천 서비스에 오신 것을 환영합니다! 💕</h1>
        <p>
          당신만의 특별한 데이트를 위한 맞춤형 코스를 추천해드립니다.
          <br />
          원하는 코스를 선택하고, 순서대로 구성된 맞춤형 플랜을 확인해보세요!
        </p>
      </WelcomeMessage>

      {/* 선택 섹션 */}
      <Content>
        <Question>어떤 코스를 선택하시겠습니까?</Question>
        <ButtonGroup>
          {courses.map((course) => (
            <CourseCard
              key={course.name}
              onClick={() => handleCourseClick(course.name)}
              isSelected={selectedCourses.includes(course.name)}
            >
              <CourseIcon>{course.icon}</CourseIcon>
              <CourseName>{course.name}</CourseName>
              <Description>{course.description}</Description>
            </CourseCard>
          ))}
        </ButtonGroup>

        {/* 시각적 플로우 */}
        {selectedCourses.length > 0 && (
          <SelectedCourses>
            <h3>선택한 데이트 코스</h3>
            <CourseFlow>
              {selectedCourses.map((course, index) => (
                <CourseFlowItem key={`${course}-${index}`}>
                  <FlowIcon>{courses.find((c) => c.name === course).icon}</FlowIcon>
                  <FlowName>{course}</FlowName>
                  {index < selectedCourses.length - 1 && <FlowArrow>➜</FlowArrow>}
                </CourseFlowItem>
              ))}
            </CourseFlow>
          </SelectedCourses>
        )}
      </Content>

      {/* 하단 버튼 */}
      <Footer>
        <ResetButton onClick={handleReset}>초기화</ResetButton>
        <NextButton onClick={handleNext} disabled={selectedCourses.length === 0}>
          다음
        </NextButton>
      </Footer>
    </Container>
  );
}

// 애니메이션
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

// 스타일링
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Question = styled.h2`
  font-size: 1.8em;
  margin-bottom: 20px;
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
  font-size: 2.5em;
  margin-bottom: 10px;
`;

const CourseName = styled.h3`
  font-size: 1.2em;
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
  flex-direction: column;
  align-items: center;
  font-size: 1.2em;
  margin: 0 10px;
  animation: ${fadeIn} 0.5s ease-in-out;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
  }
`;

const FlowIcon = styled.div`
  font-size: 2em;
`;

const FlowName = styled.div`
  margin-top: 5px;
  font-size: 1.1em;
`;

const FlowArrow = styled.div`
  font-size: 1.5em;
  margin: 0 5px;
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
