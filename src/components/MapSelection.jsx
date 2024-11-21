import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

const districtData = [
  { name: "종로구", position: [37.58232, 126.97861] },
  { name: "서대문구", position: [37.57008, 126.93541] },
  { name: "은평구", position: [37.61377, 126.92994] },
  { name: "강서구", position: [37.55879, 126.82497] },
  { name: "마포구", position: [37.55493, 126.90679] },
  { name: "양천구", position: [37.51292, 126.85244] },
  { name: "구로구", position: [37.49273, 126.85741] },
  { name: "영등포구", position: [37.52323, 126.91406] },
  { name: "금천구", position: [37.46073, 126.90187] },
  { name: "관악구", position: [37.46277, 126.94702] },
  { name: "동작구", position: [37.50036, 126.95217] },
  { name: "서초구", position: [37.47385, 127.01843] },
  { name: "강남구", position: [37.49037, 127.06203] },
  { name: "송파구", position: [37.50626, 127.1125] },
  { name: "강동구", position: [37.54672, 127.14581] },
  { name: "광진구", position: [37.54182, 127.08978] },
  { name: "성동구", position: [37.54781, 127.04406] },
  { name: "용산구", position: [37.52649, 126.98032] },
  { name: "중구", position: [37.556, 126.9985] },
  { name: "동대문구", position: [37.57683, 127.05242] },
  { name: "중랑구", position: [37.59271, 127.09573] },
  { name: "노원구", position: [37.64749, 127.07639] },
  { name: "도봉구", position: [37.66316, 127.03617] },
  { name: "강북구", position: [37.63526, 127.01088] },
  { name: "성북구", position: [37.59629, 127.01603] },
];

const Map = ({ selections, setSelections }) => {
  const [geoData, setGeoData] = useState(null); // 서울 구역 데이터
  const [hoveredDistrict, setHoveredDistrict] = useState(null); // 현재 마우스가 올라간 구역
  const navigate = useNavigate();

  // 서울 구역 데이터를 가져오는 함수
  useEffect(() => {
    fetch("/seouldistricts.geojson")
      .then((response) => response.json())
      .then((data) => setGeoData(data));
  }, []);

  // 구역 스타일 (기본 스타일)
  const districtStyle = {
    color: "white", // 테두리 색상
    weight: 2, // 테두리 두께
    fillColor: "#FF6F91", // 구역 색상 (핑크색)
    fillOpacity: 1, // 구역 채우기
  };

  // 구역 확대 스타일
  const hoverStyle = {
    color: "white",
    weight: 3,
    fillColor: "#FF3B69", // 강조된 핑크색
    fillOpacity: 1,
  };

  // GeoJSON 레이어 이벤트 설정
  const onEachFeature = (feature, layer) => {
    const districtName = feature.properties.SIG_KOR_NM;

    layer.on({
      mouseover: () => {
        setHoveredDistrict(districtName); // 마우스를 올린 구역을 상태로 설정
      },
      mouseout: () => {
        setHoveredDistrict(null); // 마우스가 떠나면 상태 초기화
      },
      click: () => {
        const selectedDistrict = districtData.find(
          (district) => district.name === districtName
        );

        if (selectedDistrict) {
          setSelections({ ...selections, location: selectedDistrict });
        }

        navigate(`/recommand`); // 추천 페이지로 이동
      },
    });
  };

  // GeoJSON 스타일 설정
  const getStyle = (feature) => {
    const districtName = feature.properties.SIG_KOR_NM;
    if (hoveredDistrict === districtName) {
      return hoverStyle; // 마우스가 올라간 구역은 강조 스타일 적용
    }
    return districtStyle; // 기본 스타일 적용
  };

  const handlePrev = () => {
    navigate("/time"); // 이전 페이지로 이동
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)", // 배경을 Linear Gradient로 설정
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <MapContainer
        center={[37.5365, 126.978]} // 서울 중심 좌표
        zoom={11}
        style={{
          height: "90%",
          width: "90%",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)", // 지도 배경
        }}
        zoomControl={false} // 플러스/마이너스 버튼 제거
        scrollWheelZoom={false} // 스크롤 확대/축소 비활성화
        dragging={false} // 지도 드래그 비활성화
        doubleClickZoom={false} // 더블클릭 확대 비활성화
        keyboard={false} // 키보드 제어 비활성화
      >
        {/* 지도 타일 */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          opacity={0} // 타일 투명도 조정
        />

        {/* 핑크색 구역 (서울 GeoJSON 데이터) */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={getStyle} // 상태 기반으로 동적 스타일 적용
            onEachFeature={onEachFeature}
          />
        )}
        {/* 라벨 표시 */}
        {districtData.map((district, index) => (
          <Marker
            key={index}
            position={district.position}
            icon={L.divIcon({
              className: "district-label",
              html: `<div style="font-size: 10px; color: white; white-space: nowrap;">${district.name}</div>`,
              iconAnchor: [20, 15],
            })}
            eventHandlers={{
              click: () => {
                // 라벨 클릭 시 구역 선택 및 페이지 이동
                const selectedDistrict = districtData.find(
                  (d) => d.name === district.name
                );
                if (selectedDistrict) {
                  setSelections({ ...selections, location: selectedDistrict });
                  navigate(`/recommand`); // 추천 페이지로 이동
                }
              },
              mouseover: () => {
                // 라벨에 마우스 올리면 해당 구역과 같은 동작 수행
                setHoveredDistrict(district.name); // 현재 구역을 강조
              },
              mouseout: () => {
                // 라벨에서 마우스를 떼면 구역 강조 해제
                setHoveredDistrict(null);
              },
            }}
          />
        ))}
      </MapContainer>

      {/* 이전 버튼 */}
      <Footer>
        <PrevButton onClick={handlePrev}>이전</PrevButton>
      </Footer>
    </div>
  );
};

const Footer = styled.div`
  position: absolute;
  bottom: 50px; /* 아래에서 10px 대신 50px으로 조정 */
  left: 10px;
`;

const PrevButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #a6c1ee, #fbc2eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

export default Map;
