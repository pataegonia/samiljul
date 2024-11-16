import React, { useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ThemeSelection from "./components/ThemeSelection";
import DateSelection from "./components/DateSelection";
import TimeSelection from "./components/TimeSelection";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    font-family: Arial, sans-serif;
  }
`;

function App() {
  // 선택 데이터를 최상위에서 관리
  const [selections, setSelections] = useState({
    theme: [],
    date: "",
    time: [],
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/theme" replace />,
    },
    {
      path: "/theme",
      element: (
        <ThemeSelection
          selections={selections}
          setSelections={setSelections}
        />
      ),
    },
    {
      path: "/date",
      element: (
        <DateSelection
          selections={selections}
          setSelections={setSelections}
        />
      ),
    },
    {
      path: "/time",
      element: (
        <TimeSelection
          selections={selections}
          setSelections={setSelections}
        />
      ),
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

