import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from './theme-provider'
import { useStorageStore } from '@/lib/storage/storageStore'
import { useMindMapStore } from '@/lib/store'

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { setTheme } = useTheme()
  const { clearData } = useStorageStore()
  const [showDataMenu, setShowDataMenu] = useState(false)
  
  const handleThemeToggle = () => {
    toggleDarkMode()
    setTheme(darkMode ? 'light' : 'dark')
  }

  const handleDataMenuToggle = () => {
    setShowDataMenu(prev => !prev)
  }

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      // Clear storage
      await clearData()
      
      // Force page reload to reset Zustand state
      window.location.reload()
    }
  }

  const handleExportData = () => {
    try {
      const { nodes, edges, todos } = useMindMapStore.getState()
      const data = { nodes, edges, todos }
      const jsonString = JSON.stringify(data, null, 2)
      
      // Create a blob and download it
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `mindmap-todo-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  return (
    <header className={cn(
      "border-b p-4 flex items-center justify-between",
      "bg-background text-foreground"
    )}>
      <div className="flex items-center gap-2">
        <span className="material-icons text-primary text-2xl">account_tree</span>
        <h1 className="text-xl font-bold">MindMap TODO</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Data management dropdown */}
        <div className="relative">
          <button 
            onClick={handleDataMenuToggle}
            className="p-2 rounded-full hover:bg-secondary transition-colors flex items-center gap-1"
            aria-label="Data management"
          >
            <span className="material-icons">save</span>
            <span className="text-sm hidden sm:inline">Data</span>
            <span className="material-icons text-sm">
              {showDataMenu ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          
          {showDataMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={handleExportData}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  role="menuitem"
                >
                  <span className="material-icons text-sm">file_download</span>
                  Export Data
                </button>
                
                <button
                  onClick={handleClearData}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  role="menuitem"
                >
                  <span className="material-icons text-sm">delete</span>
                  Reset All Data
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Theme toggle button */}
        <button 
          onClick={handleThemeToggle}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <span className="material-icons">light_mode</span>
          ) : (
            <span className="material-icons">dark_mode</span>
          )}
        </button>
      </div>
    </header>
  )
}