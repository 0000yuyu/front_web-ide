import { getHeaders } from './auth';

export async function getCodeList(team_id, quest_id, user_id) {
  const res = await fetch(`/api/code/${quest_id}/${user_id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json();
  return data ?? [];
}

export async function addFolder(team_id, quest_id, parent_id, folder_name) {
  try {
    const res = await fetch(`/api/code/folder`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        team_id,
        quest_id,
        parent_id,
        folder_name,
      }),
    });
    const data = await res.json();
    return { status: res.status, ...data };
  } catch (error) {
    console.log(error);
  }
}

export async function addFile(
  team_id,
  quest_id,
  folder_id,
  file_name,
  language
) {
  try {
    const res = await fetch(`/api/code/file`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        team_id,
        quest_id,
        folder_id,
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

export async function editFile(
  team_id,
  quest_id,
  folder_id,
  file_name,
  language,
  file_id,
  code_content
) {
  console.log(
    team_id,
    quest_id,
    folder_id,
    file_name,
    language,
    file_id,
    code_content
  );
  const res = await fetch(`/api/code`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      team_id,
      quest_id,
      language,
      folder_id,
      file_id,
      file_name,
      code_content,
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
export async function updateQuestState(
  team_id,
  quest_id,
  status = 'COMPLETED'
) {
  const response = await fetch(`/api/code/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({
      team_id,
      quest_id,
      quest_status: status,
    }),
  });
  if (response.ok) return true;
  else return false;
}
export async function getQuest(team_id, quest_id) {
  try {
    const response = await fetch(`/api/quest/${team_id}/${quest_id}`, {
      method: 'GET',
      headers: getHeaders,
    });
    const dataArray = await response.json();
    return dataArray;
  } catch (error) {
    console.log(error);
  }
}
