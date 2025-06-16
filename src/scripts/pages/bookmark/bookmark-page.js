import { StoryDB } from '../../data/database';
import BookmarkPresenter from './bookmark-presenter';
import {
  generateLoaderTemplate
} from '../../tamplate';


export default class BookmarkPage {
  #presenter;;
  async render() {
    return `
    <section>
      <h2 class="heading-home">Cerita yang Disimpan</h2>
      ${generateLoaderTemplate()}
      <div id="bookmark-list"></div>
    </section>
  `;
  }


  async afterRender() {
    this.#presenter = new BookmarkPresenter({ view: this });
    await this.#presenter.init();
  }

  showBookmarks(stories) {
    const list = document.querySelector('#bookmark-list');
    if (!stories.length) {
      list.innerHTML = '<p>Belum ada cerita yang disimpan.</p>';
      return;
    }

    list.innerHTML = stories.map(story => `
      <div class="story-item" data-id="${story.id}">
        <div class="story-card">
          <h3>${story.name}</h3>
          <img src="${story.photoUrl}" alt="${story.name}" width="150" />
          <p>${story.description}</p>
          <small>${new Date(story.createdAt).toLocaleString()}</small>
          <div class="story-card__buttons">
            <a class="btn" href="#/story/${story.id}">Selengkapnya</a>
            <button class="delete-bookmark" data-id="${story.id}">Hapus</button>
          </div>
        </div>
      </div>
    `).join('');

    list.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-bookmark')) {
    const id = e.target.dataset.id;

    
    const confirmDelete = confirm('Apakah Anda yakin ingin menghapus cerita ini dari bookmark?');
    if (!confirmDelete) return;

    // Hapus dari database
    await StoryDB.delete(id);

    e.target.closest('.story-item').remove();
    alert('Cerita berhasil dihapus dari bookmark.');
  }
});

  }

  showError(message) {
    document.querySelector('#bookmark-list').innerHTML = `<p style="color:red;">${message}</p>`;
  }

  showLoading() {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'block';
  }

  hideLoading() {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
  }
}

