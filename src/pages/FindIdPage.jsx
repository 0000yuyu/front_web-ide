import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { findId } from '@/utils/userManage';

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
function Panel({ label, children }) {
  return (
    <div className='shadow-mg w-full h-[100px] border p-3 flex flex-col gap-6'>
      <span className='text-xl'>{label}</span>
      <span className=' text-center'>{children}</span>
    </div>
  );
}
function FormInput({ children }) {
  return <div className='flex flex-col gap-5 items-end'>{children}</div>;
}

export default function FindIdPage() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState({});
  const emailRef = useRef(null);

  const handleFindId = async () => {
    const newMessages = {};
    let hasError = false;

    if (email === '') {
      newMessages.email = { type: 'error', text: '이메일을 입력해주세요.' };
      hasError = true;
    }

    setMessages(newMessages);

    // 에러가 있다면 포커스 이동
    if (hasError) {
      if (newMessages.id) emailRef.current?.focus();
      return;
    }

    try {
      const success = await findId(email);
      if (success) {
        setId(success);
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
        <FormName>아이디 찾기</FormName>
        <Seperator />
        <FormContent>
          <FormInput>
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
                  id: null,
                }));
              }}
            />
          </FormInput>

          <SubmitButton onClick={handleFindId}>찾기</SubmitButton>
          <Panel label='id'>{id}</Panel>
          <FormFooter>
            <Link to='/login' className='text-sm text-gray-600 hover:underline'>
              로그인
            </Link>
          </FormFooter>
        </FormContent>
      </Form>
    </div>
  );
}
