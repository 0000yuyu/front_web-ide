import React, { useState } from 'react';

export default function QuestPage() {
  const [form, setForm] = useState({
    teamId: 1,
    questId: 1,
    questName: '숨바꼭질3',
    questStart: '2025-04-01',
    questDue: '2025-04-03',
    questLink: 'https://example.com',
    userId: 'user123',
    questStatus: 'COMPLETED',
  });
  const [results, setResults] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateResult = (key, value) => {
    setResults((prev) => ({ ...prev, [key]: value }));
  };

  const clearResult = (key) => {
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const runTest = async (type) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (type === 'createQuest') {
        const res = await fetch('/quest', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            teamId: form.teamId,
            questName: form.questName,
            questStart: form.questStart,
            questDue: form.questDue,
            questLink: form.questLink,
          }),
        });
        const data = await res.json();
        updateResult('createQuest', { status: res.status, ...data });
      }
      if (type === 'questDetail') {
        const res = await fetch(`/quest/${form.teamId}/${form.questId}`);
        const data = await res.json();
        updateResult('questDetail', { status: res.status, ...data });
      }
      if (type === 'updateStatus') {
        const res = await fetch(
          `/code/${form.teamId}/${form.questId}/${form.userId}/status`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              teamId: form.teamId,
              questId: form.questId,
              userId: form.userId,
              questStatus: form.questStatus,
            }),
          }
        );
        const data = await res.json();
        updateResult('updateStatus', { status: res.status, ...data });
      }
    } catch (err) {
      updateResult(type, { status: 'error', message: err.message });
    }
  };

  const Section = ({ title, id, children }) => (
    <div className='mb-6 p-4 border border-gray1 rounded-lg bg-white'>
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

  //응시생
  const [formStates, setFormStates] = useState([
    { id: 1, name: '이지윤', isPaused: false },
    { id: 2, name: '송유진', isPaused: false },
    { id: 3, name: '김구름', isPaused: false },
  ]);
  // 체크박스 상태 변경 핸들러
  const handleToggle = (id, checked) => {
    setFormStates((prev) =>
      prev.map((form) =>
        form.id === id ? { ...form, isPaused: checked } : form
      )
    );
  };
  // 합산
  const totalScore = formStates.filter((form) => form.isPaused).length;

  return (
    <div>
      <div className='flex items-start justify-stretch bg-oklch(98.5% 0 0)'>
        <nav className='mt-10 h-30 w-12 bg-gray-800 text-white'>
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
            <div className='text-3xl font-bold mt-6 mb-4'>
              백준 {form.teamId}번
            </div>
            <div className='gap-4 rounded-2xl border border-gray-300 shadow-md w-full p-6'>
              <div className='flex items-center'>
                <span className='w-24 font-semibold text-gray-800'>시작일</span>
                <span className='ml-4 text-gray-700'>{form.questStart}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-24 font-semibold text-gray-800'>마감일</span>
                <span className='ml-4 text-gray-700'>{form.questDue}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-24 font-semibold text-gray-800'>생성자</span>
                <span className='ml-4 text-gray-700'>{form.userId}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-24 font-semibold text-gray-800'>상태</span>
                <span className='ml-4 text-gray-700'>{form.questStatus}</span>
              </div>
              <div className='flex items-center col-span-2'>
                <span className='w-24 font-semibold text-gray-800'>
                  이동하기
                </span>
                <input
                  type='text'
                  value={form.questLink}
                  readOnly
                  className='ml-4 border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 w-full max-w-xs'
                />
              </div>
              <button
                onClick={() => runTest('questDetail')}
                className='bg-base1 text-white px-4 py-1 rounded'
              >
                문제 상세
              </button>
            </div>
          </div>
          <div className='w-full max-w-full p-6'>
            <p className='text-lg font-semibold mb-4 border-b'>
              제출인원: {totalScore} / {formStates.length}
            </p>
            <div className='grid grid-cols-2 gap-3'>
              {formStates.map((form) => (
                <label
                  key={form.id}
                  className='flex items-center gap-2 px-3 py-2'
                >
                  <input
                    className={`w-5 h-5 rounded-md
                      ${
                        form.isPaused
                          ? 'bg-gray-900 accent-white'
                          : 'border border-gray-300 bg-white'
                      }
                    `}
                    type='checkbox'
                    checked={form.isPaused}
                    onChange={(e) => handleToggle(form.id, e.target.checked)}
                  />
                  <span
                    className={`w-full text-sm rounded-lg px-3 py-2 outline-none border 
          ${
            form.isPaused
              ? 'text-black border-gray-900'
              : 'text-gray-400 border-gray-300'
          } 
          bg-white`}
                  >
                    {form.isPaused ? `${form.name}` : `${form.name}`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className='w-7'></div>
      </div>
    </div>
  );
}
