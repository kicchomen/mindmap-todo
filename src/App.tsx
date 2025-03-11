import { useState, useEffect } from 'react'
import MindMap from './components/MindMap'
import Header from './components/Header'
import SaveStatus from './components/SaveStatus'
import { ThemeProvider } from './components/theme-provider'
import ReactFlowProvider from './components/ReactFlowProvider'
import { useStorageStore } from './lib/storage/storageStore'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const { loadData } = useStorageStore()

  // On initial load, try to restore data from storage if needed
  useEffect(() => {
    const initializeFromStorage = async () => {
      // This is a backup loading mechanism in case Zustand's persist fails
      try {
        await loadData()
        // Data should be loaded automatically via Zustand's persist middleware
      } catch (error) {
        console.error('Failed to initialize from storage:', error)
      }
    }
    
    initializeFromStorage()
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <ThemeProvider defaultTheme={darkMode ? 'dark' : 'light'}>
      <ReactFlowProvider>
        <div className="min-h-screen flex flex-col">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-1 p-4">
            <MindMap />
          </main>
          <SaveStatus />
        </div>
      </ReactFlowProvider>
    </ThemeProvider>
  )
}

export default App