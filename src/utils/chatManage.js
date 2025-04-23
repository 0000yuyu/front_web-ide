let socket = null;
// 연결 시작
export const connectChatSocket = (token, onMessage) => {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  socket = new WebSocket(`ws://localhost:5173/ws/chat?token=${token}`);

  socket.onopen = () => {
    console.log("🟢 WebSocket 연결됨");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onMessage) onMessage(data);
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket 에러:", err);
  };

  socket.onclose = () => {
    console.warn("🟡 WebSocket 연결 종료");
  };
};
//메세지 전송
export const sendMessageToServer = (message) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("❗ WebSocket이 열려있지 않습니다.");
    return;
  }

  const payload = {
    type: "message",
    ...message,
  };

  socket.send(JSON.stringify(payload));
};

//연결 해제
export const disconnectChatSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
