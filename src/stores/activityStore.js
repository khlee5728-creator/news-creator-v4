import { create } from "zustand";

const useActivityStore = create((set) => ({
  // Level 선택
  level: null,
  setLevel: (level) => set({ level }),

  // Step1 데이터
  step1Data: {
    category: "",
    date: new Date(),
    who: "",
    where: "",
    eventSummary: "",
    extra: "",
  },
  setStep1Data: (data) =>
    set((state) => ({
      step1Data: { ...state.step1Data, ...data },
    })),

  // Step2 데이터
  step2Data: {
    article: {
      headline: "",
      content: "",
    },
    images: [],
    selectedImageIndex: null,
  },
  setStep2Data: (data) =>
    set((state) => ({
      step2Data: { ...state.step2Data, ...data },
    })),
  setSelectedImage: (index) =>
    set((state) => ({
      step2Data: { ...state.step2Data, selectedImageIndex: index },
    })),

  // Step1 데이터 초기화
  resetStep1Data: () =>
    set({
      step1Data: {
        category: "",
        date: new Date(),
        who: "",
        where: "",
        eventSummary: "",
        extra: "",
      },
    }),

  // Step2 데이터 초기화
  resetStep2Data: () =>
    set({
      step2Data: {
        article: {
          headline: "",
          content: "",
        },
        images: [],
        selectedImageIndex: null,
      },
    }),

  // 전체 초기화
  reset: () =>
    set({
      level: null,
      step1Data: {
        category: "",
        date: new Date(),
        who: "",
        where: "",
        eventSummary: "",
        extra: "",
      },
      step2Data: {
        article: {
          headline: "",
          content: "",
        },
        images: [],
        selectedImageIndex: null,
      },
    }),
}));

export default useActivityStore;
