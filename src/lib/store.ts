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
import { debouncedSave } from './storage/storageStore'

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
  hiddenNodes: Node[]
  hiddenEdges: Edge[]
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
    data: { 
      label: 'Main Tasks', 
      id: 'root', 
      completed: false, 
      collapsed: false,
      isRoot: true
    },
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

// Helper function to trigger save after state updates
const withAutoSave = <T extends object>(newState: T): T => {
  // Schedule a debounced save
  setTimeout(() => {
    const { nodes, edges, todos } = useMindMapStore.getState();
    debouncedSave({ nodes, edges, todos });
  }, 0);
  
  return newState;
};

export const useMindMapStore = create<MindMapState>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: [],
      todos: initialTodos,
      hiddenNodes: [],
      hiddenEdges: [],
      
      onNodesChange: (changes: NodeChange[]) => {
        // ドラッグによる位置変更を処理
        const dragChanges = changes.filter(change => 
          change.type === 'position' && 'position' in change && change.position
        );

        // 複数のノードが同時に移動する可能性があるため、それぞれの変更を処理
        dragChanges.forEach(change => {
          const { id, position } = change as { id: string, position: { x: number, y: number } };
          const draggedNode = get().nodes.find(node => node.id === id);
          const draggedTodo = get().todos[id];

          if (draggedNode && draggedTodo && position) {
            const dx = position.x - draggedNode.position.x;
            const dy = position.y - draggedNode.position.y;

            // 全ての子孫ノードを再帰的に移動
            const moveDescendants = (todoId: string, deltaX: number, deltaY: number) => {
              const todo = get().todos[todoId];
              if (!todo?.children?.length) return;

              todo.children.forEach(childId => {
                const childNode = get().nodes.find(n => n.id === childId);
                if (childNode) {
                  // 子ノードの位置を更新
                  childNode.position.x += deltaX;
                  childNode.position.y += deltaY;
                }
                // 再帰的に子ノードの子も移動
                moveDescendants(childId, deltaX, deltaY);
              });
            };

            // ドラッグされたノードの子孫を移動
            moveDescendants(id, dx, dy);
          }
        });

        // 通常の変更を適用（自動保存も実行）
        set(withAutoSave({
          nodes: applyNodeChanges(changes, get().nodes),
        }));
      },
      
      onEdgesChange: (changes: EdgeChange[]) => {
        set(withAutoSave({
          edges: applyEdgeChanges(changes, get().edges),
        }));
      },
      
      onConnect: (connection: Connection) => {
        set(withAutoSave({
          edges: addEdge({ 
            ...connection, 
            type: 'straight',
            style: { 
              stroke: '#F59E0B', 
              strokeWidth: 2,
              strokeDasharray: '0'
            }
          }, get().edges),
        }));
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
            position.y = parentNode.position.y + (parentChildren.length * 80) - (parentChildren.length > 0 ? 40 * parentChildren.length : 0)
            
            // Create an edge from parent to new node with updated style
            const newEdge: Edge = {
              id: `e${parentId}-${id}`,
              source: parentId,
              target: id,
              type: 'straight',
              style: { 
                stroke: '#F59E0B', 
                strokeWidth: 2,
                strokeDasharray: '0'
              },
              animated: false
            }
            
            set(withAutoSave({
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
            }))
          }
        } else {
          // Add as a top-level node if no parent
          // Find root node for positioning
          const rootNode = get().nodes.find(node => node.id === 'root')
          const rootPosition = rootNode ? rootNode.position : { x: 0, y: 0 }
          
          position.x = rootPosition.x - 250 // Position to the left of root
          position.y = rootPosition.y + get().nodes.length * 80 - 100
          
          set(withAutoSave({
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
                position,
              },
            ],
          }))
        }
      },
      
      updateTodo: (id: string, text: string) => {
        const todo = get().todos[id]
        if (todo) {
          const updatedTodo = {
            ...todo,
            text,
          }
          
          set(withAutoSave({
            todos: {
              ...get().todos,
              [id]: updatedTodo,
            },
            nodes: get().nodes.map(node => 
              node.id === id 
                ? { ...node, data: { ...node.data, label: text } } 
                : node
            ),
          }))
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
          
          set(withAutoSave({
            todos: {
              ...get().todos,
              [id]: updatedTodo,
            },
            nodes: get().nodes.map(node => 
              node.id === id 
                ? { ...node, data: { ...node.data, completed } } 
                : node
            ),
          }))
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
        set(withAutoSave({
          todos: newTodos,
          nodes: nodes.filter(node => node.id !== id && 
                               !todo.children?.includes(node.id)),
          edges: edges.filter(edge => 
            edge.source !== id && edge.target !== id &&
            !todo.children?.includes(edge.source) && 
            !todo.children?.includes(edge.target)
          ),
          hiddenNodes: get().hiddenNodes.filter(node => 
            node.id !== id && !todo.children?.includes(node.id)
          ),
          hiddenEdges: get().hiddenEdges.filter(edge => 
            edge.source !== id && edge.target !== id &&
            !todo.children?.includes(edge.source) && 
            !todo.children?.includes(edge.target)
          ),
        }))
      },
      
      toggleNodeCollapse: (id: string) => {
        const todo = get().todos[id]
        if (todo) {
          const collapsed = !todo.collapsed
          const updatedTodo = {
            ...todo,
            collapsed,
          }
          
          const { nodes, edges, hiddenNodes, hiddenEdges } = get()
          
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
          
          if (collapsed) {
            // ノードを閉じる場合: ノードを非表示にして隠れたノードのリストに追加
            const nodesToHide = nodes.filter(node => childrenIds.includes(node.id))
            const edgesToHide = edges.filter(edge => 
              childrenIds.includes(edge.target) || childrenIds.includes(edge.source)
            )
            
            set(withAutoSave({
              todos: {
                ...get().todos,
                [id]: updatedTodo,
              },
              nodes: updatedNodes.filter(node => !childrenIds.includes(node.id)),
              edges: edges.filter(edge => 
                !childrenIds.includes(edge.target) && !childrenIds.includes(edge.source)
              ),
              hiddenNodes: [...hiddenNodes, ...nodesToHide],
              hiddenEdges: [...hiddenEdges, ...edgesToHide],
            }))
          } else {
            // ノードを開く場合: 隠れたノードのリストから対象の子ノードを復元
            const nodesToShow = hiddenNodes.filter(node => childrenIds.includes(node.id))
            const edgesToShow = hiddenEdges.filter(edge => 
              (childrenIds.includes(edge.source) || childrenIds.includes(edge.target))
            )
            
            set(withAutoSave({
              todos: {
                ...get().todos,
                [id]: updatedTodo,
              },
              nodes: [...updatedNodes, ...nodesToShow],
              edges: [...edges, ...edgesToShow],
              hiddenNodes: hiddenNodes.filter(node => !childrenIds.includes(node.id)),
              hiddenEdges: hiddenEdges.filter(edge => 
                !(childrenIds.includes(edge.source) || childrenIds.includes(edge.target))
              ),
            }))
          }
        }
      },
    }),
    {
      name: 'mindmap-todo-storage',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        todos: state.todos,
      }),
    }
  )
)