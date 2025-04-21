import { removeToken, saveToken } from './auth';

const headers = { 'Content-Type': 'application/json' };

export async function login(userId, password) {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId,
        password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      saveToken(data.token);
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function membership(userId, password, nickname, email) {
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, password, nickname, email }),
    });
    if (response.ok) return true;
    else return false;
  } catch (error) {
    console.log(error);
  }
}

export function logout() {
  removeToken();
}
export async function findId(email) {
  const response = await fetch('/auth/find-id', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data;
}
export async function findPassword(id, email) {
  const response = await fetch('/auth/find-password', {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId: id, email }),
  });
  if (response.ok) return true;
  else return false;
}
export async function checkIdDuplicate(id) {
  const response = await fetch(`/auth/check-id/${id}`);
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    if (!data.isDuplicate) return true;
  } else return false;
}
export async function getUserData() {
  try {
    const res = await fetch(`/user`);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
