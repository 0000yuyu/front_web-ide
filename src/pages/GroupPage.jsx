import React, { useEffect, useState } from 'react';
import { useModalStore } from './TeamStore';
import { createGroup, getGroupList } from '@/utils/groupManage';
import { userDataStore } from '@/store/userDataStore';

export default function GroupPage() {
  const { isOpen, toggle } = useModalStore();
  const { tier } = userDataStore();

  const [form, setForm] = useState({
    teamId: 1,
    teamName: '알고리즘',
    teamTier: 'Silver',
    member: 4,
    dueDate: '2025-04-20',
    teamDescription: '팀 설명입니다.',
    userId: 'user123',
  });
  const [results, setResults] = useState({});
  const [teams, setTeams] = useState([]);

  // 티어가 바뀔 때마다 그룹 리스트 가져오기

  useEffect(() => {
    fetchGroupList();
    console.log('실행 왜 안돼');
  }, [tier]);

  async function fetchGroupList() {
    try {
      const array = await getGroupList(tier);
      setTeams(array);
      console.log(array);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleCreateTeam(event) {
    event.preventDefault();
    try {
      const success = await createGroup(form);
      if (success) await fetchGroupList();
      else throw new Error('팀 생성 실패');
      toggle();
    } catch (error) {
      alert(error.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearResult = (key) => {
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const Section = ({ title, id, children }) => (
    <div className='mb-6 p-4 border border-transparent3 rounded-lg bg-transparent2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-base1 font-semibold'>{title}</h3>
        <button onClick={() => clearResult(id)} className='text-error text-sm'>
          결과 삭제
        </button>
      </div>
      <div>{children}</div>
      {results[id] && (
        <div
          className={`mt-3 p-3 text-sm rounded-lg ${
            results[id].status === 200
              ? 'bg-base3 text-white'
              : 'bg-error2 text-error'
          }`}
        >
          <pre>{JSON.stringify(results[id], null, 2)}</pre>
        </div>
      )}
    </div>
  );

  const Input = ({ name, placeholder, type = 'text' }) => (
    <input
      className='block w-full px-3 py-2 mb-2 border border-transparent3 rounded bg-white text-transparent3'
      name={name}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
      type={type}
    />
  );

  ///

  function Modal() {
    const { isOpen, toggle } = useModalStore();
    if (!isOpen) return null;

    return (
      <div
        className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
        onClick={toggle}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <Section title='팀 생성 테스트' id='createTeam'>
            팀이름: <Input name='teamName' placeholder='팀 이름' />
            팀 티어: <Input name='teamTier' placeholder='팀 티어' />
            팀원 수: <Input name='member' placeholder='팀원 수' type='number' />
            마감일: <Input name='dueDate' placeholder='마감일 (YYYY-MM-DD)' />
            팀 설명: <Input name='teamDescription' placeholder='팀 설명' />
            <button
              className='bg-base1 text-white px-4 py-1 rounded'
              onClick={handleCreateTeam}
            >
              팀 생성
            </button>
          </Section>
        </div>
      </div>
    );
  }

  function TeamList({ teams }) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-4'>
        {teams.map((team, index) => (
          <div
            key={index}
            className='rounded-xl shadow-md bg-white p-4 flex flex-col justify-between'
          >
            <h3 className='text-lg font-semibold mb-2'>{team.teamName}</h3>
            <p className='text-sm mb-1'>문제 수 : {team.teamQuest ?? 0}개</p>
            <p className='text-sm mb-1'>
              인원 : {team.current_member_count}/{team.maxMember}
            </p>
            <p className='text-sm mb-3'>등급: {team.tier}</p>
            <p className=''>{teams.dueDate}</p>

            {team.members >= 10 ? (
              <button
                className='bg-gray-300 text-white py-1 px-4 rounded cursor-not-allowed'
                disabled
              >
                참여
              </button>
            ) : (
              <button className='bg-[#1f2667] text-white py-1 px-4 rounded hover:bg-[#1f2667]/90'>
                참여
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className='flex items-start justify-stretch bg-oklch(98.5% 0 0)'>
        <nav className='mt-24 h-30 w-12 bg-gray-800 text-white'>
          <div className='flex flex-col text-xs tracking-tight text-center'>
            <a href='#' className='hover:bg-gray-700 px-3 py-2 rounded'>
              홈
            </a>
            <a href='#' className='hover:bg-gray-700 px-3 py-2 rounded'>
              그룹
            </a>
          </div>
        </nav>
        <div className='flex-1 p-6 pt-0 min-h-screen justify-items-stretch'>
          <div>
            <button
              onClick={toggle}
              className='bg-[#2D336B] text-white px-3 py-1 rounded text-sm'
            >
              팀 생성
            </button>

            {isOpen && <Modal />}
            <TeamList teams={teams} />
          </div>
        </div>
        <div className='' />
      </div>
    </>
  );
}
