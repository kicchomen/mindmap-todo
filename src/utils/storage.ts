/**
 * Storage utility functions for data persistence
 * 
 * This module provides an abstracted interface for data storage operations,
 * currently implemented with localStorage but designed to be extended to other
 * storage solutions (iCloud, Google Drive, GitHub, etc.) in the future.
 */

// Keys used for localStorage
export const STORAGE_KEYS = {
  MINDMAP_DATA: 'mindmap-todo-data',
  LAST_MODIFIED: 'mindmap-todo-last-modified',
};

/**
 * Storage interface defining the contract for all storage implementations
 */
export interface StorageProvider {
  // Save data to storage
  save: <T>(key: string, data: T) => Promise<void>;
  
  // Load data from storage
  load: <T>(key: string) => Promise<T | null>;
  
  // Check if data exists in storage
  exists: (key: string) => Promise<boolean>;
  
  // Delete data from storage
  delete: (key: string) => Promise<void>;
}

/**
 * localStorage implementation of the StorageProvider interface
 */
export class LocalStorageProvider implements StorageProvider {
  /**
   * Save data to localStorage
   * @param key - Storage key
   * @param data - Data to store
   */
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      // Update last modified timestamp
      localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, Date.now().toString());
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data to localStorage');
    }
  }

  /**
   * Load data from localStorage
   * @param key - Storage key
   * @returns The stored data or null if not found
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      throw new Error('Failed to load data from localStorage');
    }
  }

  /**
   * Check if data exists in localStorage
   * @param key - Storage key
   * @returns True if data exists, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Delete data from localStorage
   * @param key - Storage key
   */
  async delete(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

// Default storage provider instance (localStorage)
const storageProvider = new LocalStorageProvider();

/**
 * Save mindmap data to storage
 * @param data - Mindmap data to store
 */
export const saveMindMapData = async <T>(data: T): Promise<void> => {
  await storageProvider.save(STORAGE_KEYS.MINDMAP_DATA, data);
};

/**
 * Load mindmap data from storage
 * @returns The stored mindmap data or null if not found
 */
export const loadMindMapData = async <T>(): Promise<T | null> => {
  return await storageProvider.load<T>(STORAGE_KEYS.MINDMAP_DATA);
};

/**
 * Check if mindmap data exists in storage
 * @returns True if data exists, false otherwise
 */
export const hasMindMapData = async (): Promise<boolean> => {
  return await storageProvider.exists(STORAGE_KEYS.MINDMAP_DATA);
};

/**
 * Get the last modified timestamp for mindmap data
 * @returns Timestamp or null if not available
 */
export const getLastModifiedTime = async (): Promise<number | null> => {
  const timestamp = await storageProvider.load<string>(STORAGE_KEYS.LAST_MODIFIED);
  return timestamp ? parseInt(timestamp, 10) : null;
};

export default storageProvider;
