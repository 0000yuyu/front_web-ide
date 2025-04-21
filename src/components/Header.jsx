import { userDataStore } from '@/store/userDataStore';
import { isLoggedIn } from '@/utils/auth';
import { logout } from '@/utils/userManage';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const isLogged = isLoggedIn();
  const { userid, nickname, tier, email } = userDataStore();

  return (
    <div>
      <header className='bg-[#A9B5DF] text-black px-6 py-4 flex justify-between items-center rounded-b-lg'>
        <Link to={'/'} className='text-2xl font-bold'>
          AlgoMento
        </Link>
        {isLogged ? (
          <div className='flex gap-3'>
            <span className='border rounded-[50%]'>{tier}</span>
            <span>{nickname}</span>

            <button
              onClick={() => {
                logout();
                window.location.reload('/');
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className='flex flex-row gap-2 text-xs tracking-tight text-center'>
            <Link to='login' className='text-sm underline'>
              로그인
            </Link>
            <Link to='membership' className='text-sm underline'>
              회원가입
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}
