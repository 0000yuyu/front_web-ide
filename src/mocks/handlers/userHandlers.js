import { http, HttpResponse } from 'msw';
import { users } from '../data/users';

export const userHandlers = [
  http.get('/user', () => {
    const userId = localStorage.getItem('id');
    if (!userId) return HttpResponse.json({ status: 401 });
    const user = users.find((u) => u.userId === userId);
    if (user) {
      return HttpResponse.json({
        nickname: user.nickname,
        email: user.email,
        tier: user.tier,
        teamId: user.teamId,
      });
    } else {
      return HttpResponse.json(
        { message: '유저를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
  }),
];
