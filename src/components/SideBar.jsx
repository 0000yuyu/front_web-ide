import React from 'react';
import { Link } from 'react-router-dom';
import { PiMedalMilitaryDuotone } from 'react-icons/pi';
import { userDataStore } from '@/store/userDataStore';

const color = (tier) => {
  if (tier.includes('BRONZE')) return 'bg-black text-orange-800';
  if (tier.includes('SILVER')) return 'text-slate-800';
  if (tier.includes('GOLD')) return 'text-yellow-600';
  else return 'text-error';
};

export default function SideBar() {
  const { nickname, tier } = userDataStore();
  return (
    <div className='flex p-3 absolute w-full z-10 shadow-md bg-white gap-2 justify-between'>
      <div className='flex gap-2 items-center'>
        <Link to='teams' className='hover:underline hover:text-base3'>
          그룹
        </Link>
        <Link to='/' className='hover:underline hover:text-base3'>
          내 팀
        </Link>
      </div>

      <div className='flex items-center gap-3'>
        <span className={`flex items-center ${color(tier)}`}>
          <PiMedalMilitaryDuotone size={30} />
          <div>{tier}</div>
        </span>
        <span>{nickname}</span>
      </div>
    </div>
  );
}
