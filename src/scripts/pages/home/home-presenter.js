import { getStoryList } from '../../data/api';

export class HomePresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async init() {
    try {
      const response = await getStoryList();
      if (response.ok) {
        this.#view.showStories(response.listStory);
        this.#view.showMap(response.listStory);
      } else {
        this.#view.showError(response.message);
      }
    } catch (err) {
      this.#view.showError('Terjadi kesalahan saat memuat data.');
    }
  }
}
