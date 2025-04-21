import { http, HttpResponse } from 'msw';
import { users } from '../data/users';

export const authHandlers = [
  // 아이디 중복 확인
  http.get('/auth/check-id/:userId', ({ params }) => {
    const { userId } = params;
    const exists = users.find((u) => u.userId === userId);
    if (exists) return HttpResponse.json({ isDuplicate: true });
    else return HttpResponse.json({ isDuplicate: false });
  }),

  // 로그인
  http.post('/auth/login', async ({ request }) => {
    const { userId, hashedPassword } = await request.json();
    const user = users.find(
      (u) => u.userId === userId && u.hashedPassword === hashedPassword
    );

    if (!user) {
      return HttpResponse.json(
        { message: '아이디 또는 비밀번호 불일치' },
        { status: 401 }
      );
    }
    localStorage.setItem('id', userId);

    const token = btoa(`${userId}-token`); // 임시 토큰 생성
    return HttpResponse.json(
      { token, message: '로그인 성공' },
      { status: 200 }
    );
  }),

  // 회원가입
  http.post('/auth/register', async ({ request }) => {
    const { userId, hashedPassword, email, nickname } = await request.json();

    if (users.find((u) => u.userId === userId)) {
      return HttpResponse.json(
        { message: '이미 존재하는 ID 입니다.' },
        { status: 409 }
      );
    }

    users.push({ userId, hashedPassword, email, nickname });
    return HttpResponse.json({ message: '회원가입 성공' }, { status: 200 });
  }),

  // 아이디 찾기
  http.post('/auth/find-id', async ({ request }) => {
    const { email } = await request.json();
    const user = users.find((u) => u.email === email);

    if (user)
      return HttpResponse.json({ userId: user.userId }, { status: 200 });
    else
      return HttpResponse.json(
        { message: '등록되지 않은 사용자' },
        { status: 404 }
      );
  }),

  // 비밀번호 찾기
  http.post('/auth/find-password', async ({ request }) => {
    const { userId, email } = await request.json();
    const user = users.find((u) => u.email === email && u.userId === userId);

    if (user)
      return HttpResponse.json(
        { message: '이메일로 임시 비밀번호 전송됨' },
        { status: 200 }
      );
    else
      return HttpResponse.json(
        { message: '등록되지 않은 사용자' },
        { status: 404 }
      );
  }),

  // 로그아웃
  http.post('/auth/logout', () => {
    localStorage.removeItem('id');
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
