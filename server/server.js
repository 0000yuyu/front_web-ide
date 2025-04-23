import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.IO 이벤트 핸들링
io.on("connection", (socket) => {
  console.log("새로운 사용자가 연결되었습니다.");

  // 클라이언트에서 보낸 이벤트 수신 및 처리
  socket.on("chat message", (msg) => {
    console.log("수신한 메시지:", msg);
    // 클라이언트들에게 메시지 전송
    io.emit("chat message", msg);
  });
});

// 서버 시작
const port = 5173;
server.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
