import { getQuest, updateQuestState } from "@/utils/questManage";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function QuestPage() {
  const { teamId, questId } = useParams();
  const [quest, setQuest] = useState({});
  useEffect(() => {
    fetchQuest();
  }, []);
  async function fetchQuest() {
    try {
      const dataArray = await getQuest(teamId, questId);
      console.log(dataArray);
      setQuest(dataArray);
    } catch (error) {
      console.log(error);
    }
  }

  // 체크박스 상태 변경 핸들러
  async function handleToggle() {
    try {
      const success = await updateQuestState(teamId, questId);
      console.log(success);
    } catch (error) {
      console.log(error);
    }
  }
  // 완료된 인원
  const totalScore = quest.questUserList?.filter((user) => user.status).length;

  return (
    <div>
      <div className="flex items-start justify-stretch bg-oklch(98.5% 0 0)">
        <div className="flex-1 p-6 pt-0 min-h-screen justify-items-stretch">
          <div>
            <div className="text-3xl font-bold mt-6 mb-4">{questId}번</div>
            <div className="gap-4 rounded-2xl border border-gray-300 shadow-md w-full p-6">
              <div className="flex items-center">
                <span className="w-24 font-semibold text-gray-800">시작일</span>
                <span className="ml-4 text-gray-700">{quest.questStart}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 font-semibold text-gray-800">마감일</span>
                <span className="ml-4 text-gray-700">{quest.questDue}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 font-semibold text-gray-800">생성자</span>
                <span className="ml-4 text-gray-700">
                  {quest.creator?.nickname}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-24 font-semibold text-gray-800">상태</span>
                <span className="ml-4 text-gray-700">{quest.questStatus}</span>
              </div>
              <div className="flex items-center col-span-2">
                <span className="w-24 font-semibold text-gray-800">
                  이동하기
                </span>
                <input
                  type="text"
                  value={quest.questLink}
                  readOnly
                  className="ml-4 border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 w-full max-w-xs"
                />
              </div>
            </div>
          </div>
          <div className="w-full max-w-full p-6">
            <p className="text-lg font-semibold mb-4 border-b">
              제출인원: {totalScore} / {quest.questUserList?.length}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {quest.questUserList?.map((user) => (
                <label
                  key={user.userId}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <input
                    className={`w-5 h-5 rounded-md
                      ${
                        user.status
                          ? "bg-gray-900 accent-white"
                          : "border border-gray-300 bg-white"
                      }
                    `}
                    type="checkbox"
                    checked={user.status}
                    onChange={() => handleToggle(user.userid)}
                  />
                  <span
                    className={`w-full text-sm rounded-lg px-3 py-2 outline-none border 
          ${
            !user.status
              ? "text-black border-gray-900"
              : "text-gray-400 border-gray-300 line-through"
          } 
          bg-white`}
                  >
                    {user.nickname}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="w-7"></div>
      </div>
    </div>
  );
}
