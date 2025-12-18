import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  FolderIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  SparklesIcon,
  ClockIcon,
  RocketLaunchIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import useActivityStore from "../stores/activityStore";
import { localData } from "../utils/api";
import KidFriendlyDatePicker from "../components/KidFriendlyDatePicker";

const Step1Page = () => {
  const navigate = useNavigate();
  const { level, step1Data, setStep1Data, resetStep1Data } = useActivityStore();
  const [categories, setCategories] = useState([]);
  const [eventSummaries, setEventSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: step1Data.category,
      date: format(step1Data.date, "yyyy-MM-dd"),
      who: step1Data.who,
      where: step1Data.where,
      eventSummary: step1Data.eventSummary,
      extra: step1Data.extra,
    },
  });

  const selectedCategory = watch("category");
  const formData = watch();

  // 페이지 진입 시 Step1Data 초기화 및 폼 리셋
  useEffect(() => {
    resetStep1Data();
    reset({
      category: "",
      date: format(new Date(), "yyyy-MM-dd"),
      who: "",
      where: "",
      eventSummary: "",
      extra: "",
    });
  }, [resetStep1Data, reset]);

  // Level별 Category 목록 로드
  useEffect(() => {
    if (level) {
      const categoriesForLevel = localData.categories[level] || [];
      setCategories(categoriesForLevel);
    }
  }, [level]);

  // Category 선택 시 Event Summary 목록 로드 (Level별로 다름)
  useEffect(() => {
    if (!selectedCategory || !level) {
      setEventSummaries([]);
      return;
    }
    const summariesForCategory =
      localData.eventSummaries[level]?.[selectedCategory] || [];
    setEventSummaries(summariesForCategory);
  }, [selectedCategory, level]);

  const validateForm = () => {
    const missing = [];

    if (!formData.category || formData.category === "") {
      missing.push("Category");
    }
    if (!formData.eventSummary || formData.eventSummary === "") {
      missing.push("Event Summary");
    }
    if (!formData.date || formData.date === "") {
      missing.push("Date");
    }
    if (!formData.who || formData.who.trim() === "") {
      missing.push("Who");
    }
    if (!formData.where || formData.where.trim() === "") {
      missing.push("Where");
    }

    return missing;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const missing = validateForm();

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowModal(true);
      return;
    }

    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      setStep1Data({
        category: data.category,
        date: new Date(data.date),
        who: data.who,
        where: data.where,
        eventSummary: data.eventSummary,
        extra: data.extra,
      });
      navigate("/step2");
    } catch (error) {
      console.error("Failed to save data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-kid bg-pattern-stars py-8 px-4 overflow-hidden relative">
      <div className="max-w-4xl mx-auto h-full flex flex-col relative z-10">
        {/* Header with title and level button */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-xl font-bold text-kid-text">
            Step 1. Enter the details for your article.
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

        {/* Form Container */}
        <div className="bg-gradient-card rounded-3xl shadow-2xl p-6 flex-1 overflow-y-auto min-h-0 border-2 border-white/50 backdrop-blur-sm">
          <form
            onSubmit={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="space-y-4"
          >
            {/* Category and Event Summary - Same Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-base font-semibold text-kid-text mb-1.5">
                  <div className="p-1.5 rounded-lg bg-kid-primary/10">
                    <FolderIcon className="w-7 h-7 text-kid-primary" />
                  </div>
                  Category *
                </label>
                <select
                  {...register("category", { required: true })}
                  className={`w-full px-4 py-2.5 text-base border-2 border-kid-primary-light/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-kid-primary focus:border-kid-primary transition-all hover:border-kid-primary-light/50 ${
                    !watch("category") ? "select-placeholder" : "text-kid-text"
                  }`}
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Summary */}
              <div>
                <label className="flex items-center gap-2 text-base font-semibold text-kid-text mb-1.5">
                  <div className="p-1.5 rounded-lg bg-kid-primary/10">
                    <DocumentTextIcon className="w-7 h-7 text-kid-primary" />
                  </div>
                  Event Summary *
                </label>
                <select
                  {...register("eventSummary", { required: true })}
                  disabled={!selectedCategory}
                  className={`w-full px-4 py-2.5 text-base border-2 border-kid-primary-light/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-kid-primary focus:border-kid-primary transition-all hover:border-kid-primary-light/50 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    !watch("eventSummary")
                      ? "select-placeholder"
                      : "text-kid-text"
                  }`}
                >
                  <option value="">
                    {selectedCategory
                      ? "Please select"
                      : "Please select a category first"}
                  </option>
                  {eventSummaries.map((summary) => (
                    <option key={summary} value={summary}>
                      {summary}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Who - Same Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-base font-semibold text-kid-text mb-1.5">
                  <div className="p-1.5 rounded-lg bg-kid-primary/10">
                    <CalendarIcon className="w-7 h-7 text-kid-primary" />
                  </div>
                  Date *
                </label>
                <KidFriendlyDatePicker
                  value={watch("date")}
                  onChange={(e) => {
                    setValue("date", e.target.value, { shouldValidate: true });
                  }}
                  name="date"
                />
              </div>

              {/* Who */}
              <div>
                <label className="flex items-center gap-2 text-base font-semibold text-kid-text mb-1.5">
                  <div className="p-1.5 rounded-lg bg-kid-primary/10">
                    <UserGroupIcon className="w-7 h-7 text-kid-primary" />
                  </div>
                  Who *
                </label>
                <input
                  type="text"
                  {...register("who", { required: true })}
                  placeholder="e.g. John, my friend, school students"
                  className="w-full px-4 py-3 text-lg border-2 border-kid-primary-light/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-kid-primary focus:border-kid-primary transition-all hover:border-kid-primary-light/50"
                />
              </div>
            </div>

            {/* Where */}
            <div>
              <label className="flex items-center gap-2 text-base font-semibold text-kid-text mb-1.5">
                <div className="p-1.5 rounded-lg bg-kid-primary/10">
                  <MapPinIcon className="w-7 h-7 text-kid-primary" />
                </div>
                Where *
              </label>
              <input
                type="text"
                {...register("where", { required: true })}
                placeholder="e.g. at home, in the park, in Seoul"
                className="w-full px-4 py-3 text-lg border-2 border-kid-primary-light/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-kid-primary focus:border-kid-primary transition-all hover:border-kid-primary-light/50"
              />
            </div>

            {/* Extra (Optional) */}
            <div>
              <label className="flex items-center gap-2 text-base font-semibold text-kid-text mb-1.5">
                <div className="p-1.5 rounded-lg bg-kid-primary/10">
                  <SparklesIcon className="w-7 h-7 text-kid-primary" />
                </div>
                Extra (Optional)
              </label>
              <textarea
                {...register("extra")}
                placeholder="Add any extra details (optional)."
                rows="3"
                className="w-full px-4 py-2.5 text-lg border-2 border-kid-primary-light/30 rounded-xl bg-white/90 focus:ring-2 focus:ring-kid-primary focus:border-kid-primary transition-all hover:border-kid-primary-light/50 resize-none"
              />
            </div>

            <div className="mt-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={loading}
                className="w-full px-6 py-4 text-base font-bold bg-gradient-button text-white rounded-2xl hover:bg-gradient-button-hover transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-kid hover:shadow-kid-hover flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="p-1.5 rounded-lg bg-white/20">
                      <ClockIcon className="w-7 h-7 animate-bounce" />
                    </div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <div className="p-1.5 rounded-lg bg-white/20">
                      <RocketLaunchIcon className="w-7 h-7" />
                    </div>
                    <span>Generate Article & Images</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Validation Error Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-card rounded-3xl shadow-2xl p-6 max-w-md w-full border-2 border-kid-primary-light/50 relative animate-scale-in">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-kid-primary-light/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-kid-primary-dark" />
              </button>

              {/* Modal Content */}
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-orange-100">
                    <ExclamationCircleIcon className="w-12 h-12 text-orange-500" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-kid-text mb-3">
                  Oops! Something's Missing! 😊
                </h3>

                <p className="text-base text-kid-text-light mb-4">
                  Please fill in all the required fields before continuing:
                </p>

                <div className="bg-kid-primary-light/10 rounded-xl p-4 mb-6">
                  <ul className="text-left space-y-2">
                    {missingFields.map((field, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-kid-text font-medium"
                      >
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-6 py-3 bg-gradient-button text-white rounded-xl font-bold text-base hover:bg-gradient-button-hover transition-all hover:scale-105 shadow-kid"
                >
                  Got it! Let me fill them in
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Step1Page;
