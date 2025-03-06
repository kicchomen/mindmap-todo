import { cn } from '@/lib/utils'
import { useTheme } from './theme-provider'

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { setTheme } = useTheme()
  
  const handleThemeToggle = () => {
    toggleDarkMode()
    setTheme(darkMode ? 'light' : 'dark')
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