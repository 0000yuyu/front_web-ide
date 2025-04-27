import React from 'react';
import { IoClose } from 'react-icons/io5';

export default function Modal({ onClose, title = '', children }) {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      {/* 어두운 배경 */}
      <div className='absolute inset-0 bg-black opacity-30'></div>

      {/* 모달 박스 */}
      <div className='relative w-[400px] bg-white p-8 rounded-xl shadow-md z-10 flex flex-col items-center'>
        {/* 제목 + 닫기 버튼 */}
        <div className='w-full flex justify-between items-center mb-4'>
          <h2 className='text-lg font-bold'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* 구분선 */}
        <div className='w-full border-t border-gray-200 mb-6'></div>

        <div className='w-full flex flex-col justify-center gap-4'>
          {children}
        </div>
      </div>
    </div>
  );
}
