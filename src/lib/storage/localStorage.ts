import { StorageService } from './types';

/**
 * LocalStorage implementation of the StorageService interface
 */
export class LocalStorageService implements StorageService {
  constructor(private prefix: string = 'mindmap-todo-') {}

  /**
   * Save data to localStorage
   */
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`${this.prefix}${key}`, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }

  /**
   * Load data from localStorage
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      const serialized = localStorage.getItem(`${this.prefix}${key}`);
      if (!serialized) return null;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   */
  async remove(key: string): Promise<void> {
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  /**
   * Clear all data with the current prefix from localStorage
   */
  async clear(): Promise<void> {
    // Only remove items with our prefix
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

// Export a singleton instance
export const localStorageService = new LocalStorageService();
