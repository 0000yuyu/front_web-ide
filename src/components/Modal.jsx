import React from 'react';
import { IoClose } from 'react-icons/io5';

export default function Modal({ modal_title, children }) {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      {/* 어두운 배경 */}
      <div className='absolute inset-0 bg-black opacity-60'></div>

      {/* 모달 내용 */}
      <div
        className='relative min-w-[500px] min-h-[500px] bg-white p-6 
      rounded-md shadow-lg z-10'
      >
        <div className='text-2xl flex justify-between items-center p-2 pb-4 border-b'>
          <div>{modal_title}title</div>
          <IoClose className='50' />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
