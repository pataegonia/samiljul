import React, { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ThemeSelection from "./components/ThemeSelection";
import DateSelection from "./components/DateSelection";
import TimeSelection from "./components/TimeSelection";
import { createGlobalStyle } from "styled-components";
import Recommand from "./routes/recommand";
import Map from "./routes/map";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #6a11cb, #2575fc); /* 토스 느낌 */
    font-family: "Pretendard", Arial, sans-serif;
    color: white;
  }
`;

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
        onClick={() => (window.location.href = "/theme")}
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}

function App() {
  const [selections, setSelections] = useState({
    theme: [],
    date: "",
    startTime: 0,
    endTime: 0,
    location: [],
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/theme" replace />,
    },
    {
      path: "/theme",
      element: (
        <ThemeSelection selections={selections} setSelections={setSelections} />
      ),
    },
    {
      path: "/date",
      element: (
        <DateSelection selections={selections} setSelections={setSelections} />
      ),
    },
    {
      path: "/time",
      element: (
        <TimeSelection selections={selections} setSelections={setSelections} />
      ),
    },
    {
      path: "/recommand",
      element: <Recommand selections={selections} />,
    },
    {
      path: "/map",
      element: <Map selections={selections} setSelections={setSelections} />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
