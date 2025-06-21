// CSS imports
import '../styles/styles.css';
import '../styles/push-notification.css';
import '../styles/responsive.css';
// import 'tiny-slider/dist/tiny-slider.css';
import 'leaflet/dist/leaflet.css';

// Components
import App from './pages/app';
import Camera from './utils/camera';

// Service Worker manual registration
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.getElementById('main-content'),
    drawerButton: document.getElementById('drawer-button'),
    drawerNavigation: document.getElementById('navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link'),
  });
  await app.renderPage();

  // Manual service worker registration
  await navigator.serviceWorker.register('sw.js');

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    // Stop all active media
    Camera.stopAllStreams();
  });
});
