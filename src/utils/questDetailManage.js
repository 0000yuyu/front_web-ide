import { getHeaders } from './auth';

// 특정 팀의 퀘스트 목록을 가져오는 비동기 함수
export async function getTeamMembers(team_id) {
  try {
    // 팀원 목록 조회
    const response = await fetch(`/api/team/${team_id}/member`, {
      method: 'GET',
      headers: getHeaders(),
    });

    // 응답 데이터를 JSON으로 파싱
    const dataArray = await response.json();
    // 퀘스트 목록 반환
    return dataArray;
  } catch (error) {
    // 오류 발생 시 콘솔에 로그 출력
    console.log(error);
  }
}
// 특정 퀘스트의 상세 정보를 가져오는 비동기 함수
export async function getQuest(team_id, quest_id) {
  try {
    // 서버에 GET 요청을 보내 특정 퀘스트 조회
    const response = await fetch(`/api/quest/${team_id}/${quest_id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    // 응답 데이터를 JSON으로 파싱
    const dataArray = await response.json();

    // 퀘스트 상세 정보 반환
    return dataArray;
  } catch (error) {
    // 오류 발생 시 콘솔에 로그 출력
    console.log(error);
  }
}
// 퀘스트 상태를 업데이트하는 비동기 함수
export async function getQuestStates(team_id, quest_id) {
  // 서버에 POST 요청을 보내 퀘스트 상태 변경
  const response = await fetch(`/api/quest/status/${team_id}/${quest_id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  // 요청 성공 여부에 따라 boolean 값 반환
  if (response.ok) return await response.json();
  else return [];
}
export async function submitQuest(quest_id) {
  // 서버에 POST 요청을 보내 퀘스트 상태 변경
  console.log(quest_id);
  const response = await fetch(`/api/submission`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      quest_id,
      is_completed: true,
    }),
  });
  // 요청 성공 여부에 따라 boolean 값 반환
  if (response.ok) return response;
  else return [];
}
// 새로운 퀘스트를 생성하는 비동기 함수
export async function createQuest(form) {
  const response = await fetch('/api/quest', {
    method: 'POST',
    headers: getHeaders(),

    body: JSON.stringify({
      ...form,
    }),
  });

  if (response.ok) return true;
  else {
    const error = await response.text();
    console.error('퀘스트 생성 실패:', error);
    return false;
  }
}
