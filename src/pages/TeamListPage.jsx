import React, { useEffect, useState } from "react";
import { useModalStore } from "./TeamStore"; // 모달 상태 관리를 위한 훅
import { userDataStore } from "@/store/userDataStore"; // 사용자 데이터 저장소
import { Link, useNavigate } from "react-router-dom"; // 라우터 링크 컴포넌트
import { createTeam, getTeamList, joinTeam } from "@/utils/teamManage"; // 팀 관리 함수
import { checkIdDuplicate } from "@/utils/userManage";

export default function TeamListPage() {
  const { isOpen, toggle } = useModalStore(); // 모달 상태와 토글 함수
  const { tier } = userDataStore(); // 사용자 티어 정보

  const [form, setForm] = useState({
    team_name: "",
    team_description: "",
    team_tier: tier,
    max_member: "",
  }); // 팀 생성 폼 상태

  const [teams, setTeams] = useState([]); // 팀 목록 상태

  // 티어가 바뀔 때마다 그룹 리스트 가져오기
  useEffect(() => {
    const fetchGroupListAsync = async () => {
      try {
        const array = await getTeamList(tier); // 사용자의 티어에 맞는 팀 목록을 비동기적으로 가져옵니다.
        setTeams(array); // 가져온 팀 목록을 상태에 업데이트합니다.
        console.log(array); // 성공적으로 가져온 팀 목록을 콘솔에 로그로 출력합니다.
      } catch (error) {
        console.log(error); // 팀 목록을 가져오는 과정에서 발생한 오류를 콘솔에 로그로 출력합니다.
      }
    };
    fetchGroupListAsync();
  }, [tier]);

  // 코드 설명: handleChange 함수는 input 요소의 변경을 감지하고, 해당 변경된 값을 form 상태에 업데이트합니다.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleCreateTeam(event) {
    event.preventDefault(); // 폼 제출 방지

    // 데이터 유효성 검사
    if (!form.team_name) {
      alert("팀 이름을 입력해주세요");
      return;
    }
    if (!form.max_member) {
      alert("팀원수를 선택해주세요");
      return;
    }
    if (!form.team_description) {
      alert("팀 설명을 입력해주세요");
      return;
    }

    try {
      const success = await createTeam(form); // 팀 생성 시도

      if (success) {
        await getTeamList(tier); // 성공 시 팀 목록 새로고침

        setForm({
          team_name: "",
          team_description: "",
          team_tier: "",
          max_member: "",
        });
      } else {
        throw new Error("팀 생성 실패");
      }
      toggle(); // 모달 닫기
    } catch (error) {
      alert(error.message); // 오류 메시지 알림
    }
  }

  ///

  function CreateTeamModal({ form, handleChange, handleCreateTeam }) {
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
          <Section title="팀 생성">
            팀이름: <Input name="team_name" placeholder="팀 이름" />
            팀원 수:
            <Input name="max_member" placeholder="팀원 수" type="number" />
            팀 설명: <Input name="team_description" placeholder="팀 설명" />
            <button
              className="bg-base1 text-white px-4 py-1 rounded"
              onClick={handleCreateTeam}
            >
              팀 생성
            </button>
          </Section>
        </div>
      </div>
    );
  }

  function TeamList({ teams }) {
    const navigate = useNavigate();

    async function handleJoin(team_id) {
      const success = await joinTeam(team_id);

      if (success) {
        alert("팀에 참여했습니다!");
        navigate(`/team/${team_id}`);
      } else {
        alert("팀 참여에 실패했습니다.");
      }
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-4">
        {teams.map((team) => (
          <div
            key={team.team_name}
            className="rounded-xl shadow-md bg-white p-4 flex flex-col justify-between"
          >
            <h3 className="items-right text-lg font-semibold mb-2">
              {team.team_name}
            </h3>
            <p className="text-sm mb-1">문제 수 : {team.team_quest ?? 0}개</p>
            <p className="text-sm mb-1">
              인원 : {team.currnet_member_count}/{team.max_member}
            </p>
            <p className="text-sm mb-3">등급: {team.tier}</p>

            {team.is_join ? (
              <Link
                to={`/team/${team.team_id}`}
                className="bg-base2 text-white py-1 px-4 rounded text-center block"
              >
                이동
              </Link>
            ) : team.max_member <= team.currnet_member_count ? (
              <button
                disabled
                className="bg-base1 text-white py-1 px-4 rounded opacity-50 cursor-not-allowed"
              >
                마감
              </button>
            ) : (
              <button
                onClick={() => handleJoin(team.team_id)}
                className="bg-base1 text-white py-1 px-4 rounded text-center block hover:bg-base2 transition"
              >
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
      <div className="flex items-start justify-stretch bg-oklch(98.5% 0 0)">
        <div className="flex-1 p-6 pt-0 min-h-screen justify-items-stretch">
          <div>
            <button
              onClick={toggle}
              className="bg-[#2D336B] text-white px-3 py-1 rounded text-sm"
            >
              팀 생성
            </button>

            {isOpen && (
              <CreateTeamModal
                form={form}
                handleChange={handleChange}
                handleCreateTeam={handleCreateTeam}
              />
            )}
            <TeamList teams={teams} />
          </div>
        </div>
      </div>
    </>
  );
}
