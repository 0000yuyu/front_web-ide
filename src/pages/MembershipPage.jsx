import { checkIdDuplicate, membership } from '@/utils/userManage';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MembershipPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const handleLogin = async () => {
    if (id == '' || password == '')
      alert('아이디와 비밀번호를 모두 입력해주세요.');
    else {
      try {
        const success = await membership(id, password);
        if (success) alert('회원가입 완료');
        else alert('아이디와 비밀번호를 확인해주세요.');
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleCheckId = async () => {
    try {
      if (!id) throw new Error('공백');
      const success = await checkIdDuplicate(id);
      if (success) alert('사용할 수 있는 ID');
      else throw new Error('사용중');
    } catch (error) {
      alert('사용할 수 없는 아이디\n=' + error.message);
    }
  };
  return (
    <form action={handleLogin}>
      <label htmlFor='id'>아이디</label>
      <input
        id='id'
        value={id}
        onChange={(e) => setId(e.target.value)}
        type='text'
        name='id'
      />
      <button type='button' onClick={() => handleCheckId()}>
        중복 확인
      </button>
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
      <div>
        <label htmlFor='nickName'>닉네임</label>
        <input
          id='nickName'
          type='text'
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          name='nickName'
        />
      </div>
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
      <input type='submit' value='가입' />
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
