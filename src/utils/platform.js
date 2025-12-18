/**
 * 플랫폼 감지 및 환경 변수 접근 유틸리티
 * 웹, 안드로이드, iOS 모두 지원
 */

// 플랫폼 타입 감지
export const Platform = {
  WEB: "web",
  ANDROID: "android",
  IOS: "ios",
  UNKNOWN: "unknown",
};

/**
 * 현재 실행 플랫폼 감지
 * @returns {string} 플랫폼 타입
 */
export function getPlatform() {
  // React Native 환경 감지
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    // 안드로이드와 iOS 구분
    if (typeof require !== "undefined") {
      try {
        const { Platform: RNPlatform } = require("react-native");
        return RNPlatform.OS === "android" ? Platform.ANDROID : Platform.IOS;
      } catch (e) {
        // react-native 모듈을 찾을 수 없는 경우
        return Platform.UNKNOWN;
      }
    }
    return Platform.UNKNOWN;
  }

  // 웹 환경
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return Platform.WEB;
  }

  return Platform.UNKNOWN;
}

/**
 * 웹 환경인지 확인
 * @returns {boolean}
 */
export function isWeb() {
  return getPlatform() === Platform.WEB;
}

/**
 * 모바일 환경인지 확인 (안드로이드 + iOS)
 * @returns {boolean}
 */
export function isMobile() {
  const platform = getPlatform();
  return platform === Platform.ANDROID || platform === Platform.IOS;
}

/**
 * 안드로이드 환경인지 확인
 * @returns {boolean}
 */
export function isAndroid() {
  return getPlatform() === Platform.ANDROID;
}

/**
 * iOS 환경인지 확인
 * @returns {boolean}
 */
export function isIOS() {
  return getPlatform() === Platform.IOS;
}

/**
 * 환경 변수 접근 (크로스 플랫폼 호환)
 * @param {string} key - 환경 변수 키
 * @param {string} defaultValue - 기본값
 * @returns {string}
 */
export function getEnv(key, defaultValue = "") {
  const platform = getPlatform();

  if (platform === Platform.WEB) {
    // 웹: Vite의 import.meta.env 사용
    if (typeof import.meta !== "undefined" && import.meta.env) {
      return import.meta.env[key] || defaultValue;
    }
    // 폴백: window 객체에서 환경 변수 찾기
    if (typeof window !== "undefined" && window.__ENV__) {
      return window.__ENV__[key] || defaultValue;
    }
  } else if (platform === Platform.ANDROID || platform === Platform.IOS) {
    // React Native: react-native-config 또는 네이티브 모듈 사용
    // 기본적으로 process.env 사용 (Metro bundler가 처리)
    if (typeof process !== "undefined" && process.env) {
      return process.env[key] || defaultValue;
    }
  }

  return defaultValue;
}

/**
 * 개발 모드인지 확인
 * @returns {boolean}
 */
export function isDev() {
  const platform = getPlatform();

  if (platform === Platform.WEB) {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      return (
        import.meta.env.MODE === "development" || import.meta.env.DEV === true
      );
    }
    return process.env.NODE_ENV === "development";
  } else {
    return process.env.NODE_ENV === "development";
  }
}

/**
 * 프로덕션 모드인지 확인
 * @returns {boolean}
 */
export function isProd() {
  return !isDev();
}
