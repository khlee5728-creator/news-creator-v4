# 문제 해결 가이드

## 로컬 서버 실행 문제

### 1. 서버가 시작되지 않는 경우

**해결 방법:**
```bash
# 포트가 사용 중인지 확인
netstat -ano | findstr :5173

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 개발 서버 재시작
npm run dev
```

### 2. 브라우저에서 빈 화면이 보이는 경우

**확인 사항:**
- 브라우저 개발자 도구(F12)의 Console 탭에서 오류 확인
- Network 탭에서 파일 로드 실패 확인

**해결 방법:**
```bash
# 캐시 클리어 후 재시작
npm run dev -- --force
```

### 3. 모듈을 찾을 수 없다는 오류

**해결 방법:**
```bash
# 의존성 재설치
npm install

# 특정 패키지 재설치
npm uninstall [패키지명]
npm install [패키지명]
```

### 4. Tailwind CSS 스타일이 적용되지 않는 경우

**확인 사항:**
- `tailwind.config.js` 파일이 올바른지 확인
- `postcss.config.js` 파일이 올바른지 확인
- `src/index.css`에 `@tailwind` 지시어가 있는지 확인

**해결 방법:**
```bash
# Tailwind CSS 재설치
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.0
npx tailwindcss init -p
```

### 5. API 호출 오류

**확인 사항:**
- `.env` 파일이 프로젝트 루트에 있는지 확인
- `VITE_BACKEND_URL` 환경 변수가 올바른지 확인
- Backend 서버가 실행 중인지 확인

**해결 방법:**
```bash
# .env 파일 생성/수정
echo "VITE_BACKEND_URL=https://playground.polarislabs.ai.kr/api" > .env

# 개발 서버 재시작 (환경 변수 변경 후 필수)
npm run dev
```

### 6. React Router 오류

**확인 사항:**
- `react-router-dom`이 올바르게 설치되었는지 확인
- 브라우저 콘솔에서 라우팅 관련 오류 확인

**해결 방법:**
```bash
# React Router 재설치
npm uninstall react-router-dom
npm install react-router-dom@^6.0.0
```

### 7. Zustand 상태 관리 오류

**확인 사항:**
- `zustand` 패키지가 올바르게 설치되었는지 확인
- 스토어 파일의 import 경로가 올바른지 확인

**해결 방법:**
```bash
# Zustand 재설치
npm uninstall zustand
npm install zustand@^4.0.0
```

## 일반적인 디버깅 방법

1. **브라우저 개발자 도구 확인**
   - F12를 눌러 개발자 도구 열기
   - Console 탭에서 JavaScript 오류 확인
   - Network 탭에서 API 호출 상태 확인

2. **터미널 오류 확인**
   - 개발 서버 실행 시 터미널에 표시되는 오류 메시지 확인
   - 빌드 오류: `npm run build` 실행

3. **캐시 클리어**
   ```bash
   # 브라우저 캐시 클리어 (Ctrl+Shift+Delete)
   # 또는 시크릿 모드에서 테스트
   
   # Vite 캐시 클리어
   rm -rf node_modules/.vite
   npm run dev
   ```

4. **의존성 확인**
   ```bash
   # package.json의 모든 의존성이 설치되었는지 확인
   npm list --depth=0
   ```

## 추가 도움말

문제가 계속되면 다음 정보를 확인하세요:
- Node.js 버전: `node --version` (권장: v18 이상)
- npm 버전: `npm --version`
- 운영체제 정보
- 브라우저 종류 및 버전
- 정확한 오류 메시지 (터미널 및 브라우저 콘솔)

