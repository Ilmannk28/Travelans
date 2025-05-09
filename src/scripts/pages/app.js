import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    try {
      const url = getActiveRoute();
      const pageFactory = routes[url];

      if (!pageFactory) throw new Error('Halaman tidak ditemukan');

      const page = pageFactory();

      if (!page) throw new Error('Akses tidak diizinkan atau belum login');

      this.#content.innerHTML = await page.render();
      await page.afterRender();
    } catch (error) {
      console.error('renderPage error:', error);
      this.#content.innerHTML = `<p class="error">Halaman gagal dimuat: ${error.message}</p>`;
    }

  }
}

export default App;
