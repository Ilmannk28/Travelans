import { HomePresenter } from './home-presenter';

export default class HomePage {
  async render() {
    return `
      <section>
        <h2>Daftar Cerita</h2>
        <div id="story-list"></div>
        <div id="story-map" style="height: 400px; margin-top: 20px;"></div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new HomePresenter(this);
    presenter.init();
  }

  showStories(stories) {
    const list = document.querySelector('#story-list');
    list.innerHTML = stories.map(story => `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="${story.name}" width="150" />
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <small>${new Date(story.createdAt).toLocaleString()}</small>
      </div>
    `).join('');
  }

  showMap(stories) {
    const map = L.map('story-map').setView([-2.5, 117], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    stories.forEach(story => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });
  }

  showError(message) {
    const list = document.querySelector('#story-list');
    list.innerHTML = `<p style="color:red;">${message}</p>`;
  }
}

