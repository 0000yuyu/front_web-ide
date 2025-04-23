import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      socket.emit("chat message", input);
      setInput("");
    }
  };

  return (
    <div className="w-80 border rounded-xl p-3 bg-white flex flex-col justify-between h-[90vh]">
      <h2 className="text-lg font-semibold mb-2">CHAT</h2>

      <input
        type="text"
        placeholder="아이디를 검색하세요"
        className="w-full px-3 py-1 border rounded mb-2 text-sm"
      />

      <div className="flex-1 overflow-y-auto space-y-4 mb-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              msg.nickname === "나" ? "justify-end" : ""
            }`}
          >
            {/* 다른 사람이 보낸 메시지일 경우, 프로필 사진을 표시합니다. */}
            {msg.nickname !== "나" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                👤
              </div>
            )}

            <div
              className={`rounded-xl px-3 py-2 text-sm max-w-[70%] ${
                msg.nickname === "나"
                  ? "bg-indigo-100 border border-indigo-400" // 내가 보낸 메시지의 배경과 테두리 스타일
                  : "bg-gray-100" // 다른 사람이 보낸 메시지의 배경 스타일
              }`}
            >
              <span className="block text-xs text-gray-500">
                {msg.nickname}
              </span>
              <span>{msg.content}</span>
            </div>
            {/* 내가 보낸 메시지일 경우, 프로필 사진을 표시합니다. */}
            {msg.nickname === "나" && (
              <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
                🧑‍💻
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            className="flex-1 px-3 py-2 border rounded-full text-sm"
          />
          <button
            type="submit"
            className="p-2 text-indigo-500 hover:text-indigo-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
