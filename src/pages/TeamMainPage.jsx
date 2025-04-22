import React, { useState, useEffect, useRef } from "react";
import { useModalStore } from "./TeamStore";
import { Link, useParams } from "react-router-dom";
import { getTeam, getTeamMembers } from "@/utils/teamManage";
import { getQuestList, createQuest } from "@/utils/questManage";
import { userDataStore } from "@/store/userDataStore";

export default function TeamMainPage() {
  const { isOpen, toggle } = useModalStore();
  const { tier, teamId } = userDataStore();

  //팀
  const [form, setForm] = useState({
    team_id: "",
    quest_name: "",
    user_id: "",
    quest_start: "",
    quest_due: "",
    quest_link: "",
  });

  const [quests, setQusets] = useState([]);

  //const [results, setResults] = useState({});

  async function fetchQuestList() {
    try {
      const array = await getQuestList();
      setQusets(array);
      console.log(array);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleCreateQuest(event) {
    event.preventDefault();

    if (!form.quest_name.trim()) {
      alert("문제 번호를 입력해주세요");
      return;
    }

    if (!form.quest_due.trim()) {
      alert("마감 일자를 입력해주세요");
      return;
    }

    if (!form.quest_start.trim()) {
      alert("링크를 입력해주세요");
      return;
    }

    try {
      const success = await createQuest(form);
      if (success) {
        await fetchQuestList();
        setForm({
          quest_name: "",
          user_id: "",
          quest_start: "",
          quest_due: "",
          quest_link: "",
        });
      } else {
        throw new Error("문제 생성 실패");
      }
      toggle();
    } catch (error) {
      alert(error.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const Section = ({ title, children }) => (
    <div className="mb-6 p-4 border border-transparent3 rounded-lg bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base1 font-semibold">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );

  const Input = ({ name, placeholder, type = "text" }) => (
    <input
      className="block w-full px-3 py-2 mb-2 border border-transparent3 rounded bg-white text-transparent3"
      name={name}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
      type={type}
    />
  );

  //함수
  function Modal() {
    const { isOpen, toggle } = useModalStore();
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={toggle}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <Section title="문제 생성" id="createQuest">
            생성자:{" "}
            <Input name="user_id" placeholder="생성자 이름" type="number" />
            문제명:
            <Input name="quest_name" placeholder="문제 이름" />
            시작일:{" "}
            <Input name="quest_start" placeholder="시작일 (YYYY-MM-DD)" />
            마감일: <Input name="quest_due" placeholder="마감일 (YYYY-MM-DD)" />
            문제 링크: <Input name="quest_link" placeholder="문제 링크" />
            <button
              onClick={handleCreateQuest}
              className="bg-base1 text-white px-4 py-1 rounded"
            >
              문제 생성
            </button>
          </Section>
        </div>
      </div>
    );
  }

  function ProblemList({ quests }) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {quests.map((quest) => (
          <div key={quest.id} className="p-4 border rounded shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{quest.quest_name}</h2>
              {quest.status}
              <Link
                to={`/quest/${team_id}/${quest.quest_name}`}
                className="text-white text-sm px-2 py-1 rounded bg-[#2D336B]"
              >
                이동
              </Link>
            </div>
            <p className="text-sm mt-2">인원: {quest.teamSize}</p>
            <p className="text-sm">마감일: {quest.quest_due}</p>
          </div>
        ))}
      </div>
    );
  }

  //채팅
  const [formChat, setFormChat] = useState({
    teamId: "31",
    userId: "user123",
    nickname: "코딩짱",
    content: "안녕하세요",
  });
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("🔴 연결되지 않음");
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5173/ws/chat");
    socketRef.current = socket;

    socket.onopen = () => setStatus("🟢 WebSocket 연결됨");
    socket.onerror = () => setStatus("❌ WebSocket 에러");
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };
    socket.onclose = () => setStatus("🟡 WebSocket 연결 종료");

    return () => socket.close();
  }, []);

  const handleChangeChat = (e) => {
    const { name, value } = e.target;
    setFormChat((prev) => ({ ...prev, [name]: value }));
  };

  const sendMessage = () => {
    const message = {
      type: "message",
      ...formChat,
    };
    socketRef.current.send(JSON.stringify(message));
  };

  const clearMessages = () => setMessages([]);

  return (
    <>
      <div className="flex items-start justify-stretch bg-oklch(98.5% 0 0)">
        <nav className="mt-10 h-30 w-12 bg-gray-800 text-white">
          <div className="flex flex-col text-xs tracking-tight text-center">
            <a href="#" className="hover:bg-gray-700 px-3 py-2 rounded">
              홈
            </a>
            <a href="#" className="hover:bg-gray-700 px-3 py-2 rounded">
              그룹
            </a>
          </div>
        </nav>
        <div className="flex-1 p-6 pt-0 min-h-screen justify-items-stretch">
          {/* 팀 정보 */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-2">팀명:{teamId}</h2>
            <p>{tier}</p>
          </div>
          <section className="divide-x-1 h-48 max-h-48 grid grid-cols-3 gap-0 mb-6">
            <div className="col-span-2 bg-white shadow rounded-l-lg p-4">
              {/* 공지사항 */}
              <div className="text-sm text-gray-600 whitespace-pre-line">
                teamData.teamDescription
              </div>
            </div>

            <div className="overflow-y-scroll bg-white shadow rounded-r-lg p-4 ">
              <h3 className="font-semibold mb-2">User list</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {/*{memberList.map((member, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <img
                      alt="프로필"
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    <span className="h-2 rounded-full" />
                    {member.nickname}
                  </li>
                ))}*/}
              </ul>
            </div>
          </section>

          {/* 문제 목록 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">문제 목록</h2>
              <button
                onClick={toggle}
                className="bg-[#2D336B] text-white px-3 py-1 rounded text-sm"
              >
                문제 생성
              </button>
            </div>
            {isOpen && <Modal />}
            <ProblemList quests={quests} />
          </div>
        </div>
        {/*채팅*/}
        <div className="">
          <div className="p-6 font-mono">
            <h2 className="text-xl font-bold text-base1 mb-4">
              💬 채팅 WebSocket 테스트
            </h2>

            <div className="mb-4 p-4 border border-transparent3 rounded-lg bg-transparent2">
              <p className="mb-2 font-semibold">상태: {status}</p>
              <input
                className="block w-full mb-2 px-3 py-2 border rounded text-transparent3"
                name="teamId"
                value={formChat.teamId}
                onChange={handleChangeChat}
                placeholder="팀 ID"
              />
              <input
                className="block w-full mb-2 px-3 py-2 border rounded text-transparent3"
                name="nickname"
                value={formChat.nickname}
                onChange={handleChangeChat}
                placeholder="닉네임"
              />
              <input
                className="block w-full mb-2 px-3 py-2 border rounded text-transparent3"
                name="userId"
                value={formChat.userId}
                onChange={handleChangeChat}
                placeholder="유저 ID"
              />
              <input
                className="block w-full mb-2 px-3 py-2 border rounded text-transparent3"
                name="content"
                value={formChat.content}
                onChange={handleChangeChat}
                placeholder="메시지 내용"
              />
              <div className="flex gap-2">
                <button
                  onClick={sendMessage}
                  className="bg-base1 text-white px-4 py-1 rounded"
                >
                  전송
                </button>
                <button onClick={clearMessages} className="text-error text-sm">
                  수신 메시지 삭제
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-transparent3">
              <h3 className="font-semibold mb-2 text-base1">
                🧾 수신 메시지 목록
              </h3>
              {messages.length === 0 ? (
                <p className="text-transparent3">메시지가 없습니다.</p>
              ) : (
                <ul className="text-sm text-transparent3 space-y-1">
                  {messages.map((msg, i) => (
                    <li key={i}>
                      [{msg.timestamp}] <strong>{msg.nickname}</strong>:{" "}
                      {msg.content}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
