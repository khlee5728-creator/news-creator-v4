import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import useActivityStore from "../stores/activityStore";
import { format } from "date-fns";

const Step3Page = () => {
  const navigate = useNavigate();
  const { level, step1Data, step2Data } = useActivityStore();

  // 컨텐츠의 마지막 페이지에서 실행
  useEffect(() => {
    // 웹 환경에서 iframe 내부인 경우에만 postMessage 전송
    if (
      typeof window !== "undefined" &&
      window.parent &&
      window.parent !== window
    ) {
      window.parent.postMessage(
        {
          op: "contentFinished",
          data: {},
          from: "child",
        },
        "*"
      );
    }
    // 모바일 환경에서는 네이티브 브릿지를 통해 메시지 전송 가능
    // 예: NativeModules 또는 react-native-webview 사용
  }, []);

  const selectedImage = step2Data.images[step2Data.selectedImageIndex];

  return (
    <div className="w-full h-full bg-gradient-kid bg-pattern-stars py-8 px-4 overflow-hidden relative">
      <div className="max-w-5xl mx-auto h-full flex flex-col relative z-10">
        {/* Header with title and level button */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-xl font-bold text-kid-text">
            Step3. Completed Article
          </h2>
          {level && (
            <div
              className="px-5 py-2.5 rounded-xl font-bold text-white shadow-lg border-2 border-white/50 backdrop-blur-sm"
              style={{
                background:
                  level === "Beginner"
                    ? "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)"
                    : level === "Intermediate"
                    ? "linear-gradient(135deg, #10B981 0%, #34D399 100%)"
                    : "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
              }}
            >
              {level}
            </div>
          )}
        </div>

        {/* 신문 기사 포맷 */}
        <div
          className="bg-white border-4 border-gray-800 shadow-2xl px-10 pt-8 pb-4 news-article-format flex-1 overflow-hidden min-h-0"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {/* 신문 헤더 */}
          <div className="border-b-4 border-gray-900 mb-4 pb-3">
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-xs text-gray-600">
                {format(step1Data.date, "EEEE, MMMM dd, yyyy")}
              </div>
              <div className="text-xs text-gray-600">Vol. 1, No. 1</div>
            </div>
            <h1
              className="text-6xl font-bold text-center text-gray-900 mb-2 tracking-tight"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              THE NEWS TIMES
            </h1>
            <div className="border-t-2 border-gray-900 pt-2 text-center text-xs text-gray-600">
              "All the News That's Fit to Print"
            </div>
          </div>

          {/* 메인 헤드라인 */}
          <div className="mb-4 border-b-2 border-gray-400 pb-3">
            <h2
              className="text-4xl font-bold text-gray-900 mb-2 leading-tight"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              {step2Data.article.headline}
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-700 border-t border-gray-300 pt-2 mt-2">
              <span className="font-semibold">By {step1Data.who}</span>
              <span className="text-gray-400">|</span>
              <span>{step1Data.category}</span>
              <span className="text-gray-400">|</span>
              <span>{format(step1Data.date, "MMM dd, yyyy")}</span>
            </div>
          </div>

          {/* 이미지와 본문 레이아웃 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* 이미지 영역 */}
            {selectedImage && (
              <div className="col-span-1">
                <div className="border-2 border-gray-400 p-2 bg-gray-50">
                  <img
                    src={selectedImage}
                    alt="News article"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x400?text=Image+Error";
                    }}
                  />
                  <p className="text-xs text-gray-600 italic mt-2 text-center border-t border-gray-300 pt-2">
                    Photo: {step1Data.where}
                  </p>
                </div>
              </div>
            )}

            {/* 기사 본문 */}
            <div
              className={`prose max-w-none ${
                selectedImage ? "col-span-2" : "col-span-3"
              }`}
            >
              <div
                className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base"
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  columnCount: selectedImage ? 1 : 2,
                  columnGap: "1.5rem",
                }}
              >
                {step2Data.article.content}
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          {step1Data.extra && (
            <div className="mt-4 pt-4 border-t-2 border-gray-400">
              <p
                className="text-sm text-gray-700 italic leading-relaxed"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                <span className="font-semibold">Note: </span>
                {step1Data.extra}
              </p>
            </div>
          )}

          {/* 푸터 */}
          <div className="mt-4 pt-2 border-t-4 border-gray-900">
            <div className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} The News Times. All rights reserved.
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-6 flex justify-center flex-shrink-0">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-4 text-base font-bold bg-gradient-to-r from-kid-secondary via-pink-500 to-kid-secondary text-white rounded-2xl hover:from-pink-600 hover:via-pink-500 hover:to-pink-600 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
              boxShadow:
                "0 10px 25px -5px rgba(236, 72, 153, 0.4), 0 4px 6px -2px rgba(236, 72, 153, 0.3)",
            }}
          >
            <div className="p-1.5 rounded-lg bg-white/20">
              <ArrowPathIcon className="w-7 h-7" />
            </div>
            <span>Start New</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Page;
