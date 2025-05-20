import StoryDetailPresenter from './story-detail-presenter';
import * as StoryAPI from '../../data/api';

export default class StoryDetailPage {
  #presenter;

  constructor() {
    const id = window.location.hash.split('/')[2];
    this.#presenter = new StoryDetailPresenter({
      view: this,
      model: StoryAPI,
      id,
    });
  }

  async render() {
    return `
      <section>
        <div id="story-detail-loading">Loading...</div>
        <div id="story-detail-content"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.init();
  }

  showLoading() {
    document.querySelector('#story-detail-loading').style.display = 'block';
  }

  hideLoading() {
    document.querySelector('#story-detail-loading').style.display = 'none';
  }

  showStoryDetail(story) {
    const container = document.querySelector('#story-detail-content');
    container.style.display = 'flex';

    container.innerHTML = `
      <h2>${story.name}</h2>
      <img src="${story.photoUrl}" alt="${story.name}" width="300" />
      <p>${story.description}</p>
      <small><strong>Dibuat:</strong> ${new Date(story.createdAt).toLocaleString()}</small><br>
      ${story.lat && story.lon ? `<p><strong>Lokasi:</strong> (${story.lat}, ${story.lon})</p>` : ''}
      <br><a href="#/">← Kembali ke Beranda</a>
    `;
  }

  showError(message) {
    const container = document.querySelector('#story-detail-loading');
    container.innerHTML = `<p style="color:red;">${message}</p>`;
  }
}
