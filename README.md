# News Creator v4 - 초등학생용 영어교육용 앱/웹

React + Vite로 개발된 영어 교육용 뉴스 기사 생성 애플리케이션입니다.

## 🚀 기술 스택

### 핵심 기술

- **React 19** - UI 라이브러리
- **Vite 7** - 빌드 도구 및 개발 서버
- **React Router DOM** - 페이지 라우팅
- **Zustand** - 상태 관리
- **React Hook Form** - 폼 관리
- **Tailwind CSS** - 스타일링
- **Axios** - HTTP 클라이언트
- **date-fns** - 날짜 처리

### AI 기능

- OpenAI API를 통한 기사 자동 생성
- OpenAI API를 통한 이미지 생성
- Backend 서버를 통한 API 호출

## 📁 프로젝트 구조

```
src/
├── pages/           # 페이지 컴포넌트
│   ├── IntroPage.jsx    # 인트로 페이지 (Level 선택)
│   ├── Step1Page.jsx    # Step 1: 정보 입력
│   ├── Step2Page.jsx    # Step 2: 기사 작성 및 이미지 선택
│   └── Step3Page.jsx    # Step 3: 완성된 기사 보기 및 다운로드
├── stores/          # 상태 관리 (Zustand)
│   └── activityStore.js
├── utils/           # 유틸리티 함수
│   └── api.js           # API 호출 함수
├── App.jsx          # 메인 앱 컴포넌트 (라우팅)
└── main.jsx         # 진입점
```

## 🎯 주요 기능

### 1. 인트로 페이지

- Activity 타이틀 노출
- Level 선택 (Beginner, Intermediate, Advanced)
- Start 버튼

### 2. Step 1: 정보 입력

- **Category**: 드롭다운으로 Level별 카테고리 선택 (6~8종)
- **Date**: 날짜 선택 (기본값: 오늘)
- **Who**: 사용자 입력
- **Where**: 사용자 입력
- **Event Summary**: 드롭다운으로 Category별 이벤트 요약 선택 (7종)
- **Extra**: 선택적 추가 정보

### 3. Step 2: 기사 작성 및 이미지 선택

- **좌측 - 기사 영역**:
  - Step 1 정보를 기반으로 AI가 기사 자동 생성 (Headline + 본문)
  - 사용자가 기사 내용 편집 가능
- **우측 - 이미지 영역**:
  - AI가 기사 내용을 기반으로 이미지 2컷 생성
  - 사용자가 이미지 1종 선택
- **Go to Result 버튼**: 이미지 선택 시 활성화되어 Step 3로 이동

### 4. Step 3: 완성된 기사

- 신문 기사 포맷으로 화면 노출

## 🔧 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_BACKEND_URL=https://playground.polarislabs.ai.kr/api
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 표시된 포트)로 접속하세요.

### 4. 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 🔌 Backend API 연동

Backend 서버는 다음 API 엔드포인트를 제공해야 합니다:

### 1. Category 목록 조회

```
GET /api/categories?level={level}
Response: { categories: string[] }
```

### 2. Event Summary 목록 조회

```
GET /api/event-summaries?category={category}&level={level}
Response: { summaries: string[] }
```

### 3. 기사 생성

```
POST /api/generate-article
Body: {
  level: string,
  category: string,
  date: string,
  who: string,
  where: string,
  eventSummary: string,
  extra?: string
}
Response: {
  headline: string,
  content: string
}
```

### 4. 이미지 생성

```
POST /api/generate-images
Body: {
  article: {
    headline: string,
    content: string
  },
  level: string
}
Response: {
  images: string[] // 이미지 URL 배열 (최소 2개)
}
```

### 5. 이미지 스타일 변형 (선택사항)

```
POST /api/transform-image
Body: {
  imageUrl: string,
  style: string
}
Response: {
  transformedImageUrl: string
}
```

## 📝 개발 가이드

### 상태 관리

- Zustand를 사용하여 전역 상태 관리
- `activityStore`에 Level, Step1 데이터, Step2 데이터 저장

### 스타일링

- Tailwind CSS를 사용한 유틸리티 기반 스타일링
- 반응형 디자인 지원 (모바일/태블릿/데스크톱)

## 🐛 문제 해결

### API 호출 실패

- Backend 서버 URL이 올바른지 확인
- CORS 설정 확인
- 네트워크 연결 확인

## 📄 라이선스

이 프로젝트는 개인/교육 목적으로 사용됩니다.
# news-creator-v4
