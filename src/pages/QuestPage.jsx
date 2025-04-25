// 퀘스트 관리 함수를 가져옵니다.
import { accessCode } from '@/utils/codeManage';
import {
  getQuest,
  getQuestStates,
  getTeamMembers,
  submitQuest,
} from '@/utils/questDetailManage';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function QuestPage() {
  // 팀 아이디, 문제 아이디 가져오기
  const { team_id, quest_id } = useParams();
  const [members, setMembers] = useState([]);

  const [quest, setQuest] = useState({});

  // 문제를 먼저 가져오기
  useEffect(() => {
    fetchQuest();
    getTeamMembersWithStatus();
  }, []);

  async function fetchQuest() {
    try {
      const questData = await getQuest(team_id, quest_id);
      console.log(questData); // 가져온 데이터를 콘솔에 로그로 출력합니다.
      setQuest(questData); // 가져온 데이터를 상태에 저장합니다.
    } catch (error) {
      console.log(error); // 오류가 발생하면 콘솔에 로그로 출력합니다.
    }
  }
  async function submitTeamQuest() {
    try {
      const response = await submitQuest(quest_id);
    } catch (error) {
      console.log(error);
    }
  }
  async function getTeamMembersWithStatus() {
    const members = await getQuestStates(team_id, quest_id);
    const membersWithStatus = await Promise.all(
      members.map(async (member) => {
        const accessible = await accessCode(team_id, quest_id, member.userId);
        return {
          ...member,
          accessible, // 예시 필드
        };
      })
    );
    console.log(membersWithStatus);
    setMembers(membersWithStatus);
  }

  // 완료된 인원
  // 퀘스트에 완료된 사용자의 수를 계산합니다.
  const totalScore = members?.filter((user) => user.isCompleted).length;

  return (
    <div>
      <div className='flex items-start'>
        <div className='flex-1 p-6 pt-0 justify-items-stretch'>
          <div>
            <div className='text-3xl font-bold mt-6 mb-4'>
              {quest.quest_id}번
            </div>
            <div className='gap-4 rounded-2xl border border-gray-300 shadow-md w-full p-6'>
              <div className='flex items-center'>
                <span className='w-24 font-semibold text-gray-800'>시작일</span>
                <span className='ml-4 text-gray-700'>{quest.quest_start}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-24 font-semibold text-gray-800'>마감일</span>
                <span className='ml-4 text-gray-700'>{quest.quest_due}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-24 font-semibold text-gray-800'>생성자</span>
                <span className='ml-4 text-gray-700'>{quest.creator_id}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-24 font-semibold text-gray-800'>상태</span>
                <span className='ml-4 text-gray-700'>{quest.quest_status}</span>
              </div>
              <div className='flex items-center col-span-2'>
                <span className='w-24 font-semibold text-gray-800'>
                  이동하기
                </span>
                <input
                  type='text'
                  value={quest.quest_link ?? ''}
                  readOnly
                  className='ml-4 border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 w-full max-w-xs'
                />
              </div>
            </div>
          </div>
          <div className='w-full max-w-full p-6'>
            <p className='text-lg font-semibold mb-4 border-b'>
              제출인원: {totalScore} / {members.length}
            </p>
            <div className='grid grid-cols-2 gap-3'>
              {members.map((member) => (
                <label
                  key={member.userId}
                  className='flex items-center gap-2 px-3 py-2'
                >
                  <input
                    className={`w-5 h-5 rounded-md
                      ${
                        member.status
                          ? 'bg-gray-900 accent-white'
                          : 'border border-gray-300 bg-white'
                      }
                    `}
                    type='checkbox'
                    checked={member.isCompleted}
                    onChange={async (e) => {
                      e.stopPropagation();
                      if (!member.isCompleted && member.accessible) {
                        alert('코드 수정을 시작하시겠습니까?');
                        await submitTeamQuest();
                      }
                    }}
                  />
                  <Link to={`/code/${team_id}/${quest_id}/${member.userId}`}>
                    <span
                      className={`w-full text-sm rounded-lg px-3 py-2 outline-none border 
          ${
            !member.status
              ? 'text-black border-gray-900'
              : 'text-gray-400 border-gray-300'
          } 
          bg-white`}
                    >
                      {member.nickname}
                    </span>
                  </Link>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className='w-7'></div>
      </div>
    </div>
  );
}
