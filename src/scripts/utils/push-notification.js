import { BASE_URL } from "../config";
const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

function getAccessToken() {
  return localStorage.getItem('accessToken'); // sesuaikan kalau kamu pakai storage lain
}

export function initPushNotificationButtons() {
  const container = document.getElementById('push-notification-tools');
  if (!container) return;

  container.innerHTML = `
    <button id="subscribe-btn">Subscribe</button>
    <button id="unsubscribe-btn" style="display: none;">Unsubscribe</button>
  `;

  const subscribeBtn = document.getElementById('subscribe-btn');
  const unsubscribeBtn = document.getElementById('unsubscribe-btn');

  subscribeBtn.addEventListener('click', async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await fetch(`${BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(subscription),
      });

      alert('Berhasil subscribe!');
      subscribeBtn.style.display = 'none';
      unsubscribeBtn.style.display = 'inline-block';
    } catch (error) {
      console.error('Gagal subscribe', error);
    }
  });

  unsubscribeBtn.addEventListener('click', async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch(`${BASE_URL}/notifications/subscribe`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        await subscription.unsubscribe();
        alert('Berhasil unsubscribe!');
        subscribeBtn.style.display = 'inline-block';
        unsubscribeBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Gagal unsubscribe', error);
    }
  });

  // Cek status awal
  navigator.serviceWorker.ready.then(async (registration) => {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      subscribeBtn.style.display = 'none';
      unsubscribeBtn.style.display = 'inline-block';
    }
  });
}
