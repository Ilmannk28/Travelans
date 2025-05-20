export default class StoryDetailPresenter {
  constructor({ view, model, id }) {
    this.view = view;
    this.model = model;
    this.id = id;
  }

  async init() {
    try {
      this.view.showLoading();

      const response = await this.model.getStoryDetail(this.id);
      this.view.hideLoading();

      if (!response.ok) {
        this.view.showError(response.message || 'Gagal memuat detail cerita.');
        return;
      }

      this.view.showStoryDetail(response.story || response); // tergantung response API
    } catch (err) {
      this.view.showError('Terjadi kesalahan saat mengambil data.');
    }
  }
}
