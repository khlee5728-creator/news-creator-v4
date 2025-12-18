import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useActivityStore from "../stores/activityStore";

const IntroPage = () => {
  const navigate = useNavigate();
  const { level, setLevel, resetStep1Data, resetStep2Data } =
    useActivityStore();
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  // 페이지 진입 시 Step1, Step2 데이터 초기화 (level은 유지)
  useEffect(() => {
    resetStep1Data();
    resetStep2Data();
  }, [resetStep1Data, resetStep2Data]);

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleStart = () => {
    if (level) {
      setShowVideo(true);
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    navigate("/step1");
  };

  const handleSkipVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowVideo(false);
    navigate("/step1");
  };

  const getLevelStyle = (lvl) => {
    const styles = {
      Beginner: {
        background: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
        boxShadow:
          "0 10px 30px rgba(99, 102, 241, 0.4), 0 0 20px rgba(99, 102, 241, 0.3)",
      },
      Intermediate: {
        background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
        boxShadow:
          "0 10px 30px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.3)",
      },
      Advanced: {
        background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
        boxShadow:
          "0 10px 30px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.3)",
      },
    };
    return styles[lvl];
  };

  return (
    <>
      <div
        className="w-full h-full flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: "url(/images/intro-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Main Content - Centered */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Main Title */}
          <h1 className="text-7xl font-serif font-bold text-white text-center mb-3 drop-shadow-lg">
            NEWS CREATOR
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white text-center mb-8 drop-shadow-md">
            Create Your Own English Newspaper.
          </p>

          {/* Level Selection Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {levels.map((lvl) => {
              const buttonStyle = getLevelStyle(lvl);
              return (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  style={buttonStyle}
                  className={`rounded-2xl px-6 py-8 transition-all transform hover:scale-105 text-white border-2 ${
                    level === lvl
                      ? "ring-4 ring-white ring-opacity-70 shadow-2xl scale-105 border-white/80"
                      : "border-white/30 shadow-xl"
                  }`}
                >
                  <div className="text-white text-xs font-medium mb-2 opacity-90">
                    Level
                  </div>
                  <div className="text-white text-2xl font-bold drop-shadow-lg">
                    {lvl}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={!level}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
              level
                ? "bg-gradient-button text-white hover:bg-gradient-button-hover shadow-kid hover:shadow-kid-hover hover:scale-105"
                : "bg-gray-400 bg-opacity-50 text-gray-600 cursor-not-allowed"
            }`}
          >
            {/* Play Icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <span>Tap to Start</span>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Skip Button */}
          <button
            onClick={handleSkipVideo}
            className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-lg font-medium transition-all"
          >
            Skip
          </button>

          {/* Video Player - Full Screen */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            onEnded={handleVideoEnd}
          >
            <source src="/videos/intro-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  );
};

export default IntroPage;
