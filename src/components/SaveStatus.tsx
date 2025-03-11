import { useEffect, useState } from 'react';
import { useStorageStore } from '@/lib/storage/storageStore';

/**
 * A component that displays the current save status
 */
export default function SaveStatus() {
  const { status, error } = useStorageStore();
  const [visible, setVisible] = useState(false);
  
  // Show the component when status changes
  useEffect(() => {
    if (status !== 'idle') {
      setVisible(true);
      
      // If status is 'saved', hide after 3 seconds
      if (status === 'saved') {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [status]);
  
  if (!visible && status === 'idle') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 transition-opacity duration-300"
         style={{ opacity: visible ? 1 : 0 }}>
      <div className={`
        px-4 py-2 rounded-md shadow-md text-sm font-medium flex items-center gap-2
        ${status === 'saved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : ''}
        ${status === 'saving' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' : ''}
        ${status === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' : ''}
      `}>
        {status === 'saving' && (
          <>
            <span className="material-icons animate-spin text-sm">autorenew</span>
            <span>Saving...</span>
          </>
        )}
        
        {status === 'saved' && (
          <>
            <span className="material-icons text-sm">check_circle</span>
            <span>Changes saved</span>
          </>
        )}
        
        {status === 'error' && (
          <>
            <span className="material-icons text-sm">error</span>
            <span>{error || 'Error saving changes'}</span>
          </>
        )}
      </div>
    </div>
  );
}