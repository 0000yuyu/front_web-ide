import { useState } from 'react';

export default function UserTestPage() {
  const [userId, setUserId] = useState('user123');
  const [result, setResult] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/user/${userId}`);
      const data = await res.json();
      setResult({ type: 'success', data });
    } catch (err) {
      setResult({ type: 'error', message: err.message });
    }
  };

  const clear = () => setResult(null);

  return (
    <div className='p-6 font-mono'>
      <h2 className='text-xl font-bold text-base1 mb-4'>👤 유저 정보 조회</h2>
      <div className='mb-4 p-4 border border-transparent3 rounded-lg bg-transparent2'>
        <label className='block text-sm text-transparent3 mb-1'>유저 ID</label>
        <input
          className='block w-full mb-3 px-3 py-2 border rounded text-transparent3'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <div className='flex gap-2'>
          <button
            onClick={fetchUser}
            className='bg-base1 text-white px-4 py-1 rounded'
          >
            조회
          </button>
          <button onClick={clear} className='text-error text-sm'>
            결과 초기화
          </button>
        </div>
      </div>
      {result && (
        <div className='bg-white p-4 rounded-lg border border-transparent3'>
          <h3 className='font-semibold mb-2 text-base1'>조회 결과</h3>
          {result.type === 'success' ? (
            <ul className='text-sm text-transparent3 space-y-1'>
              <li>
                <strong>닉네임:</strong> {result.data.nickname}
              </li>
              <li>
                <strong>이메일:</strong> {result.data.email}
              </li>
              <li>
                <strong>티어:</strong> {result.data.tier}
              </li>
              <li>
                <strong>팀 ID:</strong> {result.data.teamId}
              </li>
            </ul>
          ) : (
            <p className='text-error'>❌ {result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
