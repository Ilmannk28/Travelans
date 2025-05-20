import { BASE_URL } from "../config";
import { getAccessToken } from "../utils/auth";

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,

  // Story
  STORY_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORY_GUEST: `${BASE_URL}/stories/guest`,

  // Notification
  SUBSCRIBE: `${BASE_URL}/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/unsubscribe`,
};


// Auth
export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getMyUserInfo() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// Story
export async function getStoryList() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(`${ENDPOINTS.STORY_LIST}?location=1`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getStoryDetail(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getGuestStories() {
  const fetchResponse = await fetch(ENDPOINTS.STORY_GUEST);
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function addNewStory({description, photo, lat, lon}) {
  const accessToken = getAccessToken();
  const formData = new FormData();
  const file = new File([photo], 'image.jpg', { type: 'image/jpeg' });
  formData.append('description', description);
  formData.append('photo', file);
  if (lat) formData.append('lat', lat);
  if (lon) formData.append('lon', lon);

  const fetchResponse = await fetch(ENDPOINTS.STORY_LIST, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const json = await fetchResponse.json();
  if (!fetchResponse.ok) {
    throw new Error(json.message || 'Gagal mengirim laporan');
  }

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}



// Notification
export async function subscribeNotification() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribeNotification() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
