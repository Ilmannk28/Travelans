import { openDB } from 'idb';

const DB_NAME = 'travelans-db';
const STORE_NAME = 'stories';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      // Add indexes for better querying
      store.createIndex('createdAt', 'createdAt');
      store.createIndex('name', 'name');
    }
  },
});

export const StoryDB = {
  async getAll() {
    try {
      return (await dbPromise).getAll(STORE_NAME);
    } catch (error) {
      console.error('Error getting all stories:', error);
      return [];
    }
  },

  async get(id) {
    try {
      return (await dbPromise).get(STORE_NAME, id);
    } catch (error) {
      console.error('Error getting story:', error);
      return null;
    }
  },

  async put(story) {
    try {
      // Ensure the story has required fields
      const storyToStore = {
        id: story.id,
        name: story.name || 'Unnamed Story',
        description: story.description || '',
        photoUrl: story.photoUrl || '',
        createdAt: story.createdAt || new Date().toISOString(),
        lat: story.lat || null,
        lon: story.lon || null,
        // Add offline flag to distinguish locally created stories
        isOffline: story.isOffline || false
      };
      
      return (await dbPromise).put(STORE_NAME, storyToStore);
    } catch (error) {
      console.error('Error storing story:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      return (await dbPromise).delete(STORE_NAME, id);
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  },

  async clearAll() {
    try {
      return (await dbPromise).clear(STORE_NAME);
    } catch (error) {
      console.error('Error clearing all stories:', error);
      throw error;
    }
  },

  // Additional method to get stories by offline status
  async getOfflineStories() {
    try {
      const db = await dbPromise;
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const allStories = await store.getAll();
      return allStories.filter(story => story.isOffline);
    } catch (error) {
      console.error('Error getting offline stories:', error);
      return [];
    }
  },

  // Method to sync offline stories when back online
  async markAsSynced(id) {
    try {
      const story = await this.get(id);
      if (story) {
        story.isOffline = false;
        return this.put(story);
      }
    } catch (error) {
      console.error('Error marking story as synced:', error);
      throw error;
    }
  }
};
