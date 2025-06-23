// This component objective is that give user option to select tabs for the show of movie
// which is the current show or the upcoming show 




import React, { useState } from "react";
import SearchBar from "./SearchBar";

type CalendarDay = {
  number: number;
  day: string;
  month: string;
};

interface ScheduleHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeTab: "now" | "upcoming";
  setActiveTab: React.Dispatch<React.SetStateAction<"now" | "upcoming">>;
}

export default function ScheduleHeader({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
}: ScheduleHeaderProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getNext6Days = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      days.push({
        day: i === 0 ? "Today" : weekDays[date.getDay()],
        number: date.getDate(),
        month: months[date.getMonth()],
      });
    }
    return days;
  };

  const getUpcomingMonths = (): string[] => {
    const monthsList: string[] = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() + i);
      monthsList.push(date.toLocaleDateString("en-US", { month: "long" }));
    }
    return monthsList;
  };

  const handleTabChange = (tab: "now" | "upcoming") => {
    setActiveTab(tab);
    setSelectedIndex(0);
  };

  return (
    <div className="mt-8 mb-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">

      {/* The left side that give users option to select Now Showing or Upcoming tab */}

      <div className="w-full lg:w-[70%]">
        <div className="flex gap-6 text-xl font-bold mb-4 flex-wrap">

          <button onClick={() => handleTabChange("now")} className={`transition-colors ${
              activeTab === "now" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
          >
            Now Showing
          </button>

          <span className="text-gray-500">|</span>

          <button onClick={() => handleTabChange("upcoming")} className={`transition-colors ${
              activeTab === "upcoming" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
          >
            Upcoming
          </button>
        </div>

        {/* The opeartion behind these taps  */}

        <div className="flex flex-wrap gap-3 justify-start">
          {/* It filters to show the tab of current shows */}
          {activeTab === "now" ? getNext6Days().map((c, idx) => 
            (
              <div key={idx} onClick={() => setSelectedIndex(idx)}
                className={`cursor-pointer flex flex-col items-center rounded border-2 ${
                  idx === selectedIndex ? "border-red-500" : "border-gray-700"} 
                  px-1 py-1 w-15 sm:w-16 md:w-20 lg:w-24 xl:w-28 min-w-[60px]`}
              >
                <p className="font-semibold text-[9px] sm:text-[10px] md:text-xs lg:text-sm xl:text-base">{c.day}</p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">{c.number}</p>
                <p className="text-gray-400 text-[8px] sm:text-[9px] md:text-xs">{c.month}</p>
              </div>
            ))
            // It filters to show upcoming show tabs
            : getUpcomingMonths().map((month, idx) => (
                <div key={idx} onClick={() => setSelectedIndex(idx)}
                  className={`cursor-pointer flex flex-col items-center rounded border-2 ${
                    idx === selectedIndex ? "border-red-500" : "border-gray-700"}
                    px-2 py-2 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 min-w-[64px]`}>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-center leading-tight">{month}</p>
                </div>
              ))}
        </div>
      </div>
      {/* Right Side: Search Bar */}
      <div className="w-full lg:w-[30%] flex justify-center lg:justify-end">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </div>
  );
}
