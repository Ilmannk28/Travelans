export default class NewPresenter {
    #view;
    #model;

    constructor({ view, model }) {
        this.#view = view;
        this.#model = model;
    }

    async showNewFormMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showNewFormMap: error:', error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async postNewReport({ description, photo, lat, lon }) {
        this.#view.showSubmitLoadingButton();
        try {

            const data = {
                description: description,
                evidenceImages: photo,
                latitude: lat,
                longitude: lon,
            };

            const response = await this.#model.addNewStory(data);

            if (!response.ok) {
                console.error('postNewReport: response:', response);
                this.#view.storeFailed(response.message);
                return;
            }

            this.#view.storeSuccessfully(response.message);
        } catch (error) {
            console.error('postNewReport: error:', error);
            this.#view.storeFailed(error.message);
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}
