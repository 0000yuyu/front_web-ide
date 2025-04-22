import { http, HttpResponse } from 'msw';
import { teams } from '../data/teams';
import { quests } from '../data/quests';

let questIdCounter = 1;

export const questHandlers = [
  // 문제 생성
  http.post('/quest', async ({ request }) => {
    const { teamId, questName, questStart, questDue, questLink } =
      await request.json();

    const quest = {
      questId: questIdCounter++,
      teamId,
      questName,
      questStart,
      questDue,
      questStatus: 'IN_PROGRESS',
      questLink,
      incompletedUser: [],
    };

    const team = teams.find((t) => t.teamId === teamId);
    if (!team)
      return HttpResponse.json(
        { message: '팀이 존재하지 않음' },
        { status: 404 }
      );

    // 초기 incompletedUser 세팅
    quest.incompletedUser = team.members.map((userId) => ({
      userId,
      isOncomplete: false,
    }));

    quests.push(quest);
    team.quests.push(quest.questId);

    return HttpResponse.json({ success: true }, { status: 201 });
  }),
  // 문제 목록 조회
  http.get('/quest/:teamId', ({ params }) => {
    const { teamId } = params;
    const quest = quests.filter((quest) => quest.teamId == teamId);
    return HttpResponse.json(quest);
  }),

  // 문제 상세 조회
  http.get('/quest/:team_id/:quest_id', ({ params }) => {
    const { team_id, quest_id } = params;
    const quest = quests.find(
      (q) => q.team_id === Number(team_id) && q.quest_id === Number(quest_id)
    );

    if (!quest)
      return HttpResponse.json({ message: '퀘스트 없음' }, { status: 404 });
    return HttpResponse.json(quest);
  }),
  // 문제 상태 변경
  http.post('/quest/:teamId/:questId/status', ({ params }) => {
    const { teamId, questId } = params;
    const userId = localStorage.getItem('id');
    const quest = quests.find(
      (q) => q.teamId === Number(teamId) && q.questId === Number(questId)
    );
    if (!quest)
      return HttpResponse.json({ message: '퀘스트 없음' }, { status: 404 });
    const newQuest = quest.questUserList.map((user) => {
      if (userId == user.id) return { id: user.id, status: !user.status };
      return user;
    });
    console.log(newQuest);
    return HttpResponse.json({ status: 200 });
  }),
];
