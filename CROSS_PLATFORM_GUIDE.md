# 크로스 플랫폼 호환성 가이드

이 프로젝트는 웹, 안드로이드, iOS 세 플랫폼을 모두 지원하도록 수정되었습니다.

## 주요 변경 사항

### 1. 플랫폼 감지 유틸리티 (`src/utils/platform.js`)

플랫폼을 감지하고 환경 변수에 접근하는 유틸리티를 추가했습니다.

**주요 함수:**

- `getPlatform()`: 현재 플랫폼 반환 (WEB, ANDROID, IOS, UNKNOWN)
- `isWeb()`: 웹 환경인지 확인
- `isMobile()`: 모바일 환경인지 확인
- `isAndroid()`: 안드로이드 환경인지 확인
- `isIOS()`: iOS 환경인지 확인
- `getEnv(key, defaultValue)`: 크로스 플랫폼 환경 변수 접근
- `isDev()`: 개발 모드인지 확인
- `isProd()`: 프로덕션 모드인지 확인

### 2. API 클라이언트 수정 (`src/utils/api.js`)

- `import.meta.env` 대신 `getEnv()` 함수 사용
- React Native를 위한 axios 설정 추가
- 타임아웃 설정 추가 (모바일 네트워크 대응)

### 3. 라우터 수정 (`src/App.jsx`)

- 웹: `BrowserRouter` 사용
- 모바일: `MemoryRouter` 사용 (또는 React Navigation 사용 가능)

### 4. 스케일링 유틸리티 수정 (`src/utils/scaling.js`)

- 웹 환경에서만 동작하도록 수정
- 모바일에서는 React Native의 `Dimensions` API 사용 권장

### 5. DOM API 사용 부분 수정

- `document`, `window` 객체 사용 전 플랫폼 체크 추가
- `window.parent.postMessage`는 웹 환경에서만 동작

## 플랫폼별 설정

### 웹 (Vite)

**환경 변수:**

```env
VITE_BACKEND_URL=https://playground.polarislabs.ai.kr/api
```

**빌드:**

```bash
npm run build
```

### 안드로이드/iOS (React Native)

**환경 변수 설정:**

1. `react-native-config` 패키지 사용 (권장):

```bash
npm install react-native-config
```

`.env` 파일:

```env
REACT_APP_BACKEND_URL=https://playground.polarislabs.ai.kr/api
```

2. 또는 네이티브 모듈을 통해 환경 변수 전달

**React Native 프로젝트 설정:**

1. React Native 프로젝트 생성:

```bash
npx react-native init NewsCreatorApp
```

2. 기존 코드를 React Native 프로젝트로 복사

3. 필요한 패키지 설치:

```bash
npm install react-router-dom axios
npm install --save-dev @types/react-native
```

4. 네비게이션 설정 (선택사항):

```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

**React Native용 index.js 예시:**

```javascript
import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
```

## 주의사항

### 1. 이미지 처리

- 웹: 일반적인 `<img>` 태그 사용
- React Native: `<Image>` 컴포넌트 사용 필요

**수정 예시:**

```javascript
import { isWeb } from "./utils/platform.js";

// 플랫폼별 이미지 컴포넌트
const ImageComponent = isWeb() ? "img" : require("react-native").Image;
```

### 2. 스타일링

- 웹: Tailwind CSS 사용 가능
- React Native: StyleSheet API 또는 styled-components 사용

**수정 예시:**

```javascript
import { isWeb } from "./utils/platform.js";

const styles = isWeb()
  ? {
      /* CSS 객체 */
    }
  : StyleSheet.create({
      /* React Native 스타일 */
    });
```

### 3. 비디오 재생

- 웹: `<video>` 태그 사용
- React Native: `react-native-video` 패키지 사용

### 4. 파일 시스템 접근

- 웹: File API 사용
- React Native: `react-native-fs` 또는 `expo-file-system` 사용

## 테스트

### 웹 테스트

```bash
npm run dev
```

### React Native 테스트

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

## 추가 개선 사항

### 1. 컴포넌트 분리

플랫폼별로 다른 컴포넌트가 필요한 경우:

- `components/Image.web.jsx` (웹용)
- `components/Image.native.jsx` (모바일용)

React Native는 자동으로 `.native.jsx` 파일을 인식합니다.

### 2. 네비게이션

모바일 앱에서는 React Navigation 사용을 권장합니다:

```bash
npm install @react-navigation/native @react-navigation/stack
```

### 3. 상태 관리

현재 Zustand를 사용 중이며, 이는 크로스 플랫폼에서 잘 작동합니다.

### 4. API 호출

axios는 React Native에서도 작동하지만, 추가 설정이 필요할 수 있습니다:

```bash
npm install axios
```

또는 fetch API를 직접 사용할 수도 있습니다.

## 문제 해결

### 환경 변수가 읽히지 않는 경우

1. 웹: `.env` 파일이 프로젝트 루트에 있는지 확인
2. React Native: `react-native-config` 설정 확인
3. 빌드 후 환경 변수 변경 시 재빌드 필요

### 라우터가 작동하지 않는 경우

1. 웹: `BrowserRouter` 사용 확인
2. 모바일: `MemoryRouter` 또는 React Navigation 사용 확인

### 스케일링이 작동하지 않는 경우

1. 웹: `isWeb()` 체크 확인
2. 모바일: React Native의 `Dimensions` API 사용

## 참고 자료

- [React Native 공식 문서](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Config](https://github.com/lugg/react-native-config)
- [Expo](https://expo.dev/) (React Native 개발 도구)
