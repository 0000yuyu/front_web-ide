import React, { useState, useEffect, useRef } from 'react';
import {
  connectChatSocket,
  sendMessageToServer,
  disconnectChatSocket,
  searchCahtMessages,
  getChatHistory,
} from '@/utils/chatManage';
import { userDataStore } from '@/store/userDataStore';

export default function ChatBox({ team_id }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const { nickname } = userDataStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!team_id) return;

    async function initChat() {
      try {
        const history = await getChatHistory(team_id);
        const sorted = history.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sorted);

        connectChatSocket((msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      } catch (err) {
        console.error('초기 채팅 로딩 실패:', err);
      }
    }

    initChat();
    return () => disconnectChatSocket();
  }, [team_id]);

  // 📌 메시지 바뀔 때마다 자동 스크롤
  useEffect(() => {
    if (!scrollRef.current) return;
    requestAnimationFrame(() => {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessageToServer({
      nickname,
      content: input,
      team_id,
    });
    setInput('');
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    const data = await searchCahtMessages(team_id, keyword);
    setResults(data);
  };

  return (
    <div className='mt-8 w-80 border p-3 bg-white flex flex-col justify-between h-[90vh]'>
      <h2 className='text-lg font-semibold mb-2'>CHAT</h2>

      {/* 검색 */}
      <div className='px-3 flex gap-2 mb-2'>
        <input
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder='검색하세요'
          className='flex-1 px-3 py-1 border rounded text-sm'
        />
        <button
          onClick={handleSearch}
          className='bg-blue-600 text-white px-3 py-1 rounded'
        >
          검색
        </button>
      </div>

      {results.length > 0 && (
        <div className='mt-2 text-sm bg-yellow-50 p-2 rounded max-h-40 overflow-y-auto border border-yellow-200'>
          <p className='text-xs text-yellow-800 font-semibold mb-1 flex justify-between'>
            <span>검색 결과</span>
            <button onClick={() => setResults([])}>닫기</button>
          </p>
          {results.map((msg, i) => (
            <p key={i}>
              <strong>{msg.nickname}</strong>: {msg.content}
            </p>
          ))}
        </div>
      )}

      {/* 메시지 리스트 */}
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto space-y-4 my-2 pr-1'
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              msg.nickname === nickname ? 'justify-end' : ''
            }`}
          >
            {msg.nickname !== nickname && (
              <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                👤
              </div>
            )}

            <div
              className={`rounded-xl px-3 py-2 text-sm max-w-[70%] ${
                msg.nickname === nickname
                  ? 'bg-indigo-100 border border-indigo-400'
                  : 'bg-gray-100'
              }`}
            >
              <span className='block text-xs text-gray-500'>
                {msg.nickname}
              </span>
              <span>{msg.content}</span>
            </div>

            {msg.nickname === nickname && (
              <div className='w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center'>
                🧑‍💻
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <form onSubmit={handleSubmit}>
        <div className='mt-2 flex items-center gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete='off'
            className='flex-1 px-3 py-2 border rounded-full text-sm'
          />
          <button
            type='submit'
            className='p-2 text-indigo-500 hover:text-indigo-600'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
