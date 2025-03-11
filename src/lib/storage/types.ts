/**
 * Storage service interface
 * This abstraction allows for different storage backends to be used in the future
 */
export interface StorageService {
  save: <T>(key: string, data: T) => Promise<void>;
  load: <T>(key: string) => Promise<T | null>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

/**
 * Storage status type for UI feedback
 */
export type StorageStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Storage options interface
 */
export interface StorageOptions {
  autosaveDelay?: number; // Debounce delay in ms
}
