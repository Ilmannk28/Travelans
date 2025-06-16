import { StoryDB } from '../../data/database';

export default class BookmarkPresenter {
    #view;

    constructor({ view }) {
        this.#view = view;
    }

    async init() {
        try {
            this.#view.showLoading();
            const stories = await StoryDB.getAll();
            this.#view.showBookmarks(stories);
        } catch (error) {
            this.#view.showError('Gagal memuat cerita yang disimpan.');
        } finally {
            this.#view.hideLoading();
        }
    }

}
