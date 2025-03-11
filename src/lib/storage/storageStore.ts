import { create } from 'zustand';
import { localStorageService } from './localStorage';
import { StorageStatus, StorageService } from './types';
import { debounce } from '../utils';

interface StorageState {
  // Current storage status
  status: StorageStatus;
  
  // Error message if any
  error: string | null;
  
  // Current storage service
  storageService: StorageService;
  
  // Storage key
  storageKey: string;
  
  // Autosave delay in ms
  autosaveDelay: number;
  
  // Actions
  setStatus: (status: StorageStatus) => void;
  setError: (error: string | null) => void;
  setStorageService: (service: StorageService) => void;
  setStorageKey: (key: string) => void;
  
  // Data operations
  saveData: <T>(data: T) => Promise<void>;
  loadData: <T>() => Promise<T | null>;
  clearData: () => Promise<void>;
}

export const useStorageStore = create<StorageState>((set, get) => ({
  status: 'idle',
  error: null,
  storageService: localStorageService,
  storageKey: 'mindmap-data',
  autosaveDelay: 1000, // 1 second default
  
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setStorageService: (service) => set({ storageService: service }),
  setStorageKey: (key) => set({ storageKey: key }),
  
  saveData: async <T>(data: T) => {
    const { storageService, storageKey } = get();
    
    try {
      set({ status: 'saving' });
      await storageService.save(storageKey, data);
      set({ status: 'saved', error: null });
      
      // Reset status to idle after 2 seconds
      setTimeout(() => {
        set((state) => {
          // Only reset if status is still 'saved'
          if (state.status === 'saved') {
            return { status: 'idle' };
          }
          return {};
        });
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ 
        status: 'error',
        error: `Failed to save data: ${errorMessage}`
      });
      console.error('Storage save error:', error);
    }
  },
  
  loadData: async <T>() => {
    const { storageService, storageKey } = get();
    
    try {
      return await storageService.load<T>(storageKey);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ 
        status: 'error',
        error: `Failed to load data: ${errorMessage}`
      });
      console.error('Storage load error:', error);
      return null;
    }
  },
  
  clearData: async () => {
    const { storageService } = get();
    
    try {
      await storageService.clear();
      set({ status: 'idle', error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ 
        status: 'error',
        error: `Failed to clear data: ${errorMessage}`
      });
      console.error('Storage clear error:', error);
    }
  },
}));

// Create a debounced save function to avoid excessive saves
export const debouncedSave = debounce(async <T>(data: T) => {
  const { saveData } = useStorageStore.getState();
  await saveData(data);
}, useStorageStore.getState().autosaveDelay);
