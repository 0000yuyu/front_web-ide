import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userDataStore } from '@/store/userDataStore';
import { findId, findPassword, getUserData, login } from '@/utils/userManage';

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
              message?.type == 'error' ? 'text-error' : 'text-green-500'
            } text-sm mt-1  absolute border-error left-0 bottom-[-20px]`}
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
    <div className='flex items-center justify-between max-md:w-full'>
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

export default function FindPasswordPage() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const { setUserProfile } = userDataStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState({});
  const idRef = useRef(null);
  const emailRef = useRef(null);

  const handleFindPassword = async () => {
    const newMessages = { id: null, password: null };
    let hasError = false;

    if (id === '') {
      newMessages.id = { type: 'error', text: '아이디를 입력해주세요.' };
      hasError = true;
    }

    if (email === '') {
      newMessages.email = {
        type: 'error',
        text: '이메일을 입력해주세요.',
      };
      hasError = true;
    }

    setMessages(newMessages);

    // 에러가 있다면 포커스 이동
    if (hasError) {
      if (newMessages.id) idRef.current?.focus();
      else if (newMessages.password) emailRef.current?.focus();
      return;
    }

    try {
      const success = await findPassword(id, email);
      if (success) {
        alert('이메일로 임시 비밀번호 전송 완료');
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='border border-base1 flex justify-center items-center h-full w-full'>
      <Form>
        <FormName>비밀번호 찾기</FormName>
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
          </FormInput>

          <SubmitButton onClick={handleFindPassword}>찾기</SubmitButton>
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
  );
}
