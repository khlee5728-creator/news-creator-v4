import { useEffect } from "react";
import { isWeb, isDev } from "./utils/platform.js";
// 플랫폼별 라우터 import
// 웹: BrowserRouter, 모바일: MemoryRouter (또는 React Navigation 사용)
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import Step1Page from "./pages/Step1Page";
import Step2Page from "./pages/Step2Page";
import Step3Page from "./pages/Step3Page";
import { initScaling } from "./utils/scaling.js";

// 플랫폼별 라우터 선택
const Router = isWeb() ? BrowserRouter : MemoryRouter;

function App() {
  useEffect(() => {
    // 웹 환경에서만 스케일링 적용
    if (isWeb()) {
      initScaling({
        designWidth: 1280,
        designHeight: 800,
        containerId: "stage",
        enableLog: isDev(),
      });
    }
  }, []);

  return (
    <div id="stage" style={{ width: "1280px", height: "800px" }}>
      <Router>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/step1" element={<Step1Page />} />
          <Route path="/step2" element={<Step2Page />} />
          <Route path="/step3" element={<Step3Page />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
