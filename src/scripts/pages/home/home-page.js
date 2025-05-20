import HomePresenter from './home-presenter';
import * as StoryAPI from '../../data/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_SERVICE_API_KEY } from '../../config';

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
          <a class="btn report-item__read-more" href="#/story/${story.id}">
            Selengkapnya <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `).join('');
  }

  async initialMap() {
    this.#map = L.map('story-map').setView([-2.5, 117], 4);

    // Base layers
    const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    });

    const mapTiler = L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAP_SERVICE_API_KEY}`, {
      attribution: '© MapTiler © OpenStreetMap contributors',
      tileSize: 512,
      zoomOffset: -1,
    });

    const esriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    });

    // Tambahkan salah satu sebagai default layer
    openStreetMap.addTo(this.#map);

    // Layer control
    const baseMaps = {
      "OpenStreetMap": openStreetMap,
      "MapTiler Streets": mapTiler,
      "Esri World Imagery": esriWorldImagery
    };

    L.control.layers(baseMaps).addTo(this.#map);

    // Perbaiki layout map
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

