import { findPassword } from '@/utils/userManage';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FindPasswordPage() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const handleFindPassword = async () => {
    if (id == '' || email == '')
      alert('아이디와 비밀번호를 모두 입력해주세요.');
    else {
      try {
        const success = await findPassword(id, email);
        if (success) alert('비밀번호가 전송되었습니다.');
        else alert('등록되지 않은 회원입니다.');
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <form action={handleFindPassword}>
      <label htmlFor='id'>아이디</label>
      <input
        id='id'
        value={id}
        onChange={(e) => setId(e.target.value)}
        type='text'
        name='id'
      />
      <div>
        <label htmlFor='email'>이메일</label>
        <input
          id='email'
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name='email'
        />
      </div>
      <input type='submit' value='찾기' />
      <div>
        <Link to='/find-id'>로그인</Link>
        <Link to='/find-password'>회원가입</Link>
      </div>
    </form>
  );
}
