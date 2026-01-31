
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-6 px-4 mb-8 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-blue-800 tracking-tight">
            스마트 일정 관리 시스템
          </h1>
          <p className="text-gray-500 text-sm mt-1">가치있는 미래교육 연구소 캘린더 서비스</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 px-6 py-3 rounded-full shadow-inner animate-pulse md:animate-none">
          <span className="text-blue-900 font-bold whitespace-nowrap">
            개발자: 가치있는 미래교육 연구소 대표 김병찬
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
