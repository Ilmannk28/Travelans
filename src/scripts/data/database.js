import { openDB } from 'idb';

const DB_NAME = 'travelans-db';
const STORE_NAME = 'stories';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export const StoryDB = {
  async getAll() {
    return (await dbPromise).getAll(STORE_NAME);
  },
  async get(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },
  async put(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },
  async delete(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
  async clearAll() {
    return (await dbPromise).clear(STORE_NAME);
  },
};
