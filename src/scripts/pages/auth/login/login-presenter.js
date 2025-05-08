export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getLogin({ email, password });

      // Log response untuk memeriksa struktur data yang diterima
      console.log('response:', response);

      if (!response.ok) {
        console.error('getLogin: response:', response);
        this.#view.loginFailed(response.message || 'Login gagal');
        return;
      }

      if (!response.data || !response.data.accessToken) {
        console.error('getLogin: No accessToken in response data');
        this.#view.loginFailed('Token akses tidak ditemukan');
        return;
      }

      this.#authModel.putAccessToken(response.data.accessToken);

      this.#view.loginSuccessfully(response.message, response.data);
    } catch (error) {
      
      console.error('getLogin: error:', error);
      this.#view.loginFailed(error.message || 'Terjadi kesalahan saat login');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
