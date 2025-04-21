import { useState } from 'react';

export default function TeamTestPage() {
  const [form, setForm] = useState({
    teamId: 1,
    teamName: '알고리즘',
    teamTier: 'Gold',
    member: 4,
    dueDate: '2025-04-20',
    teamDescription: '팀 설명입니다.',
    userId: 'user123',
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
      if (type === 'createTeam') {
        const res = await fetch('/team', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            teamName: form.teamName,
            teamTier: form.teamTier,
            member: parseInt(form.member),
            dueDate: form.dueDate,
            teamDescription: form.teamDescription,
          }),
        });
        const data = await res.json();
        updateResult('createTeam', { status: res.status, ...data });
      }
      if (type === 'joinTeam') {
        const res = await fetch('/team/join', {
          method: 'POST',
          headers,
          body: JSON.stringify({ teamId: form.teamId, userId: form.userId }),
        });
        const data = await res.json();
        updateResult('joinTeam', { status: res.status, ...data });
      }
      if (type === 'teamList') {
        const res = await fetch('/team/list/Silver');
        const data = await res.json();
        updateResult('teamList', { status: res.status, data });
      }
      if (type === 'teamMembers') {
        const res = await fetch(`/team/${form.teamId}/member`);
        const data = await res.json();
        updateResult('teamMembers', { status: res.status, data });
      }
      if (type === 'teamInfo') {
        const res = await fetch(`/team/${form.teamId}`);
        const data = await res.json();
        updateResult('teamInfo', { status: res.status, data });
      }
    } catch (err) {
      updateResult(type, { status: 'error', message: err.message });
    }
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

  return (
    <div className='p-6 font-mono'>
      <h2 className='text-xl font-bold text-base1 mb-4'>
        👥 팀 관련 API 테스트
      </h2>

      <Section title='팀 생성 테스트' id='createTeam'>
        <Input name='teamName' placeholder='팀 이름' />
        <Input name='teamTier' placeholder='팀 티어' />
        <Input name='member' placeholder='팀원 수' type='number' />
        <Input name='dueDate' placeholder='마감일 (YYYY-MM-DD)' />
        <Input name='teamDescription' placeholder='팀 설명' />
        <button
          onClick={() => runTest('createTeam')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          팀 생성
        </button>
      </Section>

      <Section title='팀 참가 테스트' id='joinTeam'>
        <Input name='teamId' placeholder='팀 ID' type='number' />
        <Input name='userId' placeholder='유저 ID' />
        <button
          onClick={() => runTest('joinTeam')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          팀 참가
        </button>
      </Section>

      <Section title='팀 리스트 조회' id='teamList'>
        <button
          onClick={() => runTest('teamList')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          리스트 조회
        </button>
      </Section>

      <Section title='팀 멤버 조회' id='teamMembers'>
        <Input name='teamId' placeholder='팀 ID' type='number' />
        <button
          onClick={() => runTest('teamMembers')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          팀원 조회
        </button>
      </Section>

      <Section title='팀 정보 조회' id='teamInfo'>
        <Input name='teamId' placeholder='팀 ID' type='number' />
        <button
          onClick={() => runTest('teamInfo')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          팀 정보 조회
        </button>
      </Section>
    </div>
  );
}
