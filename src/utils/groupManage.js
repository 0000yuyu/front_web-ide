const headers = { 'Content-Type': 'application/json' };

export async function getGroupList(tier) {
  try {
    const response = await fetch('/team/list/' + tier);
    const dataArray = await response.json();
    return dataArray;
  } catch (error) {
    console.log(error);
  }
  return [];
}
export async function createGroup(form) {
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
const runTest = async (type) => {
  try {
    if (type === 'createTeam') {
      const res = await fetch('/team', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          teamName: form.teamName,
          teamTier: form.teamTier,
          member: parseInt(form.member),
          dueDate: form.dueDate,
          teamDescription: form.teamDescription,
        }),
      });
      const data = await res.json();
      updateResult('createTeam', { status: res.status, ...data });
    }
    if (type === 'joinTeam') {
      const res = await fetch('/team/join', {
        method: 'POST',
        headers,
        body: JSON.stringify({ teamId: form.teamId, userId: form.userId }),
      });
      const data = await res.json();
      updateResult('joinTeam', { status: res.status, ...data });
    }
    if (type === 'teamMembers') {
      const res = await fetch(`/team/${form.teamId}/member`);
      const data = await res.json();
      updateResult('teamMembers', { status: res.status, data });
    }
    if (type === 'teamInfo') {
      const res = await fetch(`/team/${form.teamId}`);
      const data = await res.json();
      updateResult('teamInfo', { status: res.status, data });
    }
  } catch (err) {
    updateResult(type, { status: 'error', message: err.message });
  }
};
