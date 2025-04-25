import React, { useState, useEffect } from "react";
import { useModalStore } from "./TeamStore"; // 모달 상태 관리를 위한 훅
import { Link, useParams } from "react-router-dom"; // URL 파라미터 추출 및 링크 생성을 위한 훅
import { getTeam, getTeamMembers } from "@/utils/teamManage"; // 팀 정보 및 멤버 목록을 가져오는 함수
import { getQuestList, createQuest } from "@/utils/questManage"; // 문제 목록을 가져오거나 새로운 문제를 생성하는 함수
import ChatBox from "@/components/ChatBox"; // 채팅 박스 컴포넌트

export default function TeamMainPage() {
  const { isOpen, toggle } = useModalStore(); // 모달 상태 및 토글 함수

  const [form, setForm] = useState({
    team_id: "",
    quest_name: "",
    user_id: "",
    quest_start: "",
    quest_due: "",
    quest_link: "",
  }); // 문제 생성 폼 상태

  const [quests, setQuests] = useState([]); // 문제 목록 상태
  const { team_id } = useParams(); // URL에서 team_id 추출
  const [team, setTeam] = useState(null); // 팀 정보 상태
  const [members, setMembers] = useState([]); // 팀 멤버 목록 상태

  // 팀 정보를 가져오는 useEffect 훅
  useEffect(() => {
    // 비동기 함수를 선언하여 팀 정보를 가져옵니다.
    async function fetchTeamInfo() {
      try {
        // 팀 정보를 가져오는 함수를 호출하고, 가져온 팀 정보로 상태를 업데이트합니다.
        const teamData = await getTeam(team_id);
        //팀 정보 상태 업데이트
        setTeam(teamData);
        // 폼 상태를 업데이트합니다. 이때, team_id는 team_id로 설정합니다.
        setForm((prev) => ({ ...prev, team_id: team_id }));
      } catch (error) {
        // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
        console.error("팀 정보 로딩 실패:", error);
      }
    }
    // team_id가 존재하면 팀 정보를 가져오는 함수 호출
    if (team_id) {
      fetchTeamInfo(team_id);
    }
  }, [team_id]); // team_id가 변경될 때마다 실행됩니다.

  // 팀원 정보
  // 팀 정보를 가져오는 useEffect 훅
  useEffect(() => {
    console.log(team_id);
    // 비동기 함수를 선언하여 팀 정보를 가져옵니다.
    async function fetchMembers() {
      try {
        // 팀 정보를 가져오는 함수를 호출하고, 가져온 팀 정보로 상태를 업데이트합니다.
        const membersData = await getTeamMembers(team_id);
        console.log(membersData);
        //팀 정보 상태 업데이트
        setMembers(membersData);
      } catch (error) {
        // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
        console.error("멤버 정보 로딩 실패:", error);
      }
    }
    // team_id가 존재하면 팀 정보를 가져오는 함수 호출
    if (team_id) {
      fetchMembers(team_id);
    }
  }, [team_id]); // team_id가 변경될 때마다 실행됩니다.

  useEffect(() => {
    const fetchGroupListAsync = async () => {
      try {
        const array = await getQuestList(team_id);
        setQuests(array);
        console.log(array);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGroupListAsync();
  }, [team_id]);

  const handleChange = (e) => {
    const { name, value } = e.target; // 이벤트 대상의 이름과 값을 추출
    setForm((prev) => ({ ...prev, [name]: value })); // 폼 상태 업데이트
  };

  async function handleCreateQuest(event) {
    event.preventDefault(); // 폼 제출 방지

    if (!form.quest_name) {
      alert("문제 번호를 입력해주세요"); // 문제 번호가 입력되지 않았을 경우 경고
      return;
    }

    if (!form.quest_due) {
      alert("마감 일자를 입력해주세요"); // 마감 일자가 입력되지 않았을 경우 경고
      return;
    }

    if (!form.quest_start) {
      alert("링크를 입력해주세요"); // 링크가 입력되지 않았을 경우 경고
      return;
    }

    try {
      const success = await createQuest(form); // 새로운 문제를 생성하는 함수 호출
      if (success) {
        await fetchQuestList(); // 문제 목록을 새로 가져옴
        setForm({
          team_id: "",
          quest_name: "",
          user_id: "",
          quest_start: "",
          quest_due: "",
          quest_link: "",
        }); // 폼 상태 초기화
        toggle();
      } else {
        throw new Error("문제 생성 실패"); // 문제 생성 실패 시 오류 발생
      }
      toggle(); // 모달 토글
    } catch (error) {
      alert(error.message); // 오류 메시지 경고
    }
  }

  //함수
  function CreateQuestModal(form, handleChange, handleCreateQuest) {
    const { toggle } = useModalStore();
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
          <div key={quest.quest_id} className="p-4 border rounded shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{quest.quest_name}</h2>
              <span>{quest.quest_status}</span>
              <Link
                to={`/quest/${team_id}/${quest.quest_id}`}
                className="bg-base2 text-white py-1 px-4"
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

  return (
    <>
      <div className="flex items-start justify-stretch bg-oklch(98.5% 0 0)">
        <div className="flex-1 p-6 pt-0 min-h-screen justify-items-stretch">
          {/* 팀 정보 */}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-2">
              팀명: {team?.team_name}
            </h2>
            <p>{team?.team_tier}</p>
          </div>
          <section className="divide-x-1 h-48 max-h-48 grid grid-cols-3 gap-0 mb-6">
            <div className="col-span-2 bg-white shadow rounded-l-lg p-4">
              {/* 공지사항 */}
              <div className="text-sm text-gray-600 whitespace-pre-line">
                {team?.team_description}
              </div>
            </div>

            <div className="overflow-y-scroll bg-white shadow rounded-r-lg p-4 ">
              <h3 className="font-semibold mb-2">User list</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {members.map((member, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <img
                      alt="프로필"
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    <span className="h-2 rounded-full" />
                    {member.nickname}
                  </li>
                ))}
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
            {isOpen && (
              <CreateQuestModal
                form={form}
                handleChange={handleChange}
                handleCreateQuest={handleCreateQuest}
              />
            )}
            <ProblemList quests={quests} />
          </div>
        </div>
        {/*채팅*/}
        <div>
          <ChatBox userId="" nickname="" team_id={team_id} />
        </div>
      </div>
    </>
  );
}
