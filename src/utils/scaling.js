/**
 * 스케일링 시스템 유틸리티
 * 고정 디자인 해상도를 기준으로 다양한 화면 크기에 맞춰 자동 스케일링
 * 웹 환경에서만 동작 (모바일은 React Native의 Dimensions API 사용)
 */

import { isWeb } from "./platform.js";

let currentScaleValue = 1.0;
let containerElement = null;
let designWidth = 1280;
let designHeight = 800;
let enableLogging = false;
let resizeListener = null;

/**
 * 스케일링 시스템 초기화
 * @param {Object} options - 설정 옵션
 * @param {number} options.designWidth - 디자인 기준 너비 (기본값: 1280)
 * @param {number} options.designHeight - 디자인 기준 높이 (기본값: 800)
 * @param {string} options.containerId - 컨테이너 요소 ID (기본값: 'root')
 * @param {boolean} options.enableLog - 로깅 활성화 여부 (기본값: false)
 */
export function initScaling(options = {}) {
  // 웹 환경에서만 동작
  if (!isWeb()) {
    if (options.enableLog) {
      console.log(
        "Scaling: Not available on mobile. Use React Native Dimensions API instead."
      );
    }
    return;
  }

  const {
    designWidth: dw = 1280,
    designHeight: dh = 800,
    containerId = "root",
    enableLog = false,
  } = options;

  designWidth = dw;
  designHeight = dh;
  enableLogging = enableLog;

  // 컨테이너 요소 선택
  if (typeof document === "undefined") {
    console.error("Scaling: document is not available");
    return;
  }

  containerElement = document.getElementById(containerId);

  if (!containerElement) {
    console.error(
      `Scaling: Container element with id "${containerId}" not found`
    );
    return;
  }

  // 초기 스케일 적용
  applyScaling();

  // 리사이즈 이벤트 리스너 등록
  if (typeof window !== "undefined") {
    resizeListener = handleResize;
    window.addEventListener("resize", resizeListener);
  }

  if (enableLogging) {
    console.log("Scaling system initialized", {
      designWidth,
      designHeight,
      containerId,
      initialScale: currentScaleValue,
    });
  }
}

/**
 * 리사이즈 이벤트 핸들러
 */
function handleResize() {
  applyScaling();
}

/**
 * 스케일 적용 함수
 */
function applyScaling() {
  if (!containerElement || !isWeb()) return;

  if (typeof window === "undefined") return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 스케일 비율 계산 (비율 유지하며 작은 값 선택)
  const scaleX = viewportWidth / designWidth;
  const scaleY = viewportHeight / designHeight;
  const scale = Math.min(scaleX, scaleY);

  // 수평 중앙 정렬 좌표 계산
  const scaledWidth = designWidth * scale;
  const left = (viewportWidth - scaledWidth) / 2;
  const top = 0; // 항상 상단에 배치

  // 스타일 적용
  containerElement.style.width = `${designWidth}px`;
  containerElement.style.height = `${designHeight}px`;
  containerElement.style.position = "absolute";
  containerElement.style.left = `${left}px`;
  containerElement.style.top = `${top}px`;
  containerElement.style.transformOrigin = "top left";
  containerElement.style.transform = `scale(${scale})`;

  // 스케일 값 저장
  currentScaleValue = scale;
  if (typeof window !== "undefined") {
    window.currentScale = scale;
  }

  if (enableLogging) {
    console.log("Scaling applied", {
      viewport: { width: viewportWidth, height: viewportHeight },
      design: { width: designWidth, height: designHeight },
      scale,
      position: { left, top },
    });
  }
}

/**
 * 현재 적용된 스케일 값 반환
 * @returns {number} 현재 스케일 값
 */
export function getCurrentScale() {
  return currentScaleValue;
}

/**
 * 스케일링 시스템 정리 (이벤트 리스너 제거)
 */
export function cleanupScaling() {
  if (isWeb() && typeof window !== "undefined" && resizeListener) {
    window.removeEventListener("resize", resizeListener);
  }
  containerElement = null;
  currentScaleValue = 1.0;
  resizeListener = null;
  if (typeof window !== "undefined") {
    window.currentScale = 1.0;
  }
}
