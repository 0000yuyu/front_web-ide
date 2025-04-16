import { http, HttpResponse } from 'msw';
import { users } from '../data/users';

export const userHandlers = [
  http.get('/user/:userId', ({ params }) => {
    const { userId } = params;
    const user = users.find((u) => u.userId === userId);

    if (user) {
      return HttpResponse.json({
        nickname: user.nickname,
        email: user.email,
        tier: 'Silver', // 임시 값
        teamId: 1, // 임시 값
      });
    } else {
      return HttpResponse.json(
        { message: '유저를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
  }),
];
