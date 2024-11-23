# SAMILJUL - 데이트 코스 추천 서비스

### 📖 소개

**SAMILJUL**은 사용자가 선택한 테마, 위치, 시간에 따라 최적의 데이트 코스를 추천해주는 서비스입니다.  
React, Node.js, Firebase를 사용하여 동적으로 개인화된 추천을 제공합니다.

---

### 🚀 주요 기능

1. **테마 기반 추천**

   - 카페, 음식점, 관광명소 등 사용자가 선택한 테마에 따라 코스를 제공합니다.

2. **지역 맞춤형 추천**

   - 서울 내 지역을 기반으로 한 지역별 맞춤형 추천.

3. **실시간 별점 정보 통합**

   - 크롤링을 통해 Firebase에 최신 별점 데이터를 저장하고 이를 활용.

4. **사용자 지정 시간 설정**

   - 시작 및 종료 시간을 설정해 스케줄에 맞춘 코스를 제공합니다.

5. **직관적인 사용자 경험**
   - React 기반 인터페이스로 모바일과 데스크톱 환경 모두 지원.

---

### 🛠️ 기술 스택

- **프론트엔드**: React, Styled-Components
- **백엔드**: Node.js, Express.js
- **데이터베이스**: Firebase Firestore
- **크롤링**: Puppeteer
- **외부 API**: Kakao Map API

---

### 📂 프로젝트 구조

```
samiljul/
├── server/                      # 백엔드 서버 코드
│   ├── api/                     # API 통합 파일
│   │   └── kakaoApi.js          # Kakao Map API 함수
│   ├── crawler/                 # 웹 크롤링 스크립트
│   │   ├── placeCrawler.js      # Puppeteer 기반 크롤링 로직
│   │   └── crawler.js           # 크롤링 배치 처리
│   ├── index.js                 # Node.js 서버 진입점
│   └── serviceAccountKey.json   # Firebase 서비스 계정 키
├── client/                      # 프론트엔드 React 앱
│   ├── src/                     # React 앱 소스 코드
│   │   ├── components/          # React 컴포넌트
│   │   ├── pages/               # 주요 앱 페이지
│   │   └── App.js               # 루트 React 컴포넌트
│   └── public/                  # 정적 자산
├── .gitignore                   # Git에서 제외할 파일 및 디렉토리
├── package.json                 # 프로젝트 종속성
└── README.md                    # 프로젝트 문서
```

---

### 🔧 설치 및 사용법

#### 1. 사전 준비

- **Node.js** (v14 이상 권장)
- **Firebase** 계정 및 Firestore 활성화
- **Kakao Developers** API 키

#### 2. 리포지토리 클론

```bash
git clone https://github.com/pataegonia/samiljul.git
cd samiljul
```

#### 3. 의존성 설치

```bash
# 클라이언트와 서버 각각 설치
npm install
```

#### 4. Firebase 설정

- `server/serviceAccountKey.json`에 Firebase 서비스 계정 키 추가.
- Firestore 데이터베이스 구조는 `FD6`, `CE7`, `AT4`, `CT1`와 같은 컬렉션이 필요.

#### 5. Kakao API 키 추가

- `server/api/kakaoApi.js`에서 `<your_kakao_api_key>`를 Kakao REST API 키로 대체.

#### 6. 개발 서버 실행

```bash
npm run dev
```

#### 7. 앱 접속

[http://localhost:5000](http://localhost:5000)에서 애플리케이션을 실행.

---

### 🌟 주요 API 엔드포인트

#### 1. `/api/recommand`

- **Method**: `POST`
- **설명**: 테마, 시간, 위치를 기반으로 추천 코스를 생성합니다.
- **요청 본문**:
  ```json
  {
    "theme": ["FD6", "CE7", "AT4"],
    "date": "2024-11-13",
    "time": { "start": 9, "end": 18 },
    "location": { "name": "강남구", "position": [37.49037, 127.06203] }
  }
  ```
- **응답**:
  ```json
  {
    "course": {
      "FD6": [{ "place_name": "Sample Restaurant", "rating": "4.2" }],
      "CE7": [{ "place_name": "Sample Cafe", "rating": "4.5" }]
    }
  }
  ```

#### 2. `/api/start-crawl`

- **Method**: `POST`
- **설명**: 장소 정보를 크롤링하여 별점 데이터를 Firestore에 업데이트합니다.

#### 3. `/api/crawl-now`

- **Method**: `POST`
- **설명**: 특정 장소의 크롤링을 즉시 실행합니다.

---

### 🕹️ 작동 원리

1. **장소 데이터 가져오기**  
   Kakao Map API를 사용하여 사용자가 선택한 테마와 위치를 기반으로 장소 데이터를 가져옵니다.

2. **웹 크롤링**  
   Puppeteer를 사용하여 장소의 별점과 리뷰 데이터를 크롤링합니다.

3. **Firestore 통합**  
   크롤링된 데이터를 Firebase Firestore에 저장하여 효율적인 데이터 조회를 지원합니다.

4. **추천 코스 생성**  
   별점과 사용자 선호도를 기반으로 필터링 및 정렬된 추천 코스를 제공합니다.

---

### 🔒 보안

- **민감 데이터**:  
  서비스 계정 키와 API 키는 `.gitignore`에 포함되어 외부에 노출되지 않습니다.
- **요청 제한**:  
  Kakao Map API 및 크롤링 작업에는 적절한 딜레이를 적용해 과도한 요청을 방지합니다.

---

### 📈 향후 개선 사항

- 사용자 인증 기능 추가 (즐겨찾기 저장 지원).
- 시간대 별 추천 기능
- 이미지 지원
- 웹 배포 예정
