import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  NewspaperIcon,
  PencilIcon,
  BookmarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  PaintBrushIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import useActivityStore from "../stores/activityStore";
import { apiService } from "../utils/api";

// Level별 기본 템플릿 기사 생성 함수
const generateTemplateArticle = (level, step1Data) => {
  const dateStr = new Date(step1Data.date).toLocaleDateString();

  if (level === "Beginner") {
    return `On ${dateStr}, ${step1Data.who} had an amazing experience at ${step1Data.where}.

This was a ${step1Data.eventSummary} event. Everyone had a great time. The event was fun and exciting.

People learned many new things. They made new friends too. It was a wonderful day for everyone.`;
  } else if (level === "Intermediate") {
    return `On ${dateStr}, ${step1Data.who} participated in an exciting event at ${step1Data.where}.

This was a ${step1Data.eventSummary} event that brought together many people. The event featured interesting activities and presentations that captivated the audience. Participants had the opportunity to learn new skills and share their experiences.

The atmosphere was lively and engaging throughout the day. Organizers worked hard to make sure everyone enjoyed themselves. Many people said it was one of the best events they had attended.

The event successfully achieved its goals and left a positive impact on all who attended.`;
  } else {
    return `On ${dateStr}, ${step1Data.who} was part of a significant ${step1Data.eventSummary} event held at ${step1Data.where}.

This remarkable event brought together a diverse group of participants who shared a common interest in the topic. The event featured comprehensive presentations, interactive workshops, and engaging discussions that provided valuable insights to all attendees. Participants had the opportunity to network with professionals and enthusiasts in the field.

The organizers demonstrated exceptional planning and execution, ensuring that every aspect of the event ran smoothly. The program included multiple sessions covering various aspects of the topic, allowing attendees to gain a well-rounded understanding. Expert speakers shared their knowledge and experiences, contributing to the overall educational value of the event.

Throughout the day, the atmosphere remained vibrant and intellectually stimulating. Attendees actively participated in discussions, asked thoughtful questions, and engaged with the material presented. The event successfully created a platform for learning, collaboration, and professional development.

The impact of this event extended beyond the immediate experience, as participants left with new knowledge, connections, and inspiration. Many expressed their appreciation for the quality of the content and the opportunity to be part of such a meaningful gathering.`;
  }
};

