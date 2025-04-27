import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Link 제거, useNavigate 사용
import { accessCode } from '@/utils/codeManage';
import {
  getQuest,
  getQuestStates,
  submitQuest,
} from '@/utils/questDetailManage';
import Modal from '@/components/Modal'; // 모달 컴포넌트 import

export default function QuestPage() {
  const { team_id, quest_id } = useParams();
  const [members, setMembers] = useState([]);
  const [quest, setQuest] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // 퀘스트 제출 확인 모달
  const [isNoAccessModalOpen, setIsNoAccessModalOpen] = useState(false); // 권한 없음 모달
  const [currentMember, setCurrentMember] = useState(null);
  const [navigateUrl, setNavigateUrl] = useState(null); // 넘어갈 URL 저장 상태
  const navigate = useNavigate(); // useNavigate 훅으로 리디렉션 처리

  useEffect(() => {
    fetchQuest();
    getTeamMembersWithStatus();
  }, []);

  // 퀘스트 데이터 가져오기
  async function fetchQuest() {
    try {
      const questData = await getQuest(team_id, quest_id);
      setQuest(questData);
    } catch (error) {
      console.log(error);
    }
  }

  // 퀘스트 제출 함수
  async function submitTeamQuest() {
    try {
      const response = await submitQuest(quest_id);
      await getTeamMembersWithStatus();
      setIsModalOpen(false); // 모달 닫기
      // 퀘스트 제출 후, 저장된 URL로 이동
      window.location.reload('/');
    } catch (error) {
      console.log(error);
    }
  }

  // 팀 멤버 상태 가져오기
  async function getTeamMembersWithStatus() {
    const members = await getQuestStates(team_id, quest_id);
    const membersWithStatus = await Promise.all(
      members.map(async (member) => {
        const accessible = await accessCode(team_id, quest_id, member.userId);
        return {
          ...member,
          accessible,
        };
      })
    );
    setMembers(membersWithStatus);
  }

  const totalScore = members?.filter((user) => user.isCompleted).length;

  // 멤버 클릭 시 처리 함수
  const handleMemberChange = async (e, member) => {
    e.stopPropagation();
    if (!member.isCompleted && member.accessible) {
      // 권한이 있는 경우, 퀘스트 제출 확인 모달을 열기
      setCurrentMember(member); // 현재 멤버 정보 저장
      setNavigateUrl(`/code/${team_id}/${quest_id}/${member.userId}`); // 이동할 URL 저장
      setIsModalOpen(true); // 모달 열기
    } else if (!member.accessible) {
      // 권한이 없는 경우, 권한 없음 모달을 열기
      setIsNoAccessModalOpen(true);
    }
  };

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
                <a href={`https://${quest.quest_link}`}>{quest.quest_link}</a>
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
                  className='flex items-center gap-2 px-3 py-2 cursor-pointer'
                  onClick={(e) => {
                    if (member.accessible && !member.isCompleted)
                      handleMemberChange(e, member);
                    else
                      navigate(`/code/${team_id}/${quest_id}/${member.userId}`);
                  }} // 링크 클릭 대신 클릭 이벤트 사용
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
                    readOnly
                  />
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
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className='w-7'></div>
      </div>

      {/* 권한 없음 모달 */}
      {isNoAccessModalOpen && (
        <Modal
          title='권한이 없습니다.'
          onClose={() => setIsNoAccessModalOpen(false)}
        >
          <div className='text-center'>
            <p>이 사용자는 퀘스트에 접근할 권한이 없습니다.</p>
            <button
              className='bg-gray-300 text-black px-4 py-2 rounded mt-4'
              onClick={() => setIsNoAccessModalOpen(false)}
            >
              닫기
            </button>
          </div>
        </Modal>
      )}

      {/* 퀘스트 제출 모달 */}
      {isModalOpen && (
        <Modal
          title='코드 수정을 시작하시겠습니까?'
          onClose={() => setIsModalOpen(false)}
        >
          <div className='flex gap-4'>
            <button
              className='bg-blue-600 text-white px-4 py-2 rounded'
              onClick={() => {
                submitTeamQuest();
              }}
            >
              예
            </button>
            <button
              className='bg-gray-300 text-black px-4 py-2 rounded'
              onClick={() => setIsModalOpen(false)}
            >
              아니오
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
