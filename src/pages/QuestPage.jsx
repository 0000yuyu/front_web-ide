import React, { useState } from "react";
import QuestTestPage from './QuestTestPage';


export default function Page() {
  
  const DivSection = ({ children }) => (
      <div>
        {React.Children.map(children, (child, i) => (
            <div key={i} className="mb-2 p-2 rounded-lg border border-gray-500">
            {child}
          </div>
        ))}
      </div>
    )
  /////

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
        { id: 3, name: '김구름', isPaused: false }
      ])
  // 체크박스 상태 변경 핸들러
      const handleToggle = (id, checked) => {
        setFormStates((prev) =>
          prev.map((form) =>
            form.id === id ? { ...form, isPaused: checked } : form
          )
        )
      }
  // 합산
      const totalScore = formStates.filter((form) => form.isPaused).length
    


  return (
    <div className="p-2">
      <DivSection>
        <div>Header</div>
        <div>
        <>백준 1001번</>
          <a>문제 상세</a>
          <Section title='문제 상세 조회' id='questDetail'>
        <Input name='teamId' placeholder='팀 ID' type='number' />
        <Input name='questId' placeholder='문제 ID' type='number' />
        <Input name='questName' placeholder='문제 이름'/>
        <Input name='questStart' placeholder='시작일 (YYYY-MM-DD)'/>
        <Input name='questDue' placeholder='마감일 (YYYY-MM-DD)'/>
        <Input name='questLink' placeholder='문제 링크'/>
        <button
          onClick={() => runTest('questDetail')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          문제 상세
        </button>
      </Section>
        </div>
        <div>
            <>제출인원: {totalScore} / {formStates.length}</>
            <>
            {formStates.map((form) => (
  <label key={form.id} style={{display:"block"}}>
    <input
      style={{ display: "inline", margin: "8px"}}
      type="checkbox"
      checked={form.isPaused}
      onChange={(e) => handleToggle(form.id, e.target.checked)}
    />
    {form.isPaused ? `${form.name}` : `${form.name}`}
  </label>
))}
        </>
        </div>
        <div>
          footer
        </div>
      </DivSection>
      </div>
  );
};

