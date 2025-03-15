import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from 'reactflow';
import create from 'zustand';
import { nanoid } from 'nanoid/non-secure';

import { NodeData } from './MindMapNode';
import { loadMindMapFromStorage, saveMindMapToStorage } from '../utils/storage';

export type RFState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeLabel: (nodeId: string, label: string) => void;
  addChildNode: (parentNode: Node, position: XYPosition) => void;
  toggleNodeCollapse: (nodeId: string) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

// デフォルトのノードとエッジ
const defaultNodes: Node<NodeData>[] = [
  {
    id: 'root',
    type: 'mindmap',
    data: { label: 'React Flow Mind Map', collapsed: false },
    position: { x: 0, y: 0 },
    dragHandle: '.dragHandle',
  },
];
const defaultEdges: Edge[] = [];

const useStore = create<RFState>((set, get) => ({
  // 初期化フラグ
  initialized: false,
  setInitialized: (value: boolean) => set({ initialized: value }),

  // デフォルト値で初期化
  nodes: [...defaultNodes],
  edges: [...defaultEdges],

  // ノード変更
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    
    // 変更があった時に自動保存
    setTimeout(() => get().saveToStorage(), 0);
  },

  // エッジ変更
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    
    // 変更があった時に自動保存
    setTimeout(() => get().saveToStorage(), 0);
  },

  // ノードラベル更新
  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = { ...node.data, label };
        }

        return node;
      }),
    });
    
    // 変更があった時に自動保存
    setTimeout(() => get().saveToStorage(), 0);
  },

  // 子ノード追加
  addChildNode: (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: nanoid(),
      type: 'mindmap',
      data: { label: 'New Node', collapsed: false },
      position,
      parentNode: parentNode.id,
      dragHandle: '.dragHandle',
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
    
    // 変更があった時に自動保存
    setTimeout(() => get().saveToStorage(), 0);
  },

  // ノードの折りたたみトグル
  toggleNodeCollapse: (nodeId: string) => {
    // ノードの展開/折りたたみ状態を切り替える
    const nodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            collapsed: !node.data.collapsed,
          },
        };
      }
      return node;
    });

    // 親ノードが折りたたまれているかどうかを確認
    const parentNode = nodes.find((n) => n.id === nodeId);
    const isParentCollapsed = parentNode?.data.collapsed;

    // 影響を受けるノードとエッジのIDを収集する関数
    const getDescendantIds = (nodeId: string): string[] => {
      const directChildren = nodes.filter((n) => n.parentNode === nodeId).map((n) => n.id);
      const allDescendants = [...directChildren];
      
      // 再帰的に子孫を取得
      directChildren.forEach((childId) => {
        allDescendants.push(...getDescendantIds(childId));
      });
      
      return allDescendants;
    };

    // 対象ノードのすべての子孫IDを取得
    const descendantIds = getDescendantIds(nodeId);

    // ノードの表示/非表示を更新
    const updatedNodes = nodes.map((node) => {
      if (descendantIds.includes(node.id)) {
        return {
          ...node,
          hidden: isParentCollapsed,
        };
      }
      return node;
    });

    // エッジの表示/非表示を更新
    const updatedEdges = get().edges.map((edge) => {
      // 親ノードから子ノードへのエッジ、または子孫ノード間のエッジを非表示にする
      if (edge.source === nodeId || descendantIds.includes(edge.source) || descendantIds.includes(edge.target)) {
        return {
          ...edge,
          hidden: isParentCollapsed,
        };
      }
      return edge;
    });

    set({ 
      nodes: updatedNodes,
      edges: updatedEdges
    });
    
    // 変更があった時に自動保存
    setTimeout(() => get().saveToStorage(), 0);
  },

  // ストレージから読み込み
  loadFromStorage: () => {
    try {
      const data = loadMindMapFromStorage();
      
      if (data) {
        set({
          nodes: data.nodes,
          edges: data.edges,
          initialized: true
        });
        console.log('ストレージからマインドマップを読み込みました');
      } else {
        set({
          nodes: [...defaultNodes],
          edges: [...defaultEdges],
          initialized: true
        });
        console.log('ストレージにデータがないため、デフォルト状態で初期化しました');
      }
    } catch (error) {
      console.error('ストレージからの読み込み中にエラーが発生しました:', error);
      set({
        nodes: [...defaultNodes],
        edges: [...defaultEdges],
        initialized: true
      });
    }
  },

  // ストレージに保存
  saveToStorage: () => {
    const { nodes, edges } = get();
    
    // 初期化済みの場合のみ保存を実行
    if (get().initialized) {
      saveMindMapToStorage(nodes, edges);
    }
  }
}));

export default useStore;