const Step2Page = () => {
  const navigate = useNavigate();
  const { level, step1Data, step2Data, setStep2Data, setSelectedImage } =
    useActivityStore();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState(false);
  const hasGeneratedRef = useRef(false);

  // Step1 데이터로 AI 기사 생성 (한 번만 실행)
  useEffect(() => {
    const generateArticle = async () => {
      // 이미 기사가 생성되어 있으면 재생성하지 않음
      if (
        step2Data.article.headline &&
        step2Data.article.content &&
        step2Data.article.headline.trim() !== "" &&
        step2Data.article.content.trim() !== ""
      ) {
        hasGeneratedRef.current = true;
        return; // 이미 생성된 경우
      }

      // 이미 한 번 생성 시도했으면 재시도하지 않음
      if (hasGeneratedRef.current) {
        return;
      }

      if (!level || !step1Data.category || !step1Data.who || !step1Data.where) {
        return; // 필수 데이터가 없으면 리턴
      }

      hasGeneratedRef.current = true;
      setLoading(true);
      try {
        const articleData = await apiService.generateArticle({
          level,
          ...step1Data,
        });

        setStep2Data({
          article: {
            headline: articleData.headline || "Sample Headline",
            content: articleData.content || "Sample article content...",
          },
          images: step2Data.images || [],
          selectedImageIndex: step2Data.selectedImageIndex,
        });
      } catch (error) {
        console.error("Failed to generate article:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        // API 에러가 발생한 경우 사용자에게 알리고 기본 템플릿 제공
        alert(
          `Failed to generate article. Please check the console for details. Using a template article.`
        );

        // Level에 맞는 기본 템플릿 기사 생성
        const templateContent = generateTemplateArticle(level, step1Data);

        setStep2Data({
          article: {
            headline: `${step1Data.who} at ${step1Data.where}`,
            content: templateContent,
          },
          images: step2Data.images || [],
          selectedImageIndex: step2Data.selectedImageIndex,
        });
      } finally {
        setLoading(false);
      }
    };

    generateArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 이미지 생성 핸들러 (최적화: 프롬프트 간결화, quality standard 설정)
  const handleGenerateImages = async () => {
    if (!step2Data.article.content) {
      alert("Please create an article first before generating images.");
      return;
    }

    setImageLoading(true);
    try {
      const imageData = await apiService.generateImages({
        article: step2Data.article,
        level,
      });

      const images = imageData.images || [];
      setStep2Data({
        ...step2Data,
        images:
          images.length > 0
            ? images
            : [
                "https://via.placeholder.com/400x300?text=Image+1",
                "https://via.placeholder.com/400x300?text=Image+2",
              ],
        selectedImageIndex: null, // 이미지 재생성 시 선택 초기화
      });
    } catch (error) {
      console.error("Failed to generate images:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert("Failed to generate images. Please try again.");
      // 임시 이미지
      setStep2Data({
        ...step2Data,
        images: [
          "https://via.placeholder.com/400x300?text=Image+1",
          "https://via.placeholder.com/400x300?text=Image+2",
        ],
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleArticleEdit = (field, value) => {
    setStep2Data({
      ...step2Data,
      article: {
        ...step2Data.article,
        [field]: value,
      },
    });
  };

  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  const handleNext = () => {
    if (step2Data.selectedImageIndex !== null) {
      navigate("/step3");
    }
  };

  return (
    <div className="w-full h-full bg-gradient-kid bg-pattern-stars py-8 px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto h-full flex flex-col relative z-10">
        {/* Header with title and level button */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-xl font-bold text-kid-text">
            Step 2. Write Article and Select Image.
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

        <div className="grid grid-cols-2 gap-6 flex-1 overflow-y-auto min-h-0">
          {/* 좌측: 기사 영역 */}
          <div className="bg-gradient-card rounded-3xl shadow-2xl p-4 flex flex-col min-h-0 border-2 border-white/50 backdrop-blur-sm">
            <div className="mb-2 flex-shrink-0">
              <h3 className="text-lg font-semibold text-kid-text flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-kid-primary/10">
                  <NewspaperIcon className="w-6 h-6 text-kid-primary" />
                </div>
                Article
              </h3>
            </div>

            {loading && !step2Data.article.headline ? (
              <div className="text-center py-8">
                <div className="p-3 rounded-2xl bg-kid-primary/10 inline-block mb-4">
                  <PencilIcon className="w-20 h-20 text-kid-primary animate-bounce" />
                </div>
                <p className="text-kid-text text-lg font-medium">
                  Generating article...
                </p>
                <p className="text-kid-primary-dark text-sm mt-2 font-medium">
                  Please wait!
                </p>
              </div>
            ) : (
              <div className="space-y-3 flex flex-col flex-1 min-h-0">
                <div className="flex-shrink-0">
                  <label className="flex items-center gap-2 text-sm font-semibold text-kid-text mb-1.5">
                    <div className="p-1 rounded-lg bg-kid-primary/10">
                      <BookmarkIcon className="w-6 h-6 text-kid-primary" />
                    </div>
                    Headline
                  </label>
                  <input
                    type="text"
                    value={step2Data.article.headline}
                    onChange={(e) =>
                      handleArticleEdit("headline", e.target.value)
                    }
                    className="w-full px-4 py-2.5 text-base border-2 border-kid-primary-light/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-kid-primary focus:border-kid-primary transition-all hover:border-kid-primary-light/50"
                  />
                </div>

                <div className="flex flex-col flex-1 min-h-0">
                  <label className="flex items-center gap-2 text-sm font-semibold text-kid-text mb-1.5 flex-shrink-0">
                    <div className="p-1 rounded-lg bg-kid-primary/10">
                      <DocumentTextIcon className="w-6 h-6 text-kid-primary" />
                    </div>
                    Content
                  </label>
                  <textarea
                    value={step2Data.article.content}
                    onChange={(e) =>
                      handleArticleEdit("content", e.target.value)
                    }
                    className="w-full px-4 py-2.5 text-base border-2 border-kid-primary-light/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-kid-primary focus:border-kid-primary transition-all hover:border-kid-primary-light/50 resize-none flex-1 min-h-0 overflow-y-auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 우측: 이미지 영역 */}
          <div className="bg-gradient-card rounded-3xl shadow-2xl p-4 flex flex-col min-h-0 border-2 border-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h3 className="text-lg font-semibold text-kid-text flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-kid-primary/10">
                  <PhotoIcon className="w-6 h-6 text-kid-primary" />
                </div>
                Select Image
              </h3>
              <button
                onClick={handleGenerateImages}
                disabled={!step2Data.article.content || imageLoading || loading}
                className="px-3 py-1.5 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:cursor-not-allowed text-xs flex items-center gap-1.5 shadow-kid"
                style={{
                  background:
                    !step2Data.article.content || imageLoading || loading
                      ? "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)"
                      : "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
                  boxShadow:
                    !step2Data.article.content || imageLoading || loading
                      ? "none"
                      : "0 4px 6px -1px rgba(236, 72, 153, 0.3), 0 2px 4px -1px rgba(236, 72, 153, 0.2)",
                }}
                onMouseEnter={(e) => {
                  if (
                    !(!step2Data.article.content || imageLoading || loading)
                  ) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #DB2777 0%, #BE185D 100%)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (
                    !(!step2Data.article.content || imageLoading || loading)
                  ) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)";
                  }
                }}
              >
                {imageLoading ? (
                  <>
                    <PaintBrushIcon className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <PaintBrushIcon className="w-5 h-5" />
                    <span>Generate Images</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-hidden min-h-0 py-1">
              {imageLoading ? (
                <div className="text-center py-8">
                  <div className="p-3 rounded-2xl bg-kid-secondary/10 inline-block mb-4">
                    <PaintBrushIcon className="w-20 h-20 text-kid-secondary animate-bounce" />
                  </div>
                  <p className="text-kid-text text-lg font-medium">
                    Generating images...
                  </p>
                  <p className="text-kid-primary-dark text-sm mt-2 font-medium">
                    Creating amazing pictures!
                  </p>
                </div>
              ) : step2Data.images.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-3 rounded-2xl bg-kid-primary/10 inline-block mb-4">
                    <PhotoIcon className="w-16 h-16 text-kid-primary" />
                  </div>
                  <p className="text-kid-text mb-4">
                    Click "Generate Images" to create images based on your
                    article.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center h-full">
                  {/* 이미지가 2개 미만일 경우 빈 프레임도 표시 */}
                  {[0, 1].map((index) => {
                    const image = step2Data.images[index];
                    const isEmpty = !image;
                    return (
                      <div
                        key={index}
                        onClick={() => !isEmpty && handleImageSelect(index)}
                        className={`rounded-xl overflow-hidden transition-all flex-shrink-0 ${
                          isEmpty
                            ? "border-4 border-gray-300 flex items-center justify-center bg-gray-100"
                            : step2Data.selectedImageIndex === index
                            ? "border-[6px] border-kid-primary shadow-2xl ring-8 ring-kid-primary/40 cursor-pointer scale-[1.02]"
                            : "border-4 border-gray-200 hover:border-kid-primary/50 hover:shadow-lg hover:scale-[1.01] cursor-pointer opacity-80 hover:opacity-100"
                        }`}
                        style={{
                          ...(isEmpty
                            ? {
                                aspectRatio: "1792 / 1024",
                                width: "90%",
                                maxHeight: "calc((100% - 0.5rem) / 2)",
                              }
                            : {}),
                        }}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={`Generated image ${index + 1}`}
                            className="block w-full h-full object-contain"
                            style={{
                              maxHeight: "232px",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=Image+Error";
                            }}
                          />
                        ) : (
                          <div
                            className="flex items-center justify-center text-gray-400 text-sm"
                            style={{
                              width: "400px",
                              aspectRatio: "1792 / 1024",
                            }}
                          >
                            <PhotoIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-4 flex-shrink-0">
          <button
            onClick={handleNext}
            disabled={
              step2Data.selectedImageIndex === null || loading || imageLoading
            }
            className="w-full px-6 py-4 text-base font-bold bg-gradient-button text-white rounded-2xl hover:bg-gradient-button-hover transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-kid hover:shadow-kid-hover flex items-center justify-center gap-2"
          >
            <ArrowRightIcon className="w-7 h-7" />
            <span>Go to Result</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Page;
