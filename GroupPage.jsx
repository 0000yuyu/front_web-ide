import React, { useState } from "react";
import { useModalStore } from "./TeamStore";

export default function Page() {
  const { isOpen, toggle } = useModalStore();

  ///

  const [form, setForm] = useState({
    teamId: 1,
    teamName: "알고리즘",
    teamTier: "Gold",
    member: 4,
    dueDate: "2025-04-20",
    teamDescription: "팀 설명입니다.",
    userId: "user123",
  });
  const [results, setResults] = useState({});

  const [teams, setTeams] = useState([]);

  ///

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateResult = (key, value) => {
    setResults((prev) => ({ ...prev, [key]: value }));
  };

  const clearResult = (key) => {
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  ///

  const runTest = async (type) => {
    try {
      const headers = { "Content-Type": "application/json" };
      if (type === "createTeam") {
        const res = await fetch("/team", {
          method: "POST",
          headers,
          body: JSON.stringify({
            teamName: form.teamName,
            teamTier: form.teamTier,
            member: parseInt(form.member),
            dueDate: form.dueDate,
            teamDescription: form.teamDescription,
          }),
        });
        const data = await res.json();

        // 새 팀 추가
        const newTeam = {
          id: data.teamId, // 서버 응답값
          name: form.teamName,
          problemCount: 0,
          members: parseInt(form.member),
          max: 10,
          tier: form.teamTier,
        };

        setTeams((prev) => [...prev, newTeam]);

        updateResult("createTeam", { status: res.status, ...data });
        toggle();
      }
      if (type === "joinTeam") {
        const res = await fetch("/team/join", {
          method: "POST",
          headers,
          body: JSON.stringify({ teamId: form.teamId, userId: form.userId }),
        });
        const data = await res.json();
        updateResult("joinTeam", { status: res.status, ...data });
      }
      if (type === "teamList") {
        const res = await fetch("/team/list");
        const data = await res.json();
        updateResult("teamList", { status: res.status, data });
      }
      if (type === "teamMembers") {
        const res = await fetch(`/team/${form.teamId}/member`);
        const data = await res.json();
        updateResult("teamMembers", { status: res.status, data });
      }
      if (type === "teamInfo") {
        const res = await fetch(`/team/${form.teamId}`);
        const data = await res.json();
        updateResult("teamInfo", { status: res.status, data });
      }
    } catch (err) {
      updateResult(type, { status: "error", message: err.message });
    }
  };

  const Section = ({ title, id, children }) => (
    <div className="mb-6 p-4 border border-transparent3 rounded-lg bg-transparent2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base1 font-semibold">{title}</h3>
        <button onClick={() => clearResult(id)} className="text-error text-sm">
          결과 삭제
        </button>
      </div>
      <div>{children}</div>
      {results[id] && (
        <div
          className={`mt-3 p-3 text-sm rounded-lg ${
            results[id].status === 200
              ? "bg-base3 text-white"
              : "bg-error2 text-error"
          }`}
        >
          <pre>{JSON.stringify(results[id], null, 2)}</pre>
        </div>
      )}
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

  ///

  function Modal() {
    const { isOpen, toggle } = useModalStore();
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={toggle}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <Section title="팀 생성 테스트" id="createTeam">
            팀이름: <Input name="teamName" placeholder="팀 이름" />
            팀 티어: <Input name="teamTier" placeholder="팀 티어" />
            팀원 수: <Input name="member" placeholder="팀원 수" type="number" />
            마감일: <Input name="dueDate" placeholder="마감일 (YYYY-MM-DD)" />
            팀 설명: <Input name="teamDescription" placeholder="팀 설명" />
            <button
              onClick={() => runTest("createTeam")}
              className="bg-base1 text-white px-4 py-1 rounded"
            >
              팀 생성
            </button>
          </Section>
        </div>
      </div>
    );
  }

  function TeamList({ teams }) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-xl shadow-md bg-white p-4 flex flex-col justify-between"
          >
            <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
            <p className="text-sm mb-1">문제 수 : {team.problemCount ?? 0}개</p>
            <p className="text-sm mb-1">인원 : {team.members}/10</p>
            <p className="text-sm mb-3">등급: {team.tier}</p>

            {team.members >= 10 ? (
              <button
                className="bg-gray-300 text-white py-1 px-4 rounded cursor-not-allowed"
                disabled
              >
                참여
              </button>
            ) : (
              <button className="bg-[#1f2667] text-white py-1 px-4 rounded hover:bg-[#1f2667]/90">
                참여
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <header className="mb-4 mx-10 bg-[#A9B5DF] text-black px-6 py-4 flex justify-between items-center rounded-b-lg">
        <h1 className="text-2xl font-bold">AlgoMento</h1>
        <button className="text-sm underline">로그아웃</button>
      </header>
      <div className="flex items-start justify-stretch bg-oklch(98.5% 0 0)">
        <nav className="mt-24 h-30 w-12 bg-gray-800 text-white">
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
          <div>
            <button
              onClick={toggle}
              className="bg-[#2D336B] text-white px-3 py-1 rounded text-sm"
            >
              팀 생성
            </button>

            {isOpen && <Modal />}
            <TeamList teams={teams} />
          </div>
        </div>
        <div className="" />
      </div>
    </>
  );
}
