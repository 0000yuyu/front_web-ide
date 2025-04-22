<<<<<<< HEAD
import { userDataStore } from '@/store/userDataStore';
import { checkIdDuplicate, membership } from '@/utils/userManage';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Form({ children }) {
  return (
    <div
      className='flex max-md:gap-3 max-md:flex-col max-md:items-center gap-10  text-transparent3
    items-start justify-center w-full'
    >
      {children}
    </div>
  );
}

function FormName({ children }) {
  return (
    <h1
      className='
    text-xl my-5 font-bold flex'
    >
      {children}
    </h1>
  );
}
function FormContent({ children }) {
  return <div className='my-5 flex flex-col gap-10 items-end '>{children}</div>;
}

function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  inputRef,
  message,
}) {
  return (
    <div className='flex gap-4 mb-4'>
      {label && (
        <label className=' text-sm font-bold' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          ref={inputRef}
          className={`shadow appearance-none border ${
            message?.type == 'error' && 'border-error'
          }
        rounded p-[5px] px-10 leading-tight focus:outline-none focus:shadow-outline`}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {message && (
          <span
            className={`${
              message?.type == 'error' ? 'text-error' : 'text-green-400'
            } text-error 
          text-sm mt-1 absolute left-0 bottom-[-20px]`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
function Seperator() {
  return <div className='border-r border-base1 self-stretch'></div>;
}
function FormFooter({ children }) {
  return (
    <div className='mt-4 flex flex-col gap-2 justify-around items-end'>
      {children}
    </div>
  );
}

function SubmitButton({ onClick, disabled, children }) {
  return (
    <div className='flex items-center justify-between w-full'>
      <button
        className='bg-base1 w-full disabled:bg-transparent1 disabled:pointer-events-none hover:opacity-55 text-white 
        font-bold py-[5px] px-20 rounded focus:outline-none focus:shadow-outline'
        type='button'
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
function FormInput({ children }) {
  return <div className='flex flex-col gap-5 items-end'>{children}</div>;
}

export default function MembershipPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickName, setNickName] = useState('');
  const [messages, setMessages] = useState({});
  const idRef = useRef(null);
  const passwordRef = useRef(null);
  const nickNameRef = useRef(null);
  const emailRef = useRef(null);

=======
import { checkIdDuplicate, membership } from "@/utils/userManage"; // 회원가입 및 아이디 중복 확인 기능을 포함하는 모듈을 가져옵니다.
import React, { useState } from "react"; // 리액트와 상태 관리를 위한 useState를 가져옵니다.
import { Link } from "react-router-dom"; // 리액트 라우터 도메인을 가져옵니다.

export default function MembershipPage() {
  const [id, setId] = useState(""); // 아이디 상태를 관리합니다.
  const [password, setPassword] = useState(""); // 비밀번호 상태를 관리합니다.
  const [nickName, setNickName] = useState(""); // 닉네임 상태를 관리합니다.
  const [email, setEmail] = useState(""); // 이메일 상태를 관리합니다.
  const handleLogin = async () => {
    // 회원가입 로직을 처리하는 함수입니다.
    if (id == "" || password == "")
      alert(
        "아이디와 비밀번호를 모두 입력해주세요."
      ); // 아이디와 비밀번호가 입력되지 않았으면 경고 메시지를 표시합니다.
    else {
      try {
        const success = await membership(id, password); // 회원가입 API를 호출합니다.
        if (success)
          alert("회원가입 완료"); // 성공하면 회원가입 완료 메시지를 표시합니다.
        else alert("아이디와 비밀번호를 확인해주세요."); // 실패하면 확인 메시지를 표시합니다.
      } catch (error) {
        console.log(error); // 오류가 발생하면 콘솔에 로그를 출력합니다.
      }
    }
  };
>>>>>>> 1c86d02 (refact: QiestPage, Team Main Dummy data deleted)
  const handleCheckId = async () => {
    // 아이디 중복 확인 로직을 처리하는 함수입니다.
    try {
<<<<<<< HEAD
      if (!id)
        setMessages((prev) => ({
          ...prev,
          id: { type: 'error', text: '아이디를 입력해주세요.' },
        }));
      const success = await checkIdDuplicate(id);
      if (success) {
        setMessages((prev) => ({
          ...prev,
          id: { type: 'success', text: '사용할 수 있는 아이디 입니다.' },
        }));
      } else throw new Error('사용중');
=======
      if (!id) throw new Error("공백"); // 아이디가 입력되지 않았으면 오류를 발생시킵니다.
      const success = await checkIdDuplicate(id); // 아이디 중복 확인 API를 호출합니다.
      if (success)
        alert(
          "사용할 수 있는 ID"
        ); // 성공하면 사용할 수 있는 ID라는 메시지를 표시합니다.
      else throw new Error("사용중"); // 실패하면 사용중인 ID라는 오류를 발생시킵니다.
>>>>>>> 1c86d02 (refact: QiestPage, Team Main Dummy data deleted)
    } catch (error) {
      alert("사용할 수 없는 아이디\n=" + error.message); // 오류가 발생하면 사용할 수 없는 아이디라는 메시지를 표시합니다.
    }
  };

  const handleMembership = async () => {
    const newMessages = {};
    let hasError = false;

    if (id === '') {
      newMessages.id = { type: 'error', text: '아이디를 입력해주세요.' };
      hasError = true;
    } else if (messages.id?.type != 'success') {
      newMessages.id = {
        type: 'error',
        text: '아이디 중복 검사를 완료해주세요',
      };
      hasError = true;
    }

    if (password === '') {
      newMessages.password = {
        type: 'error',
        text: '비밀번호를 입력해주세요.',
      };
      hasError = true;
    }
    if (email === '') {
      newMessages.email = { type: 'error', text: '이메일을 입력해주세요.' };
      hasError = true;
    }

    if (nickName === '') {
      newMessages.nickName = {
        type: 'error',
        text: '닉네임을 입력해주세요.',
      };
      hasError = true;
    }

    setMessages(newMessages);

    // 에러가 있다면 포커스 이동
    if (hasError) {
      if (newMessages.id) idRef.current?.focus();
      else if (newMessages.password) passwordRef.current?.focus();
      else if (newMessages.email) emailRef.current?.focus();
      else if (newMessages.nickName) nickNameRef.current?.focus();
      return;
    }

    try {
      const success = await membership(id, password);
      if (success) {
        alert('회원가입 완료');
      } else {
        throw new Error();
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.' + error);
    }
  };

  return (
<<<<<<< HEAD
    <div className='border border-base1 flex justify-center items-center h-full w-full'>
      <Form>
        <FormName>회원가입</FormName>
        <Seperator />
        <FormContent>
          <FormInput>
            <Input
              inputRef={idRef}
              id='id'
              label='아이디'
              type='text'
              placeholder='아이디를 입력하세요'
              value={id}
              message={messages.id}
              onChange={(e) => {
                setId(e.target.value);
                setMessages((prev) => ({
                  ...prev,
                  id: null,
                }));
              }}
            />
            <SubmitButton onClick={handleCheckId} className='w-[30px]'>
              중복 확인
            </SubmitButton>
            <Input
              inputRef={passwordRef}
              id='password'
              label='비밀번호'
              type='password'
              placeholder='비밀번호를 입력하세요'
              value={password}
              message={messages.password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessages((prev) => ({
                  ...prev,
                  password: null,
                }));
              }}
            />
            <Input
              inputRef={nickNameRef}
              id='nickname'
              label='닉네임'
              type='text'
              placeholder='닉네임을 입력하세요'
              value={nickName}
              message={messages.nickName}
              onChange={(e) => {
                setNickName(e.target.value);
                setMessages((prev) => ({
                  ...prev,
                  nickName: null,
                }));
              }}
            />
            <Input
              inputRef={emailRef}
              id='email'
              label='이메일'
              type='email'
              placeholder='이메일을 입력하세요'
              value={email}
              message={messages.email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessages((prev) => ({
                  ...prev,
                  email: null,
                }));
              }}
            />
            <SubmitButton onClick={handleMembership}>로그인</SubmitButton>
          </FormInput>

          <FormFooter>
            <Link
              to='/membership'
              className='text-sm text-gray-600 hover:underline'
            >
              회원가입
            </Link>
            <div className='flex gap-5'>
              <Link
                to='/find-id'
                className='text-sm text-gray-600 hover:underline'
              >
                아이디 찾기
              </Link>
              <Link
                to='/find-password'
                className='text-sm text-gray-600 hover:underline'
              >
                비밀번호 찾기
              </Link>
            </div>
          </FormFooter>
        </FormContent>
      </Form>
    </div>
=======
    <form action={handleLogin}>
      {" "}
      // 회원가입 폼을 정의합니다.
      <label htmlFor="id">아이디</label>
      <input
        id="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
        type="text"
        name="id"
      />
      <button type="button" onClick={() => handleCheckId()}>
        중복 확인
      </button>
      <div>
        <label htmlFor="pwd">비밀번호</label>
        <input
          id="pwd"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="pwd"
        />
      </div>
      <div>
        <label htmlFor="nickName">닉네임</label>
        <input
          id="nickName"
          type="text"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          name="nickName"
        />
      </div>
      <div>
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />
      </div>
      <input type="submit" value="가입" />
      <div>
        <Link to="/membership">회원가입</Link>
      </div>
      <div>
        <Link to="/find-id">아이디 찾기</Link>
        <Link to="/find-password">비밀번호 찾기</Link>
      </div>
    </form>
>>>>>>> 1c86d02 (refact: QiestPage, Team Main Dummy data deleted)
  );
}
