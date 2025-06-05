export default class NewPresenter {
    #view;
    #model;
    #db;

    constructor({ view, model, db }) {
        this.#view = view;
        this.#model = model;
        this.#db = db;
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
                photo: photo,
                lat: lat,
                lon: lon,
            };

            const response = await this.#model.addNewStory(data);

            if (!response.ok) {
                console.error('postNewReport: response:', response);
                this.#view.storeFailed(response.message);
                return;
            }

            this.#view.storeSuccessfully(response.message);
        } catch (error) {
            console.warn('Offline/Failed: Menyimpan ke IndexedDB');

            if (this.#db) {
                const fallbackStory = {
                    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    description,
                    photo,
                    lat,
                    lon,
                    createdAt: new Date().toISOString(),
                };

                await this.#db.put(fallbackStory);
                this.#view.storeSuccessfully('Laporan disimpan secara lokal (offline)');
            } else {
                this.#view.storeFailed(error.message);
            }
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}
