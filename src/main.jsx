import { StrictMode } from "react";
import { isWeb } from "./utils/platform.js";
import App from "./App.jsx";

// 웹 환경에서만 React DOM 사용
if (isWeb()) {
  // 웹 환경: React DOM으로 렌더링
  import("react-dom/client").then(({ createRoot }) => {
    import("./index.css").then(() => {
      const rootElement = document.getElementById("root");
      if (rootElement) {
        createRoot(rootElement).render(
          <StrictMode>
            <App />
          </StrictMode>
        );
      }
    });
  });
}

// React Native 환경에서는 별도의 index.js에서 AppRegistry.registerComponent 호출
// 예:
// import { AppRegistry } from 'react-native';
// import App from './App';
// AppRegistry.registerComponent('NewsCreator', () => App);
