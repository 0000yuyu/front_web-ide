import { userDataStore } from '@/store/userDataStore';
import { getUserData, login } from '@/utils/userManage';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { setUserProfile } = userDataStore();

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로 고침 방지

    if (id === '' || password === '') {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
    } else {
      try {
        const success = await login(id, password);
        if (success) {
          const userData = await getUserData();
          console.log(userData);
          console.log('userData', userData);
          console.log('userDataStore 전', userDataStore.getState());
          setUserProfile(userData);
          console.log('userDataStore 후', userDataStore.getState());
        }
      } catch (error) {
        console.log(error);
        alert('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label htmlFor='id'>아이디</label>
      <input
        id='id'
        value={id}
        onChange={(e) => setId(e.target.value)}
        type='text'
        name='id'
      />
      <div>
        <label htmlFor='pwd'>비밀번호</label>
        <input
          id='pwd'
          type='text'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name='pwd'
        />
      </div>
      <input type='submit' value='로그인' />
      <div>
        <Link to='/membership'>회원가입</Link>
      </div>
      <div>
        <Link to='/find-id'>아이디 찾기</Link>
        <Link to='/find-password'>비밀번호 찾기</Link>
      </div>
    </form>
  );
}
