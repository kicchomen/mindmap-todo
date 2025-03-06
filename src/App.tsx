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
        <div className="min-h-screen flex flex-col">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-1 p-4">
            <MindMap />
          </main>
        </div>
      </ReactFlowProvider>
    </ThemeProvider>
  )
}

export default App