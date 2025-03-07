import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  Node,
  NodeTypes,
  Panel,
  useReactFlow,
  ConnectionLineType,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useMindMapStore } from '@/lib/store'
import TodoNode from './TodoNode'

const nodeTypes: NodeTypes = {
  todoNode: TodoNode,
}

// カスタムエッジスタイル - 直線に変更
const edgeOptions = {
  style: { 
    stroke: '#888', 
    strokeWidth: 2 
  },
  type: 'straight', // smoothstep から straight に変更
  animated: false,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
  },
}

export default function MindMap() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange,
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
    <div className="w-full h-[calc(100vh-64px)]"> {/* 高さを調整して画面スクロールを防止 */}
      <ReactFlow
        nodes={nodesWithRoot}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        connectionLineType={ConnectionLineType.Straight} // 接続線の種類を直線に
        connectionLineStyle={{
          stroke: '#888',
          strokeWidth: 2,
        }}
        defaultEdgeOptions={edgeOptions}
        connectOnClick={false} // ドラッグでノード間接続を無効化
      >
        <Background color="#aaa" gap={16} size={1} />
        <Controls position="bottom-right" showInteractive={false} />
        
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