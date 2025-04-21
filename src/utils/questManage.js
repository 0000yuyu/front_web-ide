const headers = { 'Content-Type': 'application/json' };
export async function getQuestList(teamId) {
  try {
    const response = await fetch(`/quest/${teamId}`, {
      method: 'GET',
      headers,
    });
    const dataArray = await response.json();
    return dataArray;
  } catch (error) {}
}
export async function getQuest(teamId, questId) {
  try {
    const response = await fetch(`/quest/${teamId}/${questId}`, {
      method: 'GET',
      headers,
    });
    const dataArray = await response.json();
    return dataArray;
  } catch (error) {}
}
export async function updateQuestState(teamId, questId) {
  const response = await fetch(`/quest/${teamId}/${questId}/status`, {
    method: 'POST',
    headers,
  });
  if (response.ok) return true;
  else return false;
}
