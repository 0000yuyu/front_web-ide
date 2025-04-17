import React from "react";
import { useUserStore } from "./TeamStore";

export default function Page() {
  const { teamId, profile, tier, setTier } = useUserStore();

  const problems = [
    { id: 1001, status: "시작", members: 5, deadline: "2025.04.30" },
    { id: 1001, status: "진행중", members: 5, deadline: "2025.04.30" },
    { id: 1001, status: "완료", members: 5, deadline: "2025.04.30" },
    { id: null, status: "로딩 중", members: null, deadline: null },
  ];

  const statusColors = {
    시작: "bg-indigo-600 text-white",
    진행중: "bg-indigo-200 text-indigo-800",
    완료: "bg-gray-300 text-white",
    "로딩 중": "bg-gray-100 text-gray-400",
  };

  /////
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">AlgoMento</h1>
        <button className="text-sm text-blue-600">로그아웃</button>
      </header>

      {/* 상단 박스 */}
      <section className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">
            팀 ID: {teamId ?? "없음"}
          </h2>
          <p>티어: {tier}</p>
          <button
            onClick={() => setTier("silver")}
            className="text-sm text-blue-500 mt-2"
          >
            티어를 Silver로 변경
          </button>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            일주일에 6번(월~토) 풀의성실하게 활동 부탁드립니다~
            {"\n"}안녕하세요 팀장 구름입니다 {"\n"}매주 수요일 정기모임으로
            접속해주세요
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-semibold mb-2">User list</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {["정상모", "김지환", "송유진", "최은희", "이지윤", "김구룡"].map(
              (user) => (
                <li key={user} className="flex items-center gap-2">
                  <img
                    src={profile || "/default.png"}
                    alt="프로필"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  {user}
                </li>
              )
            )}
          </ul>
        </div>
      </section>

      {/* 문제 목록 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">문제 목록</h2>
        <button className="bg-indigo-500 text-white px-3 py-1 rounded text-sm">
          문제 생성
        </button>
      </div>

      <section className="grid grid-cols-4 gap-4">
        {problems.map((prob, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">
              백준 {prob.id || "..."}
            </p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">
                인원: {prob.members ?? "..."}/10
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  statusColors[prob.status]
                }`}
              >
                {prob.status}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              마감일: {prob.deadline ?? "..."}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
