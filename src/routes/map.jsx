import React from "react";
import { Route, Routes } from "react-router-dom";
import MapSelection from "../components/MapSelection";

function Map({ selections, setSelections }) {

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>원하는 지역을 선택하세요!</h1>
      <Routes>
        {/* 지도 페이지 */}
        <Route path="/" element={<MapSelection selections={selections} setSelections={setSelections} />} />

        {/* 추천 장소 페이지 */}

      </Routes>
    </div>
  );
}

export default Map;
