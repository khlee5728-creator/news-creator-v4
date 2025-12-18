/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "kid-primary": "#6366F1", // 밝은 인디고
        "kid-primary-light": "#818CF8",
        "kid-primary-dark": "#4F46E5",
        "kid-secondary": "#EC4899", // 밝은 핑크
        "kid-accent": "#F59E0B", // 밝은 오렌지
        "kid-success": "#10B981", // 밝은 초록
        "kid-bg-start": "#FFF8E7", // 크림색 시작
        "kid-bg-end": "#FEF3C7", // 밝은 노란색 끝
        "kid-card": "#FFFFFF",
        "kid-text": "#1F2937",
        "kid-text-light": "#6B7280",
      },
    },
  },
  plugins: [],
};
