import { useState } from 'react'
import MindMap from './components/MindMap'
import Header from './components/Header'
import { ThemeProvider } from './components/theme-provider'
import ReactFlowProvider from './components/ReactFlowProvider'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <ThemeProvider defaultTheme={darkMode ? 'dark' : 'light'}>
      <ReactFlowProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-1 p-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Mind Map TODO
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Organize your tasks visually with this mind map-based TODO app. Click on nodes to expand and manage tasks.
            </p>
            <MindMap />
          </main>
          <footer className="py-3 px-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t">
            <p>Mind Map TODO - Click nodes to expand and manage tasks</p>
          </footer>
        </div>
      </ReactFlowProvider>
    </ThemeProvider>
  )
}

export default App