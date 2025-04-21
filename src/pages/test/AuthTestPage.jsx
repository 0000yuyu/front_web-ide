import { useState } from 'react';

export default function AuthTestPage() {
  const [form, setForm] = useState({
    userId: 'user123',
    hashedPassword: 'abc123',
    email: 'a@a.com',
    nickname: '코딩짱',
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
      if (type === 'register') {
        const res = await fetch('/auth/register', {
          method: 'POST',
          headers,
          body: JSON.stringify(form),
        });
        const data = await res.json();
        updateResult('register', { status: res.status, ...data });
      }
      if (type === 'login') {
        console.log(form.hashedPassword);
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            userId: form.userId,
            hashedPassword: form.hashedPassword,
          }),
        });
        const data = await res.json();
        updateResult('login', { status: res.status, ...data });
      }
      if (type === 'findId') {
        const res = await fetch('/auth/find-id', {
          method: 'POST',
          headers,
          body: JSON.stringify({ email: form.email }),
        });
        const data = await res.json();
        updateResult('findId', { status: res.status, ...data });
      }
      if (type === 'findPassword') {
        const res = await fetch('/auth/find-password', {
          method: 'POST',
          headers,
          body: JSON.stringify({ userId: form.userId, email: form.email }),
        });
        const data = await res.json();
        updateResult('findPassword', { status: res.status, ...data });
      }
      if (type === 'checkId') {
        const res = await fetch(`/auth/check-id/${form.userId}`);
        const data = await res.json();
        updateResult('checkId', { status: res.status, ...data });
      }
      if (type === 'logout') {
        const res = await fetch('/auth/logout', { method: 'POST' });
        const data = await res.json();
        updateResult('logout', { status: res.status, ...data });
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

  const Input = ({ name, placeholder }) => (
    <input
      className='block w-full px-3 py-2 mb-2 border border-transparent3 rounded bg-white text-transparent3'
      name={name}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );

  return (
    <div className='p-6 font-mono'>
      <h2 className='text-xl font-bold text-base1 mb-4'>👤 인증 API 테스트</h2>

      <Section title='회원가입 테스트' id='register'>
        <Input name='userId' placeholder='아이디' />
        <Input name='hashedPassword' placeholder='비밀번호' />
        <Input name='email' placeholder='이메일' />
        <Input name='nickname' placeholder='닉네임' />
        <button
          onClick={() => runTest('register')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          회원가입
        </button>
      </Section>

      <Section title='로그인 테스트' id='login'>
        <Input name='userId' placeholder='아이디' />
        <Input name='hashedPassword' placeholder='비밀번호' />
        <button
          onClick={() => runTest('login')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          로그인
        </button>
      </Section>

      <Section title='아이디 중복 확인' id='checkId'>
        <Input name='userId' placeholder='아이디' />
        <button
          onClick={() => runTest('checkId')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          중복 확인
        </button>
      </Section>

      <Section title='아이디 찾기' id='findId'>
        <Input name='email' placeholder='이메일' />
        <button
          onClick={() => runTest('findId')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          아이디 찾기
        </button>
      </Section>

      <Section title='비밀번호 찾기' id='findPassword'>
        <Input name='userId' placeholder='아이디' />
        <Input name='email' placeholder='이메일' />
        <button
          onClick={() => runTest('findPassword')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          비밀번호 찾기
        </button>
      </Section>

      <Section title='로그아웃' id='logout'>
        <button
          onClick={() => runTest('logout')}
          className='bg-base1 text-white px-4 py-1 rounded'
        >
          로그아웃
        </button>
      </Section>
    </div>
  );
}
