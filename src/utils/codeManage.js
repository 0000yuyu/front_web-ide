import { getHeaders } from './auth';

export async function getCodeList(quest_id, user_id) {
  const res = await fetch(`/api/code/${quest_id}/${user_id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json();
  return data ?? [];
}

export async function addFolder({ team_id, quest_id, parent_id, folder_name }) {
  try {
    console.log(team_id, quest_id, parent_id, folder_name);
    const res = await fetch(`/api/code/${team_id}/${quest_id}/folder`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        team_id,
        quest_id,
        parent_id: parent_id == -1 ? null : parent_id,
        folder_name,
      }),
    });
    console.log(res);
    const data = await res.json();
    return { status: res.status, ...data };
  } catch (error) {
    console.log(error);
  }
}

export async function addFile({
  team_id,
  quest_id,
  folder_id,
  file_name,
  language,
}) {
  try {
    console.log('파일 추가', team_id, quest_id, folder_id);
    const res = await fetch(`/api/code/${team_id}/${quest_id}/file`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        folder_id: folder_id == -1 ? null : folder_id,
        file_name,
        language,
      }),
    });
    const data = await res.json();
    return { status: res.status, ...data };
  } catch (error) {
    console.log(error);
  }
}

export async function editFile({
  team_id,
  quest_id,
  folder_id,
  file_name,
  language,
  file_id,
  code_context,
}) {
  console.log(team_id, quest_id, file_name, language, file_id, code_context);
  const res = await fetch(`/api/code/${team_id}/${quest_id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      file_id,
      folder_id,
      file_name,
      code_context,
    }),
  });
  const data = await res.json();
  return { status: res.status, ...data };
}

export async function runCode(code_content, language) {
  const res = await fetch('/api/code/run', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      code_context: code_content,
      language,
    }),
  });
  const data = await res.json();
  return { status: res.status, ...data };
}

// 문제 접근 확인
export async function accessCode(team_id, quest_id, user_id) {
  const response = await fetch(
    `/api/quest/access/${team_id}/${quest_id}/${user_id}`,
    {
      headers: getHeaders(),
    }
  );
  const data = await response.json();
  return data.accessible;
}
