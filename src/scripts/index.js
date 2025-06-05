// CSS imports
import '../styles/styles.css';
import '../styles/responsive.css';
// import 'tiny-slider/dist/tiny-slider.css';
import 'leaflet/dist/leaflet.css';

// Components
import App from './pages/app';
import Camera from './utils/camera';

import { registerSW } from 'virtual:pwa-register';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.getElementById('main-content'),
    drawerButton: document.getElementById('drawer-button'),
    drawerNavigation: document.getElementById('navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link'),
  });
  await app.renderPage();

  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('Update baru tersedia. Muat ulang sekarang?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('Aplikasi siap digunakan secara offline');
    },
  });

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    // Stop all active media
    Camera.stopAllStreams();
  });
});

