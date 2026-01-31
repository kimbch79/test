
import React from 'react';
import { Schedule } from '../types';

interface CalendarViewProps {
  schedules: Schedule[];
  currentDate: Date;
  onSelectDate: (dateStr: string) => void;
  selectedDate: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ schedules, currentDate, onSelectDate, selectedDate }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  // Fill empty spaces
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const formatDay = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = formatDay(day);
    return schedules.filter((s) => s.date === dateStr);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 py-4 px-6">
        <h2 className="text-xl font-bold text-gray-800">
          {year}년 {month + 1}월
        </h2>
      </div>
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, idx) => (
          <div key={d} className={`py-3 text-center text-sm font-semibold border-r border-gray-100 last:border-0 ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-[100px] md:auto-rows-[120px]">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} className="border-r border-b border-gray-100 bg-gray-50"></div>;
          
          const dateStr = formatDay(day);
          const isSelected = selectedDate === dateStr;
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={`border-r border-b border-gray-100 p-1 cursor-pointer transition-colors hover:bg-blue-50 relative ${isSelected ? 'bg-blue-100' : ''}`}
            >
              <span className={`text-sm font-medium ${idx % 7 === 0 ? 'text-red-500' : idx % 7 === 6 ? 'text-blue-500' : 'text-gray-700'}`}>
                {day}
              </span>
              <div className="mt-1 space-y-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-blue-600 text-white text-[10px] px-1 py-0.5 rounded truncate shadow-sm">
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-gray-500 pl-1">+{dayEvents.length - 3} 더보기</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
