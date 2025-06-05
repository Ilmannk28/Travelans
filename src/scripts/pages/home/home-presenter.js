import {StoryDB} from "../../data/database";
export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async #showStoryMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap(); // misal: inisialisasi Leaflet
    } catch (error) {
      console.error('#showStoryMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async init() {
    this.#view.showLoading();

    try {

      await this.#showStoryMap();
      const response = await this.#model.getStoryList();

      if (!response.ok) {
        console.warn('API gagal, ambil dari IndexedDB...');
        const localStories = await StoryDB.getAll();

        if (localStories.length === 0) {
          this.#view.showError('Gagal memuat data dan tidak ada data lokal.');
        } else {
          this.#view.showStories(localStories);
          this.#view.showMap(localStories);
        }

        return;
      }

      this.#view.showStories(response.listStory);
      this.#view.showMap(response.listStory);

      response.listStory.forEach(story => {
        StoryDB.put(story);
      });

    } catch (error) {
      console.error('init: error:', error);
      const localStories = await StoryDB.getAll();

      if (localStories.length === 0) {
        this.#view.showError('Terjadi kesalahan saat memuat data dan tidak ada data offline.');
      } else {
        this.#view.showStories(localStories);
        this.#view.showMap(localStories);
      }
    } finally {
      this.#view.hideLoading();
    }
  }
}
