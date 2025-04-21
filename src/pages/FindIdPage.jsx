import { findId } from '@/utils/userManage';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FindIdPage() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const handleFindId = async () => {
    if (email == '') alert('아이디와 비밀번호를 모두 입력해주세요.');
    else {
      try {
        const finded = await findId(email);
        if (finded) setId(finded.userId);
        else alert('등록되지 않은 이메일 입니다.');
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <form action={handleFindId}>
      <label htmlFor='email'>email</label>
      <input
        id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type='text'
        name='email'
      />
      <input type='submit' value='찾기' />
      <div>
        <span>ID</span>
        <span>{id}</span>
      </div>
      <div>
        <Link to='/login'>로그인</Link>
        <Link to='/find-password'>비밀번호 찾기</Link>
      </div>
    </form>
  );
}
