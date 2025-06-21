import { BASE_URL } from "../config";
const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function initPushNotificationButtons() {
  const container = document.getElementById('push-notification-tools');
  if (!container) return;

  container.innerHTML = `
    <div class="push-notification-container">
      <button id="subscribe-btn" class="btn btn-small">🔔 Subscribe</button>
      <button id="unsubscribe-btn" class="btn btn-small" style="display: none;">🔕 Unsubscribe</button>
      <span id="notification-status" class="notification-status"></span>
    </div>
  `;

  const subscribeBtn = document.getElementById('subscribe-btn');
  const unsubscribeBtn = document.getElementById('unsubscribe-btn');
  const statusSpan = document.getElementById('notification-status');

  function updateStatus(message, isError = false) {
    statusSpan.textContent = message;
    statusSpan.className = `notification-status ${isError ? 'error' : 'success'} show`;

    setTimeout(() => {
      statusSpan.className = `notification-status ${isError ? 'error' : 'success'}`;
      statusSpan.textContent = '';
    }, 3000);
  }


  subscribeBtn.addEventListener('click', async () => {
    try {
      subscribeBtn.disabled = true;
      subscribeBtn.textContent = 'Subscribing...';

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const payload = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
        },
      };

      const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Gagal subscribe ke server');

      updateStatus('Berhasil subscribe notifikasi!');
      subscribeBtn.style.display = 'none';
      unsubscribeBtn.style.display = 'inline-block';
    } catch (error) {
      console.error('Gagal subscribe:', error);
      updateStatus('Gagal subscribe notifikasi', true);
    } finally {
      subscribeBtn.disabled = false;
      subscribeBtn.textContent = '🔔 Subscribe';
    }
  });

  unsubscribeBtn.addEventListener('click', async () => {
    try {
      unsubscribeBtn.disabled = true;
      unsubscribeBtn.textContent = 'Unsubscribing...';

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        if (!response.ok) throw new Error('Gagal unsubscribe ke server');

        await subscription.unsubscribe();

        updateStatus('Berhasil unsubscribe notifikasi!');
        subscribeBtn.style.display = 'inline-block';
        unsubscribeBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Gagal unsubscribe:', error);
      updateStatus('Gagal unsubscribe notifikasi', true);
    } finally {
      unsubscribeBtn.disabled = false;
      unsubscribeBtn.textContent = '🔕 Unsubscribe';
    }
  });

  // Cek status awal saat load
  (async function checkInitialStatus() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        subscribeBtn.style.display = 'none';
        unsubscribeBtn.style.display = 'inline-block';
      } else {
        subscribeBtn.style.display = 'inline-block';
        unsubscribeBtn.style.display = 'none';
      }
    } catch (error) {
      console.error('Gagal memeriksa status awal:', error);
    }
  })();
}
