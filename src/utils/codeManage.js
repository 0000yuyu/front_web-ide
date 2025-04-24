import { getHeaders } from './auth';

export async function getCodeList(quest_id, user_id) {
  const res = await fetch(`/api/code/${quest_id}/${user_id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const data = await res.json();
  return data ?? [];
}

export async function addFolder(team_id, quest_id, parent_id, folder_name) {
  try {
    const res = await fetch(`/api/code/${team_id}/${quest_id}/folder`, {
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
    const res = await fetch(`/api/code/${team_id}/${quest_id}/file`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
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
