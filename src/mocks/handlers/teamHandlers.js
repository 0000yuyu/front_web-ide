import { http, HttpResponse } from 'msw';
import { teams } from '../data/teams';
import { users } from '../data/users';

let teamIdCounter = 2; // 이미 teamId: 1 있음

export const teamHandlers = [
  // 팀 리스트 조회
  http.get('/team/list', () => {
    const result = teams.map((team) => ({
      teamName: team.teamName,
      teamQuest: team.quests.length,
      currnet_member_count: team.members.length,
      maxMember: team.maxMember,
      dueDate: team.dueDate,
    }));
    return HttpResponse.json(result);
  }),
  // 팀 생성
  http.post('/team', async ({ request }) => {
    const { teamName, teamTier, member, dueDate, teamDescription } =
      await request.json();

    const newTeam = {
      teamId: teamIdCounter++,
      teamName,
      teamTier,
      teamDescription,
      maxMember: member,
      dueDate,
      members: [],
      quests: [],
    };

    teams.push(newTeam);
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // 팀 정보 조회
  http.get('/team/:teamId', ({ params }) => {
    const team = teams.find((t) => t.teamId === Number(params.teamId));
    if (!team)
      return HttpResponse.json(
        { message: '팀이 존재하지 않음' },
        { status: 404 }
      );

    const { teamName, teamTier, teamDescription } = team;
    return HttpResponse.json({ teamName, teamTier, teamDescription });
  }),

  // 팀원 목록 조회
  http.get('/team/:teamId/member', ({ params }) => {
    const team = teams.find((t) => t.teamId === Number(params.teamId));
    if (!team)
      return HttpResponse.json(
        { message: '팀이 존재하지 않음' },
        { status: 404 }
      );

    const members = team.members
      .map((userId) => {
        const user = users.find((u) => u.userId === userId);
        return user ? { userId: user.userId, nickname: user.nickname } : null;
      })
      .filter(Boolean);

    return HttpResponse.json(members);
  }),

  // 팀 참가
  http.post('/team/join', async ({ request }) => {
    const { teamId, userId } = await request.json();
    const team = teams.find((t) => t.teamId === Number(teamId));
    const user = users.find((u) => u.userId === userId.toString());

    if (!team || !user)
      return HttpResponse.json(
        { success: false, message: '유저 또는 팀 없음' },
        { status: 404 }
      );

    if (team.members.includes(userId))
      return HttpResponse.json(
        { success: false, message: '이미 가입됨' },
        { status: 409 }
      );

    if (team.members.length >= team.maxMember)
      return HttpResponse.json(
        { success: false, message: '정원 초과' },
        { status: 400 }
      );

    team.members.push(userId);
    user.teamId = team.teamId;

    return HttpResponse.json({ success: true });
  }),
];
