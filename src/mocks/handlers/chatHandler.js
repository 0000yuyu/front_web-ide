import { http, HttpResponse } from 'msw';
import { chatMessages } from '../data/chat';

export const chatHandlers = [
  // 채팅 기록 조회
  http.get('/chat/:teamId', ({ params }) => {
    const { teamId } = params;
    const teamChats = chatMessages[teamId] || [];
    return HttpResponse.json(teamChats);
  }),
];
