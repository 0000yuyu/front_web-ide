import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTeam, getTeamMembers } from '@/utils/teamManage';
import { getQuestList, createQuest } from '@/utils/questManage';
import ChatBox from '@/components/ChatBox';
import Modal from '@/components/Modal';
import { PiMedalMilitaryDuotone } from 'react-icons/pi';
import { userDataStore } from '@/store/userDataStore';

const color = (tier) => {
  if (tier.includes('BRONZE')) return 'bg-black text-orange-800';
  if (tier.includes('SILVER')) return 'text-slate-800';
  if (tier.includes('GOLD')) return 'text-yellow-600';
  else return 'text-error';
};

// Input 컴포넌트
function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  message,
  name,
}) {
  return (
    <div className='flex gap-4 mb-4'>
      {label && (
        <label className='flex-1 text-sm font-bold' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          className={`shadow appearance-none border w-[250px] ${
            message?.type === 'error' ? 'border-error' : ''
          } rounded p-[5px] px-10 leading-tight focus:outline-none focus:shadow-outline`}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
        />
        {message && (
          <span
            className={`${
              message?.type === 'error' ? 'text-error' : 'text-green-500'
            } text-sm mt-1 absolute left-0 bottom-[-20px]`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}

// InputForm 컴포넌트
const InputForm = ({
  form,
  handleChange,
  handleCreateQuest,
  handleClose,
  errorMessages,
}) => {
  return (
    <div className='flex-col flex gap-5'>
      <Input
        id='quest_name'
        label='문제 이름'
        placeholder='문제 이름을 입력하세요'
        value={form.quest_name}
        name='quest_name'
        onChange={handleChange}
        message={errorMessages.quest_name}
      />
      <Input
        id='quest_start'
        label='시작일'
        type='date'
        value={form.quest_start}
        name='quest_start'
        onChange={handleChange}
        message={errorMessages.quest_start}
      />
      <Input
        id='quest_due'
        label='마감일'
        type='date'
        value={form.quest_due}
        name='quest_due'
        onChange={handleChange}
        message={errorMessages.quest_due}
      />
      <Input
        id='quest_link'
        label='문제 링크'
        placeholder='문제 링크를 입력하세요'
        value={form.quest_link}
        name='quest_link'
        onChange={handleChange}
      />
      <div className='flex gap-3'>
        <button
          onClick={handleCreateQuest}
          className='w-full bg-base1 text-white py-2 rounded'
        >
          문제 생성
        </button>
        <button
          className='w-full bg-transparent2 rounded'
          onClick={handleClose}
        >
          취소
        </button>
      </div>
    </div>
  );
};

// ProblemList 컴포넌트
const ProblemList = ({ quests }) => {
  return (
    <div className='grid grid-cols-2 gap-4 mt-4'>
      {quests.map((quest) => (
        <div
          key={quest.quest_id}
          className='flex flex-col  gap-2 p-4 border rounded shadow-sm'
        >
          <div className='flex justify-between items-center'>
            <h2 className='font-semibold'>{quest.quest_name}</h2>
            <span>{quest.quest_status}</span>
          </div>
          <p className='text-sm mt-2'>인원: {quest.teamSize}</p>
          <p className='text-sm'>마감일: {quest.quest_due}</p>
          <Link
            to={`/quest/${quest.team_id}/${quest.quest_id}`}
            className='w-full rounded-lg  bg-base2 text-white p-2 text-center'
          >
            이동
          </Link>
        </div>
      ))}
    </div>
  );
};

// TeamMainPage 컴포넌트
export default function TeamMainPage() {
  const [is_open, set_open] = useState(false);
  const [isCreated, setIsCreated] = useState(false); // 문제 생성 완료 상태
  const { team_id } = useParams();

  const { tier } = userDataStore();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [quests, setQuests] = useState([]);
  const [form, setForm] = useState({
    team_id: '',
    quest_name: '',
    quest_start: '',
    quest_due: '',
    quest_link: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    quest_name: null,
    quest_start: null,
    quest_due: null,
  });

  useEffect(() => {
    if (!team_id) return;
    async function fetchTeam() {
      const teamData = await getTeam(team_id);
      setTeam(teamData);
      setForm((prev) => ({ ...prev, team_id: team_id }));
    }
    fetchTeam();
  }, [team_id]);

  useEffect(() => {
    if (!team_id) return;
    async function fetchMembers() {
      const membersData = await getTeamMembers(team_id);
      setMembers(membersData);
      console.log(membersData);
    }
    fetchMembers();
  }, [team_id]);

  useEffect(() => {
    if (!team_id) return;
    async function fetchQuests() {
      const questsData = await getQuestList(team_id);
      setQuests(questsData);
    }
    fetchQuests();
  }, [team_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateQuest = async () => {
    // 필수 필드 검사
    const errors = {};
    if (!form.quest_name)
      errors.quest_name = { type: 'error', text: '문제 이름을 입력해주세요.' };
    if (!form.quest_start)
      errors.quest_start = { type: 'error', text: '시작일을 입력해주세요.' };
    if (!form.quest_due)
      errors.quest_due = { type: 'error', text: '마감일을 입력해주세요.' };

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      return; // 에러가 있으면 실행되지 않음
    }

    try {
      const success = await createQuest(form);
      if (success) {
        const questsData = await getQuestList(team_id);
        setQuests(questsData);
        setForm({
          team_id: '',
          quest_name: '',
          quest_start: '',
          quest_due: '',
          quest_link: '',
        });
        setIsCreated(true); // 문제 생성 완료 상태 변경
        set_open(false); // 문제 생성 모달 닫기
      }
    } catch (error) {
      console.error(error);
      alert('문제 생성 실패');
    }
  };

  const handleClose = () => {
    set_open(false);
    setErrorMessages({});
    setIsCreated(false); // 문제 생성 완료 상태 리셋
  };

  return (
    <div className='flex max-md:flex-col items-start bg-gray-100'>
      <div className='flex-1 p-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold'>팀명: {team?.team_name}</h2>
          <p className='text-gray-600'>{team?.team_tier}</p>
        </div>

        <section className='flex max-lg:flex-col gap-4 my-6'>
          <div className='overflow-x-auto bg-white rounded-lg shadow-md p-3'>
            <table className='min-w-full table-auto border-collapse'>
              <tbody>
                <tr>
                  <td className='border-r border-transparent1 px-4 py-2'>
                    팀 이름
                  </td>
                  <td className='px-4 py-2'>{team?.team_name}</td>
                </tr>
                <tr>
                  <td className='border-r border-transparent1 px-4 py-2'>
                    팀 소개
                  </td>
                  <td className=' px-4 py-2'>{team?.team_description}</td>
                </tr>
                <tr>
                  <td className='border-r border-transparent1 px-4 py-2'>
                    팀 등급
                  </td>
                  <td className=' px-4 py-2'>{tier}</td>
                </tr>
                <tr>
                  <td className='border-r border-transparent1 px-4 py-2'>
                    인원
                  </td>
                  <td className='px-4 py-2'>
                    {team?.max_member} / {team?.current_member_count}
                  </td>
                </tr>
                <tr>
                  <td className='border-r border-transparent1 px-4 py-2'>
                    팀장
                  </td>
                  <td className='px-4 py-2'>{team?.leader_nickname}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='bg-white p-4 shadow-md rounded-lg h-48'>
            <h3 className='font-semibold mb-2'>팀원 목록</h3>
            <ul className='space-y-2'>
              {members.map((member, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-2 p-2 ${color(tier)}`}
                >
                  <PiMedalMilitaryDuotone size={30} />
                  {member.nickname}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>문제 목록</h2>
          <button
            onClick={() => set_open(true)}
            className='bg-base1 text-white px-4 py-2 rounded-md'
          >
            문제 생성
          </button>
        </div>

        {/* 문제 생성 완료 모달 */}
        {isCreated && (
          <Modal title='문제 생성 완료' onClose={handleClose}>
            <p>문제가 성공적으로 생성되었습니다!</p>
            <button
              onClick={handleClose}
              className='bg-base1 text-white py-2 px-4 rounded mt-4'
            >
              확인
            </button>
          </Modal>
        )}

        {is_open && (
          <Modal title='문제 생성' onClose={handleClose}>
            <InputForm
              form={form}
              handleChange={handleChange}
              handleCreateQuest={handleCreateQuest}
              handleClose={handleClose}
              errorMessages={errorMessages}
            />
          </Modal>
        )}

        <ProblemList quests={quests} />
      </div>

      <div className='w-[400px]'>
        <ChatBox userId='' nickname='' team_id={team_id} />
      </div>
    </div>
  );
}
