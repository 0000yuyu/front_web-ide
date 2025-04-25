import { getHeaders } from "./auth";

// 특정 티어의 팀 목록을 가져오는 비동기 함수
export async function getTeamList(tier) {
  try {
    // 서버에 GET 요청을 보내 해당 티어의 팀 목록 조회
    const response = await fetch("/api/team/list/" + tier);
    // 응답 데이터를 JSON으로 파싱
    const dataArray = await response.json();

    // 팀 목록 반환
    return dataArray;
  } catch (error) {
    // 오류 발생 시 콘솔에 로그 출력
    console.log(error);
  }
  // 오류 발생 시 빈 배열 반환
  return [];
}

// 새로운 팀을 생성하는 비동기 함수
export async function createTeam(form) {
  // 서버에 POST 요청을 보내 새 팀 생성
  const response = await fetch("/api/team", {
    method: "POST",
    headers: getHeaders(),
    // 폼 데이터를 JSON 문자열로 변환하여 요청 본문에 포함
    body: JSON.stringify({
      ...form,
    }),
  });

  // 요청 성공 여부에 따라 boolean 값 반환
  if (response.ok) return true;
  else return false;
}

// 특정 팀의 상세 정보를 가져오는 비동기 함수
export async function getTeam(team_id) {
  try {
    // 서버에 GET 요청을 보내 특정 팀 조회
    const response = await fetch(`/api/team/${team_id}`, {
      headers: getHeaders(),
    });
    // 응답 데이터를 JSON으로 파싱
    const data = await response.json();
    // 팀 상세 정보 반환
    return data;
  } catch (error) {
    // 오류 발생 시 콘솔에 로그 출력
    console.log(error);
  }
}

// 특정 팀의 멤버 목록을 가져오는 비동기 함수
export async function getTeamMembers(team_id) {
  console.log(team_id);
  try {
    // 서버에 GET 요청을 보내 특정 팀의 멤버 목록 조회
    const response = await fetch(`/api/team/${team_id}/member`, {
      headers: getHeaders(),
    });
    // 응답 데이터를 JSON으로 파싱
    const data = await response.json();
    // 팀 멤버 목록 반환
    return data;
  } catch (error) {
    // 오류 발생 시 콘솔에 로그 출력
    console.log(error);
  }
}

// 특정 팀에 가입하는 비동기 함수
export async function joinTeam(team_id) {
  try {
    // 서버에 POST 요청을 보내 팀 가입
    const response = await fetch(`/api/team/${team_id}/join`, {
      method: "POST",
      headers: getHeaders(),
    });
    // 요청 성공 여부에 따라 boolean 값 반환
    if (response.ok) return true;
    else return false;
  } catch (error) {
    // 오류 발생 시 콘솔에 로그 출력
    console.log(error);
  }
}
