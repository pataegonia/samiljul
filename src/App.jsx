import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/homs";
import Map from "./routes/map";
import Recommand from "./routes/recommand";

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
