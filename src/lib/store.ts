import { create } from 'zustand'
import { 
  Edge, 
  Node, 
  addEdge,
  Connection, 
  EdgeChange, 
  NodeChange, 
  applyNodeChanges, 
  applyEdgeChanges
} from 'reactflow'
import { persist } from 'zustand/middleware'

export interface TodoNode {
  id: string
  text: string
  completed: boolean
  collapsed?: boolean
  children?: string[]
}

interface MindMapState {
  nodes: Node[]
  edges: Edge[]
  todos: Record<string, TodoNode>
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addTodo: (parentId: string | null, text: string) => void
  updateTodo: (id: string, text: string) => void
  toggleTodoComplete: (id: string) => void
  deleteTodo: (id: string) => void
  toggleNodeCollapse: (id: string) => void
}

const initialNodes: Node[] = [
  {
    id: 'root',
    type: 'todoNode',
    data: { label: 'Main Tasks', id: 'root', completed: false, collapsed: false },
    position: { x: 0, y: 0 },
  },
]

const initialTodos: Record<string, TodoNode> = {
  root: {
    id: 'root',
    text: 'Main Tasks',
    completed: false,
    collapsed: false,
    children: [],
  },
}

// Helper function to generate unique IDs
const generateId = () => {
  return Math.random().toString(36).substring(2, 9)
}

export const useMindMapStore = create<MindMapState>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: [],
      todos: initialTodos,
      
      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },
      
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        })
      },
      
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge({ ...connection, type: 'smoothstep' }, get().edges),
        })
      },
      
      addTodo: (parentId: string | null, text: string) => {
        const id = generateId()
        const newTodo: TodoNode = {
          id,
          text,
          completed: false,
          collapsed: false,
          children: [],
        }
        
        const position = { x: 0, y: 0 }
        if (parentId) {
          const parent = get().todos[parentId]
          const parentNode = get().nodes.find(node => node.id === parentId)
          
          if (parent && parentNode) {
            // Update parent's children list
            const updatedParent = {
              ...parent,
              children: [...(parent.children || []), id],
            }
            
            // Calculate position relative to parent
            const parentChildren = parent.children || []
            position.x = parentNode.position.x + 250
            position.y = parentNode.position.y + (parentChildren.length * 100)
            
            // Create an edge from parent to new node
            const newEdge: Edge = {
              id: `e${parentId}-${id}`,
              source: parentId,
              target: id,
              type: 'smoothstep',
            }
            
            set({
              todos: {
                ...get().todos,
                [id]: newTodo,
                [parentId]: updatedParent,
              },
              nodes: [
                ...get().nodes,
                {
                  id,
                  type: 'todoNode',
                  data: { label: text, id, completed: false, collapsed: false },
                  position,
                },
              ],
              edges: [...get().edges, newEdge],
            })
          }
        } else {
          // Add as a top-level node if no parent
          set({
            todos: {
              ...get().todos,
              [id]: newTodo,
            },
            nodes: [
              ...get().nodes,
              {
                id,
                type: 'todoNode',
                data: { label: text, id, completed: false, collapsed: false },
                position: { x: 0, y: get().nodes.length * 100 },
              },
            ],
          })
        }
      },
      
      updateTodo: (id: string, text: string) => {
        const todo = get().todos[id]
        if (todo) {
          const updatedTodo = {
            ...todo,
            text,
          }
          
          set({
            todos: {
              ...get().todos,
              [id]: updatedTodo,
            },
            nodes: get().nodes.map(node => 
              node.id === id 
                ? { ...node, data: { ...node.data, label: text } } 
                : node
            ),
          })
        }
      },
      
      toggleTodoComplete: (id: string) => {
        const todo = get().todos[id]
        if (todo) {
          const completed = !todo.completed
          const updatedTodo = {
            ...todo,
            completed,
          }
          
          set({
            todos: {
              ...get().todos,
              [id]: updatedTodo,
            },
            nodes: get().nodes.map(node => 
              node.id === id 
                ? { ...node, data: { ...node.data, completed } } 
                : node
            ),
          })
        }
      },
      
      deleteTodo: (id: string) => {
        if (id === 'root') {
          // Don't allow deleting the root node
          return
        }
        
        const { todos, nodes, edges } = get()
        const todo = todos[id]
        
        if (!todo) return
        
        // Find parent to update its children list
        let parentId: string | null = null
        Object.values(todos).forEach(t => {
          if (t.children?.includes(id)) {
            parentId = t.id
          }
        })
        
        const newTodos = { ...todos }
        delete newTodos[id]
        
        // Update parent's children list if necessary
        if (parentId) {
          const parent = newTodos[parentId]
          if (parent && parent.children) {
            newTodos[parentId] = {
              ...parent,
              children: parent.children.filter(childId => childId !== id),
            }
          }
        }
        
        // Recursively delete all child nodes
        const deleteChildren = (nodeId: string) => {
          const node = todos[nodeId]
          if (node && node.children) {
            node.children.forEach(childId => {
              delete newTodos[childId]
              deleteChildren(childId)
            })
          }
        }
        
        if (todo.children) {
          todo.children.forEach(childId => {
            delete newTodos[childId]
            deleteChildren(childId)
          })
        }
        
        // Remove the node and its related edges
        set({
          todos: newTodos,
          nodes: nodes.filter(node => node.id !== id && 
                               !todo.children?.includes(node.id)),
          edges: edges.filter(edge => 
            edge.source !== id && edge.target !== id &&
            !todo.children?.includes(edge.source) && 
            !todo.children?.includes(edge.target)
          ),
        })
      },
      
      toggleNodeCollapse: (id: string) => {
        const todo = get().todos[id]
        if (todo) {
          const collapsed = !todo.collapsed
          const updatedTodo = {
            ...todo,
            collapsed,
          }
          
          const { nodes, edges } = get()
          
          // Update node data
          const updatedNodes = nodes.map(node => 
            node.id === id 
              ? { ...node, data: { ...node.data, collapsed } } 
              : node
          )
          
          // Hide or show child nodes and their edges based on collapse state
          const processChildren = (todoId: string, hide: boolean, childrenIds: string[] = []) => {
            const currentTodo = get().todos[todoId]
            if (!currentTodo || !currentTodo.children || currentTodo.children.length === 0) {
              return childrenIds
            }
            
            const directChildren = currentTodo.children
            childrenIds.push(...directChildren)
            
            // Recursively process all descendants
            directChildren.forEach(childId => {
              processChildren(childId, hide, childrenIds)
            })
            
            return childrenIds
          }
          
          const childrenIds = processChildren(id, collapsed)
          
          // Update visibility of child nodes and edges
          const visibleNodes = collapsed 
            ? updatedNodes.filter(node => !childrenIds.includes(node.id))
            : updatedNodes
            
          const visibleEdges = collapsed
            ? edges.filter(edge => 
                !childrenIds.includes(edge.target) && 
                !childrenIds.includes(edge.source))
            : edges
          
          set({
            todos: {
              ...get().todos,
              [id]: updatedTodo,
            },
            nodes: visibleNodes,
            edges: visibleEdges,
          })
        }
      },
    }),
    {
      name: 'mindmap-todo-storage',
    }
  )
)