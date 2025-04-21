import { http, HttpResponse } from 'msw';
import { users } from '../data/users';

const userId = localStorage.getItem('id');

export const userHandlers = [
  http.get('/user', () => {
    if (!userId) return HttpResponse.json({ status: 401 });
    const user = users.find((u) => u.userId === userId);
    if (user) {
      return HttpResponse.json({
        nickname: user.nickname,
        email: user.email,
        tier: user.tier,
      });
    } else {
      return HttpResponse.json(
        { message: '유저를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
  }),
];
