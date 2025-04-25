import React, { useState, useEffect } from "react";
import {
  connectChatSocket,
  sendMessageToServer,
  disconnectChatSocket,
  searchCahtMessages,
  getChatHistory,
} from "@/utils/chatManage";
import { userDataStore } from "@/store/userDataStore";

export default function ChatBox() {
  //chat sanding
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  //chat searching
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const { teamId, nickname, userId } = userDataStore();

  const user = {
    user_id: userId,
    nickname: nickname,
    team_id: teamId,
  };

  useEffect(() => {
    if (!teamId) return;
    // 1. 채팅 내역 + webSocket 연결
    async function initChat() {
      try {
        const history = await getChatHistory(teamId);
        setMessages(history);

        connectChatSocket(teamId, (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      } catch (err) {
        console.error("초기 채팅 로딩 실패:", err);
      }
    }
    initChat();

    return () => {
      disconnectChatSocket();
    };
  }, [teamId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessageToServer({
      user_id: user.user_id,
      nickname: user.nickname,
      content: input,
      team_id: user.team_id,
    });
    setInput("");
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    const data = await searchCahtMessages(teamId, keyword);
    setResults(data);
  };

  return (
    <div className="mt-8 w-80 border p-3 bg-white flex flex-col justify-between h-[90vh]">
      <h2 className="text-lg font-semibold mb-2">CHAT</h2>
      {/*검색*/}
      <div className="">
        <div className="px-3 flex justify-stretch gap-2">
          <input
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            placeholder="검색하세요"
            className="w-70 px-3 py-1 border rounded text-sm "
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            검색
          </button>
        </div>
        {results.length > 0 && (
          <div className="mt-4 text-sm bg-yellow-50 p-2 rounded max-h-40 overflow-y-auto border border-yellow-200">
            <p className="text-xs text-yellow-800 font-semibold mb-1">
              🔍 검색 결과
            </p>
            {results.map((msg, i) => (
              <p key={i}>
                <strong>{msg.nickname}</strong>: {msg.content}
              </p>
            ))}
          </div>
        )}
      </div>

      {/*메세지 리스트*/}
      <div className="flex-1 overflow-y-auto space-y-4 mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              msg.nickname === nickname ? "justify-end" : ""
            }`}
          >
            {/* 다른 사람이 보낸 메시지일 경우, 프로필 사진을 표시합니다. */}
            {msg.nickname !== nickname && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                👤
              </div>
            )}

            <div
              className={`rounded-xl px-3 py-2 text-sm max-w-[70%] ${
                msg.nickname === nickname
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
            {msg.nickname === nickname && (
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
