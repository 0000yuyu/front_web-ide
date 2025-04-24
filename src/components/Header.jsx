import { userDataStore } from '@/store/userDataStore';
import { isLoggedIn } from '@/utils/auth';
import { logout } from '@/utils/userManage';
import React, { useState } from 'react';
import { PiMedalMilitaryDuotone } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { LuMenu } from 'react-icons/lu';
import SideBar from './SideBar';
import Modal from './Modal';

export default function Header() {
  const isLogged = isLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);
  const { userid, nickname, tier, email, resetUserProfile } = userDataStore();

  return (
    <div>
      <header
        className='bg-base3 text-black px-6 
      py-4 flex justify-between items-center'
      >
        <div className='flex items-center gap-3 text-xl'>
          <LuMenu
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          />
          <Link to={'/'} className='text-xl font-bold'>
            AlgoMento
          </Link>
        </div>

        {isLogged ? (
          <div className='flex gap-3 items-center'>
            <button
              onClick={() => {
                logout();
                resetUserProfile();
                window.location.href = '/';
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
      {menuOpen && <SideBar />}
    </div>
  );
}
