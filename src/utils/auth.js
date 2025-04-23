// headers.js
export const getHeaders = () => {
  const token = sessionStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// 토큰 저장
export const saveToken = (token) => {
  sessionStorage.setItem('token', token);
};
// 토큰 가져오기
export const getToken = () => {
  return sessionStorage.getItem('token');
};

// 토큰 삭제 (로그아웃)
export const removeToken = () => {
  sessionStorage.removeItem('token');
};

// 로그인 여부 확인
export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  return true;
};
