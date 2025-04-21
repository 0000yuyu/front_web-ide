const headers = { 'Content-Type': 'application/json' };

export async function getTeamList(tier) {
  try {
    const response = await fetch('/team/list/' + tier);
    const dataArray = await response.json();
    return dataArray;
  } catch (error) {
    console.log(error);
  }
  return [];
}
export async function createTeam(form) {
  const response = await fetch('/team', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...form,
    }),
  });
  if (response.ok) return true;
  else return false;
}
export async function getTeam(teamId) {
  try {
    const response = await fetch(`/team/${teamId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getTeamMembers(teamId) {
  try {
    const response = await fetch(`/team/${teamId}/member`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function joinTeam(teamId) {
  try {
    const response = await fetch(`/team/${teamId}/join`, {
      method: 'POST',
      headers,
    });
    if (response.ok) return true;
    else return false;
  } catch (error) {}
}
