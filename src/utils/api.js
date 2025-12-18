import axios from "axios";
import { isWeb, isDev, getEnv } from "./platform.js";

// 개발 환경에서는 프록시를 통해 /api로 요청, 프로덕션에서는 환경 변수 또는 기본 URL 사용
const getBackendUrl = () => {
  if (isWeb() && isDev()) {
    return "/api"; // Vite 프록시 사용 (웹 개발 환경만)
  }

  // 환경 변수에서 백엔드 URL 가져오기 (크로스 플랫폼)
  const envUrl = getEnv("VITE_BACKEND_URL") || getEnv("REACT_APP_BACKEND_URL");
  return envUrl || "https://playground.polarislabs.ai.kr/api";
};

const backendUrl = getBackendUrl();

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60초 타임아웃 (모바일 네트워크 대응)
});

// React Native를 위한 axios 인터셉터 설정
if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
  // React Native에서는 추가 헤더나 설정이 필요할 수 있음
  api.defaults.adapter = require("axios/lib/adapters/xhr"); // 또는 fetch adapter 사용
}

// 이미지를 base64로 변환하는 유틸리티 함수
// 백엔드 프록시가 없으므로 원본 URL을 그대로 반환
const convertImageToBase64 = async (imageUrl) => {
  // 프록시 엔드포인트가 없으므로 원본 URL 반환
  return imageUrl;
};

