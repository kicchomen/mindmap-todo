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
  const [isHovered, setIsHovered] = useState(false)
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
        "rounded-md p-3 shadow-sm transition-all duration-200",
        isRoot 
          ? "bg-white text-gray-900 border-2 border-primary font-semibold min-w-[180px]" // 親ノードを白抜きに
          : "bg-primary text-white min-w-[160px]",
        selected || isHovered
          ? "shadow-lg scale-105 z-10" 
          : "hover:shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-2 h-2 bg-blue-500" 
      />
      
      {!isEditing ? (
        <div className="font-medium mb-2 flex justify-between items-center">
          <div className="truncate flex-grow">{data.label}</div>
          
          {/* チェックボタンを常時表示 */}
          <button
            onClick={handleToggleComplete}
            className={cn(
              "p-1 rounded-full ml-2",
              data.completed ? "text-green-500" : "text-gray-400"
            )}
            title={data.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {data.completed ? (
              <span className="material-icons text-sm">check_circle</span>
            ) : (
              <span className="material-icons text-sm">radio_button_unchecked</span>
            )}
          </button>
        </div>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="bg-white text-gray-900 p-2 rounded text-sm w-full mb-2"
          autoFocus
        />
      )}
      
      <div className="flex justify-between items-center">
        {/* 開閉ボタンを常時表示 */}
        <div>
          {hasChildren && (
            <button 
              onClick={handleToggleCollapse}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
              title={data.collapsed ? "Expand" : "Collapse"}
            >
              {data.collapsed ? (
                <span className="material-icons text-sm">chevron_right</span>
              ) : (
                <span className="material-icons text-sm">expand_more</span>
              )}
            </button>
          )}
        </div>
        
        {/* アクションボタン - ホバー時または選択時のみ表示 */}
        {(selected || isHovered) && (
          <div className="flex space-x-1">
            <button
              onClick={handleEdit}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
              title="Edit"
            >
              <span className="material-icons text-sm">edit</span>
            </button>
            
            {!isRoot && (
              <button
                onClick={handleDelete}
                className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
                title="Delete"
              >
                <span className="material-icons text-sm">delete</span>
              </button>
            )}
            
            <button
              onClick={handleAddChild}
              className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
              title="Add child task"
            >
              <span className="material-icons text-sm">add</span>
            </button>
          </div>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-2 h-2 bg-blue-500" 
      />
    </div>
  )
}