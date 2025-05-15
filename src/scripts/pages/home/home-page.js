import HomePresenter from './home-presenter';
import * as StoryAPI from '../../data/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
     <section>
        <div id="map-loading" style="display:none;">Loading map...</div>
        <div id="story-map" style="height: 400px; margin-top: 20px;"></div>
      </section>
      <section>
        <div id="page-loading" style="display:none;">Loading stories...</div>
        <h2 class="heading-home" >Daftar Cerita</h2>
        <div id="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });
    await this.#presenter.init();
  }

  showLoading() {
    document.querySelector('#page-loading').style.display = 'block';
  }

  hideLoading() {
    document.querySelector('#page-loading').style.display = 'none';
  }

  showMapLoading() {
    document.querySelector('#map-loading').style.display = 'block';
  }

  hideMapLoading() {
    document.querySelector('#map-loading').style.display = 'none';
  }

  showStories(stories) {
    const list = document.querySelector('#story-list');
    list.innerHTML = stories.map(story => `
      
      <div tabindex="0" class="story-item" data-id="${story.id}">
        <div class="story-card">
          <h3>${story.name}</h3>
          <img src="${story.photoUrl}" alt="${story.name}" width="150" />
          <p>${story.description}</p>
          <small>${new Date(story.createdAt).toLocaleString()}</small>
        </div>
      </div>
    `).join('');
  }

  async initialMap() {
    this.#map = L.map('story-map').setView([-2.5, 117], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.#map);

    // Tambahkan invalidateSize untuk memperbaiki layout
    setTimeout(() => {
      this.#map.invalidateSize();
    }, 0);
  }


  showMap(listStory) {
    if (!this.#map) return;

    listStory.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(this.#map)
          .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });
  }


  showError(message) {
    const list = document.querySelector('#story-list');
    list.innerHTML = `<p style="color:red;">${message}</p>`;
  }
}

