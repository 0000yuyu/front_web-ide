import { Server } from 'mock-socket';
import { chatMessages } from './data/chat';

export const initMockSocket = () => {
  const mockServer = new Server('ws://localhost:1234/ws/chat');

  mockServer.on('connection', (socket) => {
    socket.on('message', (data) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'message') {
          const { teamId, userId, nickname, content } = parsed;

          const newMessage = {
            type: 'message',
            teamId,
            userId,
            nickname,
            content,
            timestamp: new Date().toISOString(),
          };

          // 채팅 저장
          if (!chatMessages[teamId]) chatMessages[teamId] = [];
          chatMessages[teamId].push(newMessage);

          // 모든 클라이언트에 전송
          mockServer.clients().forEach((client) => {
            client.send(JSON.stringify(newMessage));
          });
        }
      } catch (err) {
        console.error('Invalid WS message', err);
      }
    });
  });
};
