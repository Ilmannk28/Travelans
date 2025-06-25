import { StoryDB } from "../../data/database";

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
      await this.#view.initialMap();
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
      
      // Try to sync offline stories first if online
      if (navigator.onLine) {
        await this.#syncOfflineStories();
      }

      const response = await this.#model.getStoryList();

      if (!response.ok) {
        console.warn('API gagal, menggunakan data offline...');
        await this.#showOfflineData();
        return;
      }

      // Store fresh data to IndexedDB
      // const storiesToStore = response.listStory.map(story => ({
      //   ...story,
      //   isOffline: false
      // }));

      // for (const story of storiesToStore) {
      //   await StoryDB.put(story);
      // }

      this.#view.showStories(response.listStory);
      this.#view.showMap(response.listStory);

    } catch (error) {
      console.error('init: error:', error);
      await this.#showOfflineData();
    } finally {
      this.#view.hideLoading();
    }
  }

  async #showOfflineData() {
    const localStories = await StoryDB.getAll();

    if (localStories.length === 0) {
      this.#view.showError('Tidak ada data tersedia. Pastikan koneksi internet dan coba lagi.');
    } else {
      this.#view.showStories(localStories);
      this.#view.showMap(localStories);
      
      // Show offline indicator
      this.#view.showOfflineIndicator();
    }
  }

  async #syncOfflineStories() {
    try {
      const offlineStories = await StoryDB.getOfflineStories();
      
      for (const story of offlineStories) {
        try {
          // Try to sync with server (you'll need to implement this API call)
          // For now, we'll just mark as synced
          await StoryDB.markAsSynced(story.id);
        } catch (syncError) {
          console.warn('Failed to sync story:', story.id, syncError);
        }
      }
    } catch (error) {
      console.error('Error syncing offline stories:', error);
    }
  }

  async getStoryById(id) {
    try {
      // Try local first for faster response
      const localStory = await StoryDB.get(id);
      if (localStory && !navigator.onLine) {
        return localStory;
      }

      const response = await this.#model.getStoryDetail(id);
      if (!response.ok) {
        // Fallback to local if API fails
        return localStory;
      }
      
      return response.story;
    } catch (error) {
      console.error('getStoryById: error:', error);
      // Try to get from local storage as fallback
      return await StoryDB.get(id);
    }
  }

  async removeStory(id) {
    try {
      // Try to delete from server first
      if (navigator.onLine) {
        await this.#model.deleteStory(id);
      }
      
      // Always delete from local storage
      await StoryDB.delete(id);
      return true;
    } catch (error) {
      console.error('removeStory: error:', error);
      
      // If online deletion failed but we're offline, still delete locally
      if (!navigator.onLine) {
        try {
          await StoryDB.delete(id);
          return true;
        } catch (localError) {
          console.error('Local deletion also failed:', localError);
        }
      }
      
      return false;
    }
  }
}
