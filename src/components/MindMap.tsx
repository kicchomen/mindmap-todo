import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Node,
  NodeTypes,
  Panel,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useMindMapStore } from '@/lib/store'
import TodoNode from './TodoNode'

const nodeTypes: NodeTypes = {
  todoNode: TodoNode,
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
  
  const handleAddRootTodo = useCallback(() => {
    addTodo('root', 'New Task')
  }, [addTodo])
  
  const handleAddStandaloneTodo = useCallback(() => {
    addTodo(null, 'New Standalone Task')
  }, [addTodo])
  
  const fitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 })
  }, [reactFlowInstance])
  
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-background border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#6366f1', strokeWidth: 2 },
          animated: true,
        }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        
        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={handleAddRootTodo}
            className="bg-primary text-primary-foreground p-2 rounded-md flex items-center gap-1 text-sm"
          >
            <span className="material-icons text-sm">add</span>
            Add Task
          </button>
          
          <button
            onClick={handleAddStandaloneTodo}
            className="bg-secondary text-secondary-foreground p-2 rounded-md flex items-center gap-1 text-sm"
          >
            <span className="material-icons text-sm">add_circle</span>
            Add Standalone
          </button>
          
          <button
            onClick={fitView}
            className="bg-secondary text-secondary-foreground p-2 rounded-md text-sm flex items-center gap-1"
          >
            <span className="material-icons text-sm">fit_screen</span>
            Fit View
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}