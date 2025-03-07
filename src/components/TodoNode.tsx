import { useState, useRef, useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { cn } from '@/lib/utils'
import { useMindMapStore, TodoNode as TodoNodeType } from '@/lib/store'

interface TodoNodeData {
  label: string
  id: string
  completed: boolean
  collapsed?: boolean
  isRoot?: boolean
}

export default function TodoNode({ id, data, selected }: NodeProps<TodoNodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(data.label)
  const [isExpanded, setIsExpanded] = useState(false)
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
  const isRoot = id === 'root' || data.isRoot
  
  // When node is selected, expand it
  useEffect(() => {
    if (selected) {
      setIsExpanded(true)
    } else {
      setIsExpanded(false)
    }
  }, [selected])
  
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
    <div 
      className={cn(
        "rounded-md p-2 shadow-sm",
        "transition-all duration-200",
        isRoot 
          ? "bg-orange-400 text-gray-900 min-w-[150px]" 
          : "bg-orange-300 text-gray-900 min-w-[120px]",
        selected || isExpanded 
          ? "shadow-lg scale-110 z-10" 
          : "hover:shadow-md"
      )}
      style={{ 
        transition: 'all 0.2s ease'
      }}
    >
      {/* ハンドルを完全に非表示に */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          opacity: 0,
          width: 0,
          height: 0,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
      
      <div className="flex items-center gap-1">
        <div className="text-gray-700 mr-1">
          <span className="material-icons text-base select-none">drag_indicator</span>
        </div>
        
        {!isEditing ? (
          <div className="font-medium truncate">
            {data.label}
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="bg-white/90 p-1 rounded text-sm w-full"
            autoFocus
          />
        )}
      </div>
      
      {(selected || isExpanded) && (
        <div className="flex mt-2 justify-end space-x-1 animate-in fade-in zoom-in duration-200">
          {hasChildren && (
            <button 
              onClick={handleToggleCollapse}
              className="p-1 rounded-full hover:bg-orange-200 text-gray-700"
              title={data.collapsed ? "Expand" : "Collapse"}
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
              "p-1 rounded-full hover:bg-orange-200",
              data.completed ? "text-green-600" : "text-gray-700"
            )}
            title={data.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {data.completed ? (
              <span className="material-icons text-sm">check_circle</span>
            ) : (
              <span className="material-icons text-sm">radio_button_unchecked</span>
            )}
          </button>
          
          <button
            onClick={handleEdit}
            className="p-1 rounded-full hover:bg-orange-200 text-gray-700"
            title="Edit"
          >
            <span className="material-icons text-sm">edit</span>
          </button>
          
          {!isRoot && (
            <button
              onClick={handleDelete}
              className="p-1 rounded-full hover:bg-orange-200 text-gray-700"
              title="Delete"
            >
              <span className="material-icons text-sm">delete</span>
            </button>
          )}
          
          <button
            onClick={handleAddChild}
            className="p-1 rounded-full hover:bg-orange-200 text-gray-700"
            title="Add child task"
          >
            <span className="material-icons text-sm">add</span>
          </button>
        </div>
      )}
      
      {/* ハンドルを完全に非表示に */}
      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{ 
          opacity: 0,
          width: 0,
          height: 0,
          bottom: '50%',
          transform: 'translateY(50%)'
        }}
      />
    </div>
  )
}