// API 호출 함수들
export const apiService = {
  // AI 기사 생성 - Chat Completions API 사용
  generateArticle: async (data) => {
    const { level, category, date, who, where, eventSummary, extra } = data;

    // Level별 기사 길이 설정
    const lengthConfig = {
      Beginner: {
        paragraphs: "2-3",
        sentences: "3-4 sentences per paragraph",
        description: "short and simple sentences, easy vocabulary",
        wordCount: "approximately 100-150 words",
        maxTokens: 500, // 토큰 수를 충분히 크게 설정
        minWords: 100,
        maxWords: 150,
      },
      Intermediate: {
        paragraphs: "3-4",
        sentences: "4-5 sentences per paragraph",
        description: "moderate length sentences, intermediate vocabulary",
        wordCount: "approximately 200-300 words",
        maxTokens: 800,
        minWords: 200,
        maxWords: 300,
      },
      Advanced: {
        paragraphs: "4-5",
        sentences: "5-6 sentences per paragraph",
        description:
          "longer sentences with more complex structures, advanced vocabulary",
        wordCount: "approximately 350-500 words",
        maxTokens: 1200,
        minWords: 350,
        maxWords: 500,
      },
    };

    const config = lengthConfig[level] || lengthConfig.Intermediate;

    // 기사 생성을 위한 프롬프트 구성 (더 명확하고 강력하게)
    const prompt = `You are a news writer for elementary school students at ${level} level.

Create a news article with the following information:
- Category: ${category}
- Date: ${new Date(date).toLocaleDateString()}
- Who: ${who}
- Where: ${where}
- Event Summary: ${eventSummary}
${extra ? `- Extra: ${extra}` : ""}

REQUIREMENTS (STRICTLY FOLLOW):
1. Headline: One catchy line (max 15 words)
2. Article Content:
   - MUST be exactly ${config.paragraphs} paragraphs
   - Each paragraph MUST have ${config.sentences}
   - Total word count MUST be between ${config.minWords} and ${
      config.maxWords
    } words
   - Use ${config.description}
   - Write in simple, engaging language for ${level} level students
   - DO NOT exceed ${config.maxWords} words
   - DO NOT write less than ${config.minWords} words

Format your response as JSON with exactly these fields:
{
  "headline": "your headline here",
  "content": "your article content here (${config.paragraphs} paragraphs, ${
      config.minWords
    }-${config.maxWords} words)"
}`;

    try {
      const response = await api.post("/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional news writer specializing in creating educational content for elementary school students. You always follow word count requirements precisely.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: config.maxTokens, // 토큰 수 제한 추가
      });

      // OpenAI Chat Completions 응답 형식 처리
      const content = response.data.choices?.[0]?.message?.content || "";

      if (!content) {
        throw new Error("Empty response from API");
      }

      // JSON 응답 파싱 시도
      try {
        const parsed = JSON.parse(content);
        const articleContent = parsed.content || content;
        const wordCount = articleContent.split(/\s+/).length;

        // 길이 검증 및 필요시 재요청
        if (wordCount < config.minWords || wordCount > config.maxWords) {
          console.warn(
            `Article word count (${wordCount}) is outside target range (${config.minWords}-${config.maxWords}). Consider regenerating.`
          );
        }

        return {
          headline: parsed.headline || "News Headline",
          content: articleContent.trim(),
        };
      } catch {
        // JSON이 아닌 경우 텍스트를 그대로 사용
        const lines = content.split("\n");
        const headline = lines[0] || "News Headline";
        const articleContent = lines.slice(1).join("\n") || content;
        const wordCount = articleContent.split(/\s+/).length;

        console.warn(
          `Article word count (${wordCount}) - target: ${config.minWords}-${config.maxWords} words`
        );

        return {
          headline: headline.replace(/^#+\s*/, "").trim(),
          content: articleContent.trim(),
        };
      }
    } catch (apiError) {
      // API 호출 실패 시 상세한 에러 로깅
      console.error("API call failed:", apiError);
      console.error("Error details:", {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status,
      });
      throw apiError; // 에러를 다시 throw하여 Step2Page에서 처리하도록
    }
  },

  // AI 이미지 생성 - DALL-E 3 사용
  generateImages: async (data) => {
    const { article, level } = data;

    // 이미지 생성을 위한 프롬프트 구성 (최적화: 더 짧고 간결하게)
    const basePrompt = `Child-friendly colorful illustration for elementary news: ${article.headline}`;

    // 두 이미지를 병렬로 동시 생성 (시간 단축)
    const prompt1 = `${basePrompt}. Main scene.`;
    const prompt2 = `${basePrompt}. Different moment or perspective.`;

    // Promise.all을 사용하여 두 이미지를 동시에 생성
    const [response1, response2] = await Promise.all([
      api.post("/images/generations", {
        model: "dall-e-3",
        prompt: prompt1,
        n: 1,
        size: "1792x1024", // Landscape 비율
        quality: "standard", // "hd"보다 빠름
      }),
      api.post("/images/generations", {
        model: "dall-e-3",
        prompt: prompt2,
        n: 1,
        size: "1792x1024", // Landscape 비율
        quality: "standard",
      }),
    ]);

    // 이미지 URL 추출도 병렬 처리
    const imagePromises = [];
    if (response1.data?.data?.[0]?.url) {
      imagePromises.push(convertImageToBase64(response1.data.data[0].url));
    } else {
      imagePromises.push(Promise.resolve(null));
    }

    if (response2.data?.data?.[0]?.url) {
      imagePromises.push(convertImageToBase64(response2.data.data[0].url));
    } else {
      imagePromises.push(Promise.resolve(null));
    }

    const [image1, image2] = await Promise.all(imagePromises);

    const images = [];
    if (image1) images.push(image1);
    if (image2) images.push(image2);

    return { images };
  },

  // 이미지 생성 (점진적 로딩용 - 첫 번째 이미지만 먼저 생성)
  generateFirstImage: async (data) => {
    const { article, level } = data;

    // 최적화된 짧은 프롬프트
    const prompt = `Child-friendly colorful illustration for elementary news: ${article.headline}. Main scene.`;

    const response = await api.post("/images/generations", {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1792x1024", // Landscape 비율
      quality: "standard",
    });

    if (response.data?.data?.[0]?.url) {
      const imageUrl = await convertImageToBase64(response.data.data[0].url);
      return { image: imageUrl };
    }

    throw new Error("No image URL in response");
  },
};

