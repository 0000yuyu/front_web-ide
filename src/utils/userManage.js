import { removeToken, saveToken, getHeaders } from './auth';

export async function login(user_id, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        user_id,
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

export async function membership(user_id, password, nickname, email) {
  try {
    console.log(user_id, password, email, nickname);
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ user_id, password, nickname, email }),
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
  const response = await fetch('/api/auth/find-id', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data.user_id;
}

export async function findPassword(user_id, email) {
  const response = await fetch('/api/auth/find-password', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ user_id, email }),
  });
  if (response.ok) return true;
  else return false;
}

export async function checkIdDuplicate(user_id) {
  const response = await fetch(`/api/auth/check-id/${user_id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    if (!data.is_duplicate) return true;
  } else return false;
}

export async function getUserData() {
  try {
    const res = await fetch(`/api/user`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
