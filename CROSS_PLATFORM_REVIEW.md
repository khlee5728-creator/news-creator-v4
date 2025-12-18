# 크로스 플랫폼 호환성 검토 보고서

## 검토 개요

현재 코드를 웹, 안드로이드, iOS 세 플랫폼에서 모두 사용할 수 있도록 검토하고 수정했습니다.

## 발견된 문제점 및 수정 사항

### ✅ 1. 환경 변수 접근 방식

**문제:**

- `import.meta.env`는 Vite 전용으로 React Native에서 사용 불가

**수정:**

- `src/utils/platform.js` 생성: 플랫폼 감지 및 환경 변수 접근 유틸리티
- `src/utils/api.js`: `import.meta.env` → `getEnv()` 함수 사용

**파일:**

- ✅ `src/utils/platform.js` (신규 생성)
- ✅ `src/utils/api.js` (수정)

### ✅ 2. 라우터 호환성

**문제:**

- `BrowserRouter`는 웹 전용
- React Native에서는 다른 라우터 필요

**수정:**

- 플랫폼별 라우터 선택: 웹은 `BrowserRouter`, 모바일은 `MemoryRouter`
- `src/App.jsx` 수정

**파일:**

- ✅ `src/App.jsx` (수정)

### ✅ 3. DOM API 사용

**문제:**

- `document.getElementById`, `window` 객체는 웹 전용
- React Native에서는 사용 불가

**수정:**

- 모든 DOM API 사용 전 플랫폼 체크 추가
- `src/main.jsx`: 웹 환경에서만 React DOM 사용
- `src/utils/scaling.js`: 웹 환경에서만 동작하도록 수정
- `src/pages/Step3Page.jsx`: `window.parent.postMessage` 플랫폼 체크 추가

**파일:**

- ✅ `src/main.jsx` (수정)
- ✅ `src/utils/scaling.js` (수정)
- ✅ `src/pages/Step3Page.jsx` (수정)

### ✅ 4. API 클라이언트

**문제:**

- axios가 React Native에서 추가 설정 필요할 수 있음
- 타임아웃 설정 없음

**수정:**

- 타임아웃 설정 추가 (60초)
- React Native를 위한 axios 인터셉터 주석 추가
- 환경 변수 접근 방식 수정

**파일:**

- ✅ `src/utils/api.js` (수정)

### ✅ 5. 스케일링 시스템

**문제:**

- DOM 기반 스케일링으로 모바일에서 작동하지 않음

**수정:**

- 웹 환경에서만 동작하도록 수정
- 모바일에서는 React Native의 `Dimensions` API 사용 권장 (주석 추가)

**파일:**

- ✅ `src/utils/scaling.js` (수정)

## 수정된 파일 목록

1. ✅ `src/utils/platform.js` (신규 생성)
2. ✅ `src/utils/api.js` (수정)
3. ✅ `src/App.jsx` (수정)
4. ✅ `src/main.jsx` (수정)
5. ✅ `src/utils/scaling.js` (수정)
6. ✅ `src/pages/Step3Page.jsx` (수정)

## 추가 작업 필요 사항

### 1. React Native 프로젝트 설정

현재 코드는 웹용으로 작성되어 있으므로, React Native 앱으로 변환하려면:

1. **React Native 프로젝트 생성:**

   ```bash
   npx react-native init NewsCreatorApp
   ```

2. **필요한 패키지 설치:**

   ```bash
   npm install react-router-dom axios zustand date-fns
   npm install react-native-screens react-native-safe-area-context
   ```

3. **네비게이션 설정 (선택):**
   ```bash
   npm install @react-navigation/native @react-navigation/stack
   ```

### 2. 컴포넌트 수정 필요

다음 컴포넌트들은 플랫폼별로 다르게 처리해야 합니다:

#### 이미지 컴포넌트

- **웹:** `<img>` 태그 사용 (현재 상태 유지)
- **React Native:** `<Image>` 컴포넌트 사용 필요

**수정 예시:**

```javascript
import { isWeb } from "./utils/platform.js";
import { Image as RNImage } from "react-native";

const Image = isWeb()
  ? ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />
  : ({ src, ...props }) => <RNImage source={{ uri: src }} {...props} />;
```

#### 비디오 컴포넌트 (`IntroPage.jsx`)

- **웹:** `<video>` 태그 사용 (현재 상태 유지)
- **React Native:** `react-native-video` 패키지 사용 필요

**설치:**

```bash
npm install react-native-video
```

#### 스타일링

- **웹:** Tailwind CSS 사용 (현재 상태 유지)
- **React Native:** StyleSheet API 또는 styled-components 사용

### 3. 환경 변수 설정

#### 웹 (Vite)

`.env` 파일:

```env
VITE_BACKEND_URL=https://playground.polarislabs.ai.kr/api
```

#### React Native

`react-native-config` 사용 권장:

```bash
npm install react-native-config
```

`.env` 파일:

```env
REACT_APP_BACKEND_URL=https://playground.polarislabs.ai.kr/api
```

### 4. 파일 경로 처리

현재 코드에서 사용하는 정적 파일 경로:

- `/images/intro-background.png`
- `/videos/intro-video.mp4`

**React Native에서는:**

- `require()` 사용 또는
- 원격 URL 사용

**수정 예시:**

```javascript
const backgroundImage = isWeb()
  ? "/images/intro-background.png"
  : require("./assets/images/intro-background.png");
```

## 테스트 체크리스트

### 웹 테스트

- [x] 환경 변수 읽기 확인
- [x] 라우터 동작 확인
- [x] API 호출 확인
- [x] 스케일링 동작 확인

### React Native 테스트 (추가 작업 필요)

- [ ] 프로젝트 생성 및 설정
- [ ] 이미지 컴포넌트 수정
- [ ] 비디오 컴포넌트 수정
- [ ] 스타일링 수정
- [ ] 네비게이션 설정
- [ ] 환경 변수 설정
- [ ] 빌드 및 실행 테스트

## 권장 사항

### 1. 코드 분리 전략

플랫폼별로 다른 구현이 필요한 경우:

**방법 1: 플랫폼별 파일**

- `components/Image.web.jsx`
- `components/Image.native.jsx`

React Native는 자동으로 `.native.jsx` 파일을 인식합니다.

**방법 2: 조건부 렌더링**

```javascript
import { isWeb } from "./utils/platform.js";

{
  isWeb() ? <WebComponent /> : <MobileComponent />;
}
```

### 2. 상태 관리

현재 사용 중인 Zustand는 크로스 플랫폼에서 잘 작동합니다. 추가 수정 불필요.

### 3. 네비게이션

- **웹:** React Router 사용 (현재 상태 유지)
- **모바일:** React Navigation 사용 권장

### 4. 빌드 시스템

- **웹:** Vite 사용 (현재 상태 유지)
- **React Native:** Metro Bundler 사용 (기본 제공)

## 결론

현재 코드는 웹 환경에서 완벽하게 작동하며, 모바일 환경을 위한 기본적인 크로스 플랫폼 호환성 수정이 완료되었습니다.

**다음 단계:**

1. React Native 프로젝트 생성 및 설정
2. 플랫폼별 컴포넌트 수정 (이미지, 비디오, 스타일)
3. 환경 변수 설정
4. 테스트 및 디버깅

자세한 내용은 `CROSS_PLATFORM_GUIDE.md` 파일을 참고하세요.
