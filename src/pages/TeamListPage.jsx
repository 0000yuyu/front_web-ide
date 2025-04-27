import React, { useEffect, useState } from 'react';
import { useModalStore } from './TeamStore'; // 모달 상태 관리를 위한 훅
import { userDataStore } from '@/store/userDataStore'; // 사용자 데이터 저장소
import { Link } from 'react-router-dom'; // 라우터 링크 컴포넌트
import { createTeam, getTeamList, joinTeam } from '@/utils/teamManage'; // 팀 관리 함수
import Modal from '@/components/Modal';
import { getUserData } from '@/utils/userManage';

function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  inputRef,
  message,
  name,
  isTextArea = false, // textArea 여부를 위한 prop 추가
}) {
  return (
    <div className='flex gap-4 mb-4'>
      {label && (
        <label className='text-sm font-bold' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='relative'>
        {isTextArea ? (
          <textarea
            ref={inputRef}
            className={`shadow appearance-none border ${
              message?.type == 'error' && 'border-error'
            } rounded p-[5px] px-12 h-[100px] leading-tight focus:outline-none focus:shadow-outline`}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
          />
        ) : (
          <input
            ref={inputRef}
            className={`shadow appearance-none border ${
              message?.type == 'error' && 'border-error'
            } rounded p-[5px] px-10 leading-tight focus:outline-none focus:shadow-outline`}
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
          />
        )}
        {message && (
          <span
            className={`${
              message?.type == 'error' ? 'text-error' : 'text-green-500'
            } text-sm mt-1 absolute border-error left-0 bottom-[-20px]`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
export default function TeamListPage() {
  const [is_open, set_open] = useState(false);
  const [modal_content, set_modal_content] = useState({});
  const { tier, team_id, setUserProfile } = userDataStore(); // 사용자 티어 정보

  const [form, setForm] = useState({
    team_name: '',
    team_description: '',
    team_tier: tier,
    max_member: '',
  }); // 팀 생성 폼 상태

  const [messages, setMessages] = useState({
    team_name: '',
    max_member: '',
    team_description: '',
  }); // 각 입력 필드의 오류 메시지 상태

  const [teams, setTeams] = useState([]); // 팀 목록 상태

  useEffect(() => {
    const fetchGroupListAsync = async () => {
      try {
        const array = await getTeamList();
        setTeams(array);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGroupListAsync();
  }, []);

  // handleChange: 입력 필드 값 업데이트 및 오류 메시지 초기화
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessages((prev) => ({ ...prev, [name]: null }));
  };

  // 팀 생성 처리
  async function handleCreateTeam(event) {
    event.preventDefault();
    let formErrors = {};

    if (!form.team_name) formErrors.team_name = '팀 이름을 입력해주세요.';
    if (!form.max_member) formErrors.max_member = '팀원 수를 입력해주세요.';
    if (!form.team_description)
      formErrors.team_description = '팀 설명을 입력해주세요.';

    if (Object.keys(formErrors).length > 0) {
      setMessages(formErrors);
      return;
    }

    try {
      const success = await createTeam(form);
      if (success) {
        await getTeamList(tier);
        setForm({
          team_name: '',
          team_description: '',
          team_tier: '',
          max_member: '',
        });
        set_open(false);
        set_modal_content({
          type: 'success',
          message: '팀이 성공적으로 생성되었습니다!',
        });
      } else {
        throw new Error('팀 생성 실패');
      }
    } catch (error) {
      set_modal_content({ type: 'error', message: '팀 생성에 실패했습니다.' });
    }
  }

  // 팀 목록
  function TeamList({ teams }) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-4'>
        {teams.map((team) => (
          <div
            key={team.team_name}
            className='rounded-xl shadow-md bg-white p-4 flex flex-col justify-between'
          >
            <h3 className='items-right text-lg font-semibold mb-2'>
              {team.team_name}
            </h3>
            <p className='text-sm mb-1'>문제 수 : {team.team_quest ?? 0}개</p>
            <p className='text-sm mb-1'>
              인원 : {team.currnet_member_count}/{team.max_member}
            </p>
            <p className='text-sm mb-3'>등급: {team.tier}</p>

            {team.team_id === team_id ? (
              <Link
                to={`/team/${team.team_id}`}
                className='bg-base2 text-white py-1 px-4 rounded text-center block'
              >
                이동
              </Link>
            ) : team.max_member <= team.currnet_member_count ? (
              <button
                disabled
                className='bg-base1 text-white py-1 px-4 rounded opacity-50 cursor-not-allowed'
              >
                마감
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!team_id) {
                    set_open(true);
                    set_modal_content({
                      type: 'join_team',
                      title: team.team_name,
                      team_id: team.team_id,
                    });
                  } else {
                    set_open(true);
                    set_modal_content({
                      type: 'error',
                      message: '하나의 팀에만 가입 가능합니다.',
                    });
                  }
                }}
                className='bg-base1 text-white py-1 px-4 rounded text-center block hover:bg-base2 transition'
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
      <div className='flex items-start justify-stretch bg-oklch(98.5% 0 0)'>
        <div className='mt-3 flex-1 p-6 pt-0 min-h-screen justify-items-stretch'>
          <button
            onClick={() => {
              set_open(true);
              set_modal_content({ type: 'create_team' });
            }}
            className='bg-[#2D336B] text-white px-10 py-5 rounded text-xl'
          >
            팀 생성
          </button>

          {is_open && modal_content.type === 'create_team' && (
            <Modal title='팀 생성' onClose={() => set_open(false)}>
              <form onSubmit={handleCreateTeam} className='flex flex-col gap-5'>
                <Input
                  id='team_name'
                  name='team_name'
                  label='팀 이름'
                  type='text'
                  placeholder='팀 이름을 입력하세요'
                  value={form.team_name}
                  message={
                    messages.team_name && {
                      type: 'error',
                      text: messages.team_name,
                    }
                  }
                  onChange={handleChange}
                />
                <Input
                  id='max_member'
                  label='팀원 수'
                  type='number'
                  placeholder='팀원 수를 입력하세요'
                  value={form.max_member}
                  name='max_member'
                  message={
                    messages.max_member && {
                      type: 'error',
                      text: messages.max_member,
                    }
                  }
                  onChange={handleChange}
                />
                <Input
                  isTextArea={true}
                  id='team_description'
                  name='team_description'
                  label='팀 설명'
                  type='text'
                  placeholder='팀 설명을 입력하세요'
                  value={form.team_description}
                  message={
                    messages.team_description && {
                      type: 'error',
                      text: messages.team_description,
                    }
                  }
                  onChange={handleChange}
                />
                <div className='flex gap-3'>
                  <button
                    type='submit'
                    className='w-full bg-base1 text-white py-2 rounded'
                  >
                    팀 생성
                  </button>
                  <button
                    className='w-full bg-transparent2 rounded'
                    onClick={() => set_open(false)}
                  >
                    취소
                  </button>
                </div>
              </form>
            </Modal>
          )}

          {is_open && modal_content.type === 'join_team' && (
            <Modal title='팀 가입 요청' onClose={() => set_open(false)}>
              <span>
                <strong>팀 {modal_content.title}</strong>에 가입하시겠습니까?
              </span>
              <button
                className='w-full bg-base1 text-white p-2 rounded'
                onClick={async () => {
                  const success = await joinTeam(modal_content.team_id);
                  if (success) {
                    const userData = await getUserData();
                    setUserProfile(userData);
                    set_modal_content({
                      type: 'success',
                      message: '팀에 성공적으로 가입되었습니다.',
                    });
                  } else {
                    set_modal_content({
                      type: 'error',
                      message: '팀 가입에 실패했습니다.',
                    });
                  }
                }}
              >
                가입
              </button>
            </Modal>
          )}

          {is_open && modal_content.type === 'success' && (
            <Modal title='성공' onClose={() => set_open(false)}>
              <p>{modal_content.message}</p>
            </Modal>
          )}

          {is_open && modal_content.type === 'error' && (
            <Modal title='오류' onClose={() => set_open(false)}>
              <p>{modal_content.message}</p>
            </Modal>
          )}

          <TeamList teams={teams} />
        </div>
      </div>
    </>
  );
}
