
import React, { useState, useEffect, useCallback } from 'react';
import { Schedule, UserSession } from './types';
import * as storageService from './services/storageService';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import EventForm from './components/EventForm';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>({ code: '', isAuthenticated: false });
  const [userCodeInput, setUserCodeInput] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Load schedules when authenticated
  useEffect(() => {
    if (session.isAuthenticated) {
      const loaded = storageService.loadSchedules(session.code);
      setSchedules(loaded);
    }
  }, [session.isAuthenticated, session.code]);

  // Save schedules when they change
  useEffect(() => {
    if (session.isAuthenticated) {
      storageService.saveSchedules(session.code, schedules);
    }
  }, [schedules, session.isAuthenticated, session.code]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userCodeInput.trim()) {
      setSession({ code: userCodeInput.trim(), isAuthenticated: true });
    }
  };

  const handleLogout = () => {
    setSession({ code: '', isAuthenticated: false });
    setUserCodeInput('');
    setSchedules([]);
  };

  // Fix: Update type to exclude 'date' as it is added from state inside the function
  const addSchedule = (data: Omit<Schedule, 'id' | 'createdAt' | 'date'>) => {
    const newSchedule: Schedule = {
      ...data,
      date: selectedDate,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setSchedules((prev) => [...prev, newSchedule].sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const selectedDaySchedules = schedules.filter((s) => s.date === selectedDate);

  if (!session.isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-white/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">캘린더 매니저</h1>
            <p className="text-gray-500">코드 번호를 입력하여 본인의 일정에 접속하세요.</p>
            <p className="text-xs text-blue-500 mt-2 font-bold italic">개발자: 가치있는 미래교육 연구소 대표 김병찬</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">접속 코드</label>
              <input
                type="text"
                placeholder="코드 번호를 입력하세요"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-center text-xl font-mono tracking-widest"
                value={userCodeInput}
                onChange={(e) => setUserCodeInput(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98]"
            >
              일정 확인하기
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            © 가치있는 미래교육 연구소. All Rights Reserved.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Calendar */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">접속 코드: {session.code}</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700 font-semibold underline underline-offset-4"
              >
                로그아웃
              </button>
            </div>
          </div>

          <CalendarView 
            schedules={schedules}
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Right Column: Event List & Form */}
        <div className="lg:col-span-4 space-y-8">
          <EventForm onAdd={addSchedule} selectedDate={selectedDate} />

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
              <h3 className="font-bold">{selectedDate} 일정 목록</h3>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{selectedDaySchedules.length}건</span>
            </div>
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {selectedDaySchedules.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400 italic">등록된 일정이 없습니다.</p>
                </div>
              ) : (
                selectedDaySchedules.map((schedule) => (
                  <div key={schedule.id} className="group border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg relative hover:shadow-md transition-shadow">
                    <button 
                      onClick={() => deleteSchedule(schedule.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-2 text-blue-700 font-bold mb-1">
                       <span className="text-xs px-2 py-0.5 bg-blue-200 rounded-full">{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-2">{schedule.title}</h4>
                    {schedule.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {schedule.location}
                      </div>
                    )}
                    {schedule.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 italic">{schedule.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Branding */}
      <footer className="mt-12 text-center text-gray-400 pb-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-32 bg-gray-200 mb-2"></div>
          <p className="font-medium text-gray-500">가치있는 미래교육 연구소</p>
          <p className="text-xs uppercase tracking-widest">Educational Excellence & Future Vision</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
