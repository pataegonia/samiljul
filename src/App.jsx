import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/homs";
import Map from "./routes/map";
import Recommand from "./routes/recommand";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%; /* 전체 높이 설정 */
  }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e9f1f7;
    font-family: Arial, sans-serif;
  }
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/recommand",
    element: <Recommand />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
