import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/solid";

const KidFriendlyDatePicker = ({ value, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const selectedDate = value ? new Date(value) : null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfWeek = getDay(monthStart);

  const handleDateSelect = (date) => {
    onChange({
      target: {
        name,
        value: format(date, "yyyy-MM-dd"),
      },
    });
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    const today = new Date();
    handleDateSelect(today);
    setCurrentMonth(today);
  };

  return (
    <div className="relative">
      {/* Date Input Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 text-lg border-2 border-kid-primary-light/30 rounded-xl bg-white/90 text-left focus:ring-2 focus:ring-kid-primary focus:border-kid-primary hover:border-kid-primary-light/50 transition-all flex items-center justify-between"
      >
        <span className={selectedDate ? "text-gray-900" : "text-gray-400"}>
          {selectedDate
            ? format(selectedDate, "MMMM dd, yyyy")
            : "Select a date"}
        </span>
        <div className="p-1 rounded-lg bg-kid-primary/10">
          <CalendarIcon className="w-6 h-6 text-kid-primary" />
        </div>
      </button>

      {/* Calendar Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Calendar */}
          <div className="absolute top-full left-0 mt-2 bg-gradient-card rounded-2xl shadow-2xl p-4 z-50 border-2 border-kid-primary-light/50 min-w-[320px] backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={handlePrevMonth}
                className="px-3 py-1.5 bg-kid-primary/20 hover:bg-kid-primary/30 rounded-lg text-kid-primary-dark font-bold text-base transition-all hover:scale-105 border border-kid-primary/30"
              >
                ←
              </button>
              <h3 className="text-lg font-bold text-kid-primary-dark">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button
                onClick={handleNextMonth}
                className="px-3 py-1.5 bg-kid-primary/20 hover:bg-kid-primary/30 rounded-lg text-kid-primary-dark font-bold text-base transition-all hover:scale-105 border border-kid-primary/30"
              >
                →
              </button>
            </div>

            {/* Today Button */}
            <button
              onClick={handleToday}
              className="w-full mb-3 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-bold text-sm transition-all hover:scale-105 shadow-kid flex items-center justify-center gap-2"
            >
              <MapPinIcon className="w-4 h-4" />
              <span>Today</span>
            </button>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center font-bold text-kid-primary-dark text-xs py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty cells for days before month start */}
              {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="h-9"></div>
              ))}

              {/* Days of the month */}
              {daysInMonth.map((day) => {
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toString()}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`h-9 rounded-lg font-bold text-sm transition-all ${
                      isSelected
                        ? "bg-gradient-button text-white shadow-kid transform scale-110"
                        : isToday
                        ? "bg-kid-accent/30 text-kid-accent border-2 border-kid-accent"
                        : "bg-kid-primary-light/10 hover:bg-kid-primary-light/20 text-kid-primary-dark hover:scale-105"
                    }`}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-3 px-3 py-2 text-white rounded-lg font-bold text-sm transition-all hover:scale-105 shadow-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
                boxShadow:
                  "0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)";
              }}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default KidFriendlyDatePicker;
