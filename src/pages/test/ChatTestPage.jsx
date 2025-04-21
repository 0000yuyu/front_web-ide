import { useEffect, useRef, useState } from 'react';

export default function ChatTestPage() {
  const [form, setForm] = useState({
    teamId: '31',
    userId: 'user123',
    nickname: '코딩짱',
    content: '안녕하세요',
  });
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('🔴 연결되지 않음');
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5173/ws/chat');
    socketRef.current = socket;

    socket.onopen = () => setStatus('🟢 WebSocket 연결됨');
    socket.onerror = () => setStatus('❌ WebSocket 에러');
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };
    socket.onclose = () => setStatus('🟡 WebSocket 연결 종료');

    return () => socket.close();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const sendMessage = () => {
    const message = {
      type: 'message',
      ...form,
    };
    socketRef.current.send(JSON.stringify(message));
  };

  const clearMessages = () => setMessages([]);

  return (
    <div className='p-6 font-mono'>
      <h2 className='text-xl font-bold text-base1 mb-4'>
        💬 채팅 WebSocket 테스트
      </h2>

      <div className='mb-4 p-4 border border-transparent3 rounded-lg bg-transparent2'>
        <p className='mb-2 font-semibold'>상태: {status}</p>
        <input
          className='block w-full mb-2 px-3 py-2 border rounded text-transparent3'
          name='teamId'
          value={form.teamId}
          onChange={handleChange}
          placeholder='팀 ID'
        />
        <input
          className='block w-full mb-2 px-3 py-2 border rounded text-transparent3'
          name='nickname'
          value={form.nickname}
          onChange={handleChange}
          placeholder='닉네임'
        />
        <input
          className='block w-full mb-2 px-3 py-2 border rounded text-transparent3'
          name='userId'
          value={form.userId}
          onChange={handleChange}
          placeholder='유저 ID'
        />
        <input
          className='block w-full mb-2 px-3 py-2 border rounded text-transparent3'
          name='content'
          value={form.content}
          onChange={handleChange}
          placeholder='메시지 내용'
        />
        <div className='flex gap-2'>
          <button
            onClick={sendMessage}
            className='bg-base1 text-white px-4 py-1 rounded'
          >
            전송
          </button>
          <button onClick={clearMessages} className='text-error text-sm'>
            수신 메시지 삭제
          </button>
        </div>
      </div>

      <div className='bg-white p-4 rounded-lg border border-transparent3'>
        <h3 className='font-semibold mb-2 text-base1'>🧾 수신 메시지 목록</h3>
        {messages.length === 0 ? (
          <p className='text-transparent3'>메시지가 없습니다.</p>
        ) : (
          <ul className='text-sm text-transparent3 space-y-1'>
            {messages.map((msg, i) => (
              <li key={i}>
                [{msg.timestamp}] <strong>{msg.nickname}</strong>: {msg.content}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
