import { useCallback, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Node,
  NodeTypes,
  Edge,
  Panel,
  useReactFlow,
  ConnectionLineType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useMindMapStore } from '@/lib/store'
import TodoNode from './TodoNode'

const nodeTypes: NodeTypes = {
  todoNode: TodoNode,
}

// Custom edge style - 実線に変更、矢印なし
const edgeOptions = {
  style: { 
    stroke: '#F59E0B', // Amber-500 (matching the orange node theme)
    strokeWidth: 2,
    strokeDasharray: '0', // 点線を無効化
  },
  type: 'straight',
  animated: false,
}

export default function MindMap() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addTodo,
  } = useMindMapStore()
  
  const reactFlowInstance = useReactFlow()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleAddRootTodo = useCallback(() => {
    setIsLoading(true)
    addTodo('root', 'New Task')
    setTimeout(() => setIsLoading(false), 300)
  }, [addTodo])
  
  const handleAddStandaloneTodo = useCallback(() => {
    setIsLoading(true)
    addTodo(null, 'New Standalone Task')
    setTimeout(() => setIsLoading(false), 300)
  }, [addTodo])
  
  const fitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 })
  }, [reactFlowInstance])
  
  // Mark the root node
  const nodesWithRoot = nodes.map(node => {
    if (node.id === 'root') {
      return {
        ...node,
        data: {
          ...node.data,
          isRoot: true
        }
      }
    }
    return node
  })
  
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900 border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodesWithRoot}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        connectionLineType={ConnectionLineType.Straight}
        connectionLineStyle={{
          stroke: '#F59E0B',
          strokeWidth: 2,
          strokeDasharray: '0', // 点線を無効化
        }}
        defaultEdgeOptions={edgeOptions}
      >
        <Background color="#aaa" gap={16} size={1} />
        <Controls position="bottom-right" showInteractive={false} />
        
        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={handleAddRootTodo}
            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md flex items-center gap-1 text-sm transition-colors shadow-sm"
            disabled={isLoading}
          >
            <span className="material-icons text-sm">add</span>
            Add Task
          </button>
          
          <button
            onClick={handleAddStandaloneTodo}
            className="bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-md flex items-center gap-1 text-sm transition-colors shadow-sm"
            disabled={isLoading}
          >
            <span className="material-icons text-sm">add_circle</span>
            Add Standalone
          </button>
          
          <button
            onClick={fitView}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded-md text-sm flex items-center gap-1 transition-colors shadow-sm"
          >
            <span className="material-icons text-sm">fit_screen</span>
            Fit View
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}