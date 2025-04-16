import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// 개발 환경일 때만 mock 서버 실행
if (import.meta.env.MODE === 'development') {
  const { worker } = await import('./mocks/browser');
  const { initMockSocket } = await import('./mocks/wsServer');

  await worker.start();
  initMockSocket();
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
