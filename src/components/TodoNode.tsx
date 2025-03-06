import { useState, useRef, useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { cn } from '@/lib/utils'
import { useMindMapStore, TodoNode as TodoNodeType } from '@/lib/store'

interface TodoNodeData {
  label: string
  id: string
  completed: boolean
  collapsed?: boolean
}

export default function TodoNode({ id, data }: NodeProps<TodoNodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(data.label)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { 
    updateTodo, 
    toggleTodoComplete, 
    deleteTodo, 
    toggleNodeCollapse,
    addTodo,
    todos
  } = useMindMapStore()
  
  const todo = todos[id] as TodoNodeType
  const hasChildren = todo?.children && todo.children.length > 0
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])
  
  const handleEdit = () => {
    setIsEditing(true)
  }
  
  const handleSave = () => {
    updateTodo(id, text)
    setIsEditing(false)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }
  
  const handleToggleComplete = () => {
    toggleTodoComplete(id)
  }
  
  const handleDelete = () => {
    deleteTodo(id)
  }
  
  const handleToggleCollapse = () => {
    toggleNodeCollapse(id)
  }
  
  const handleAddChild = () => {
    addTodo(id, 'New Task')
  }
  
  return (
    <div className={cn(
      "border rounded-lg p-3 w-60 shadow-sm bg-card",
      "transition-all hover:shadow-md",
      data.completed ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-border"
    )}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      
      <div className="flex items-center mb-2">
        {hasChildren && (
          <button 
            onClick={handleToggleCollapse}
            className="mr-1 p-1 rounded-full hover:bg-muted"
          >
            {data.collapsed ? (
              <span className="material-icons text-sm">chevron_right</span>
            ) : (
              <span className="material-icons text-sm">expand_more</span>
            )}
          </button>
        )}
        
        <button
          onClick={handleToggleComplete}
          className={cn(
            "p-1 rounded-full",
            data.completed ? "text-green-500 hover:text-green-600" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {data.completed ? (
            <span className="material-icons">check_circle</span>
          ) : (
            <span className="material-icons">cancel</span>
          )}
        </button>
      </div>
      
      <div className="flex flex-col">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="bg-background p-2 border rounded mb-2"
          />
        ) : (
          <p className={cn(
            "font-medium mb-2",
            data.completed && "line-through text-muted-foreground"
          )}>
            {data.label}
          </p>
        )}
        
        <div className="flex justify-end space-x-1 mt-2">
          <button
            onClick={handleEdit}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <span className="material-icons text-sm">edit</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
            disabled={id === 'root'}
          >
            <span className="material-icons text-sm">delete</span>
          </button>
          
          <button
            onClick={handleAddChild}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <span className="material-icons text-sm">add</span>
          </button>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  )
}