// Category와 Event Summary는 Backend API가 없으므로 로컬 데이터 사용
export const localData = {
  // Level별 Category 목록
  categories: {
    Beginner: [
      "Sports",
      "Science",
      "History",
      "Art",
      "Nature",
      "Technology",
      "Animals",
      "Space",
    ],
    Intermediate: [
      "Sports",
      "Science",
      "History",
      "Art",
      "Nature",
      "Technology",
      "Culture",
      "Environment",
    ],
    Advanced: [
      "Sports",
      "Science",
      "History",
      "Art",
      "Nature",
      "Technology",
      "Politics",
      "Economics",
    ],
  },

  // Level별 Category별 Event Summary 목록
  eventSummaries: {
    Beginner: {
      Sports: [
        "Fun Game",
        "Great Win",
        "Nice Play",
        "Happy Match",
        "Good Team",
      ],
      Science: [
        "Cool Discovery",
        "Fun Experiment",
        "New Finding",
        "Big News",
        "Amazing Fact",
      ],
      History: [
        "Old Story",
        "Past Event",
        "Long Ago",
        "Old Time",
        "History Day",
      ],
      Art: [
        "Beautiful Picture",
        "Nice Drawing",
        "Fun Art",
        "Colorful Work",
        "Creative Show",
      ],
      Nature: [
        "Pretty Flower",
        "Big Tree",
        "Cute Animal",
        "Beautiful Sky",
        "Nature Walk",
      ],
      Technology: [
        "New Phone",
        "Cool Robot",
        "Fun App",
        "Smart Device",
        "Tech News",
      ],
      Animals: [
        "Cute Pet",
        "Wild Animal",
        "Baby Animal",
        "Animal Friend",
        "Pet Story",
      ],
      Space: [
        "Big Star",
        "Moon Trip",
        "Space Ship",
        "Planet News",
        "Star Story",
      ],
    },
    Intermediate: {
      Sports: [
        "Exciting Match",
        "Amazing Victory",
        "Great Competition",
        "Wonderful Performance",
        "Memorable Game",
        "Outstanding Achievement",
        "Historic Moment",
      ],
      Science: [
        "Exciting Discovery",
        "Amazing Breakthrough",
        "Wonderful Experiment",
        "Great Innovation",
        "Important Research",
        "Special Finding",
        "Memorable Achievement",
      ],
      History: [
        "Important Event",
        "Historic Moment",
        "Memorable Day",
        "Significant Discovery",
        "Great Achievement",
        "Special Occasion",
        "Remarkable Story",
      ],
      Art: [
        "Beautiful Exhibition",
        "Amazing Performance",
        "Wonderful Creation",
        "Great Show",
        "Special Event",
        "Memorable Display",
        "Outstanding Work",
      ],
      Nature: [
        "Amazing Discovery",
        "Wonderful Sight",
        "Great Observation",
        "Special Moment",
        "Beautiful Scene",
        "Memorable Experience",
        "Remarkable Finding",
      ],
      Technology: [
        "Exciting Innovation",
        "Amazing Development",
        "Great Invention",
        "Important Breakthrough",
        "Special Creation",
        "Memorable Achievement",
        "Outstanding Progress",
      ],
      Culture: [
        "Beautiful Festival",
        "Amazing Celebration",
        "Wonderful Tradition",
        "Great Event",
        "Special Occasion",
        "Memorable Experience",
        "Remarkable Gathering",
      ],
      Environment: [
        "Important Discovery",
        "Amazing Finding",
        "Wonderful Observation",
        "Great Achievement",
        "Special Moment",
        "Memorable Event",
        "Remarkable Progress",
      ],
    },
    Advanced: {
      Sports: [
        "Championship Victory",
        "Record-Breaking Performance",
        "International Competition",
        "Professional Achievement",
        "Elite Tournament",
        "Prestigious Award",
        "Historic Championship",
        "World-Class Event",
      ],
      Science: [
        "Groundbreaking Discovery",
        "Revolutionary Breakthrough",
        "Advanced Research",
        "Innovative Technology",
        "Scientific Achievement",
        "Research Publication",
        "Academic Excellence",
        "Laboratory Success",
      ],
      History: [
        "Historical Significance",
        "Cultural Heritage",
        "Archaeological Discovery",
        "Historical Documentation",
        "Preservation Effort",
        "Historical Analysis",
        "Cultural Impact",
        "Historical Research",
      ],
      Art: [
        "Prestigious Exhibition",
        "Artistic Masterpiece",
        "Cultural Performance",
        "Artistic Innovation",
        "Gallery Opening",
        "Artistic Recognition",
        "Cultural Contribution",
        "Artistic Excellence",
      ],
      Nature: [
        "Environmental Research",
        "Conservation Effort",
        "Ecological Discovery",
        "Wildlife Protection",
        "Natural Phenomenon",
        "Environmental Impact",
        "Conservation Success",
        "Ecological Study",
      ],
      Technology: [
        "Technological Innovation",
        "Digital Transformation",
        "Advanced Development",
        "Tech Industry News",
        "Innovation Award",
        "Technology Breakthrough",
        "Digital Revolution",
        "Tech Advancement",
      ],
      Politics: [
        "Policy Decision",
        "Political Development",
        "Government Initiative",
        "Legislative Action",
        "Political Reform",
        "Policy Implementation",
        "Political Analysis",
        "Government Policy",
      ],
      Economics: [
        "Economic Growth",
        "Market Analysis",
        "Financial Development",
        "Economic Policy",
        "Business Expansion",
        "Economic Indicator",
        "Financial Market",
        "Economic Trend",
      ],
    },
  },
};

export default api;
