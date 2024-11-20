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
{ name: "송파구", position: [37.50626, 127.11250] },
{ name: "강동구", position: [37.54672, 127.14581] },
{ name: "광진구", position: [37.54182, 127.08978] },
{ name: "성동구", position: [37.54781, 127.04406] },
{ name: "용산구", position: [37.52649, 126.98032] },
{ name: "중구", position: [37.55600, 126.99850] },
{ name: "동대문구", position: [37.57683, 127.05242] },
{ name: "중랑구", position: [37.59271, 127.09573] },
{ name: "노원구", position: [37.64749, 127.07639] },
{ name: "도봉구", position: [37.66316, 127.03617] },
{ name: "강북구", position: [37.63526, 127.01088] },
{ name: "성북구", position: [37.59629, 127.01603] }
];

const Map = ({ selections, setSelections }) => {
    const [geoData, setGeoData] = useState(null); // 서울 구역 데이터
    const [location, setLocation] = useState({});
    const navigate = useNavigate();

  // 서울 구역 데이터를 가져오는 함수
  useEffect(() => {
    fetch("/seouldistricts.geojson")
      .then((response) => response.json())
      .then((data) => setGeoData(data));
  }, []);

  // 서울 구역 스타일 (핑크색)
  const districtStyle = {
    color: "white", // 테두리 색상
    weight: 2, // 테두리 두께
    fillColor: "#FF6F91", // 구역 색상
    fillOpacity: 1, // 구역 채우기
  };

  const handlePrev = () => {
    navigate("/time");
  };

  const createLabelIcon = (name) => {
    return L.divIcon({
        className: 'district-label',
        html: `<div style="font-size: 10px; color: white; white-space: nowrap;">
                   ${name}
               </div>`,
        iconAnchor: [20, 15]
    });
  };

  // 서울 구역 클릭 이벤트
  const onEachFeature = (feature, layer) => {
    layer.on("click", () => {
      const districtName = feature.properties.SIG_KOR_NM; // 클릭된 구역 이름

      const selectedDistrict = districtData.find((district) => district.name === districtName);
  
      if (selectedDistrict) {
        setLocation(selectedDistrict); // 선택된 구역 데이터를 location 상태에 저장
        setSelections({ ...selections, location: selectedDistrict }); // selections 상태 업데이트
      }
  
      navigate(`/recommand`); // 추천 페이지로 이동
    });
  };

  const handleMarkerClick = (districtName) => {
    // 선택된 구 이름에 해당하는 데이터 찾기
    const selectedDistrict = districtData.find(
      (district) => district.name === districtName
    );
  
    if (selectedDistrict) {
      setLocation(selectedDistrict); // 선택된 구역 데이터를 location 상태에 저장
      setSelections((prevSelections) => ({
        ...prevSelections,
        location: selectedDistrict,
      })); // selections 상태 업데이트
    }
  
    navigate(`/recommand`); // 추천 페이지로 이동
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
      }}
    >
      <MapContainer
        center={[37.5365, 126.9780]} // 서울 중심 좌표
        zoom={11}
        style={{
          height: "90%",
          width: "90%",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)", // 지도 배경
        }}
        zoomControl={false} // 플러스/마이너스 버튼 제거
        scrollWheelZoom={false}
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
            style={districtStyle}
            onEachFeature={onEachFeature}
          />
        )}
        {districtData.map((district, index) => (
            <Marker
                key={index}
                position={district.position}
                icon={createLabelIcon(district.name)} // 라벨 이름 설정
                eventHandlers={{
                    click: () => handleMarkerClick(district.name)
                }}
            />
        ))}
        <Footer>
          <PrevButton onClick={handlePrev}>이전</PrevButton>
        </Footer>
      </MapContainer>
    </div>
  );
};

const Footer = styled.div`
  position: absolute; /* 부모 요소를 기준으로 위치를 설정 */
  bottom: 0;          /* 부모 요소의 하단에 고정 */
  left: 0;            /* 부모 요소의 왼쪽에 고정 */
  display: flex;      /* 자식 요소를 가로로 정렬 */
  padding: 10px;      /* Footer 내부 여백 */
`;


const PrevButton = styled.button`
  padding: 15px 30px;
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
