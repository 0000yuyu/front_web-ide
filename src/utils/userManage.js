import { userDataStore } from '@/store/userDataStore';
import { removeToken, saveToken } from './auth';
import bcrypt from 'bcryptjs';

const headers = { 'Content-Type': 'application/json' };
const salt = '$2b$10$1234567890123456789012';

export async function login(userId, password) {
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log(hashedPassword);
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId,
        hashedPassword,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      saveToken(data.token);
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function membership(userId, password, nickname, email) {
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, hashedPassword, nickname, email }),
    });
    console.log(hashedPassword);
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
    return data;
  } catch (error) {
    console.log(error);
  }
}
