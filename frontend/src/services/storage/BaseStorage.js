class BaseStorage {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  getAll() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error(`Failed to read ${this.storageKey}:`, error);
      return [];
    }
  }

  save(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return items;
  }

  clear() {
    localStorage.removeItem(this.storageKey);
    return [];
  }
}

export default BaseStorage;