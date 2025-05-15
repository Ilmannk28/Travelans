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
      // Langkah 1: Inisialisasi peta
      await this.#showStoryMap();

      // Langkah 2: Ambil data cerita dari model
      const response = await this.#model.getStoryList();

      // Langkah 3: Cek apakah response OK
      if (!response.ok) {
        console.error('init: response not ok:', response);
        this.#view.showError(response.message);
        return;
      }

      // Langkah 4: Tampilkan cerita dan peta
      this.#view.showStories(response.listStory);
      this.#view.showMap(response.listStory);

    } catch (error) {
      console.error('init: error:', error);
      this.#view.showError('Terjadi kesalahan saat memuat data.');
    } finally {
      this.#view.hideLoading();
    }
  }
}
