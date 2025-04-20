// Calendar.jsx
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { ChevronLeftSvg, ChevronRightSvg } from "./Svgs";
import { range } from "../utils/array-utils";

const getCalendarDays = (now) => {
  const startOfMonth = now.startOf("month");
  const calendarDays = [];
  const firstWeekEndDate = 8 - startOfMonth.day();
  const firstWeek = [
    ...range(0, startOfMonth.day()).map(() => null),
    ...range(1, firstWeekEndDate),
  ];
  calendarDays.push(firstWeek);

  for (
    let weekStartDate = firstWeekEndDate;
    weekStartDate <= now.daysInMonth();
    weekStartDate += 7
  ) {
    calendarDays.push(
      range(weekStartDate, weekStartDate + 7).map((date) =>
        date <= now.daysInMonth() ? date : null
      )
    );
  }

  return calendarDays;
};

export const Calendar = ({ now, setNow, practicedDates = [] }) => {
  const formattedNowMonth = now.format("MMMM YYYY");
  const staticNow = dayjs();
  const calendarDays = getCalendarDays(now);

  // reset về tháng hiện tại khi mới mount
  useEffect(() => {
    setNow(dayjs());
  }, [setNow]);

  return (
    <article className="flex flex-col rounded-xl border-2 border-gray-300 p-3 text-gray-400">
      <header className="flex items-center justify-between gap-3">
        <button
          className="text-gray-400"
          onClick={() => setNow((d) => d.add(-1, "month"))}
        >
          <ChevronLeftSvg />
          <span className="sr-only">Previous month</span>
        </button>
        <h3 className="text-lg font-bold uppercase text-gray-500">
          {formattedNowMonth}
        </h3>
        <button
          className="text-gray-400"
          onClick={() => setNow((d) => d.add(1, "month"))}
        >
          <ChevronRightSvg />
          <span className="sr-only">Next month</span>
        </button>
      </header>

      <div className="flex justify-between px-3 py-2">
        {"SMTWTFS".split("").map((wd, i) => (
          <div key={i} className="flex h-9 w-9 items-center justify-center">
            {wd}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 px-3 py-2">
        {calendarDays.map((week, wi) => (
          <div key={wi} className="flex justify-between">
            {week.map((date, di) => {
              if (date === null) {
                return <div key={di} className="h-9 w-9" />;
              }

              const cellDate = now.date(date).format("YYYY-MM-DD");
              const isPracticed = practicedDates.includes(cellDate);
              const isToday =
                date === staticNow.date() &&
                now.month() === staticNow.month() &&
                now.year() === staticNow.year();

              let baseClasses =
                "flex h-9 w-9 items-center justify-center rounded-full";
              if (isPracticed) {
                baseClasses += " bg-yellow-400 text-white";
              } else if (isToday) {
                baseClasses += " bg-gray-300 text-gray-600";
              }

              return (
                <div key={di} className={baseClasses}>
                  {date}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </article>
  );
};
