import { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  ConnectionLineType,
  NodeOrigin,
  Node,
  OnConnectEnd,
  OnConnectStart,
  useReactFlow,
  useStoreApi,
  Controls,
  Panel,
  Background,
  BackgroundVariant
} from 'reactflow';
import shallow from 'zustand/shallow';

import useStore, { RFState } from './store';
import MindMapNode from './MindMapNode';
import MindMapEdge from './MindMapEdge';
import Header from '../components/layout/Header';
import SidePanel from '../components/layout/SidePanel';
import NavigationBar from '../components/layout/NavigationBar';

// we need to import the React Flow styles to make it work
import 'reactflow/dist/style.css';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  loadFromStorage: state.loadFromStorage,
  initialized: state.initialized,
  setInitialized: state.setInitialized,
});

const nodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const connectionLineStyle = { stroke: '#F6AD55', strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'mindmap' };

function Flow() {
  const store = useStoreApi();
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    addChildNode,
    loadFromStorage,
    initialized,
    setInitialized
  } = useStore(selector, shallow);
  
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const connectingNodeRef = useRef<string | null>(null);
  const reactFlowInstance = useReactFlow();
  const [searchHighlightedNodes, setSearchHighlightedNodes] = useState<string[]>([]);
  
  // サイドパネルの表示モードを管理
  const [sidePanelMode, setSidePanelMode] = useState<string>('tree');
  // サイドパネルの表示/非表示
  const [showSidePanel, setShowSidePanel] = useState<boolean>(true);

  // アプリが初期化されるときにストレージから読み込む
  useEffect(() => {
    if (!initialized) {
      console.log('マインドマップデータをストレージから読み込みます');
      loadFromStorage();
    }
  }, [initialized, loadFromStorage]);

  const getChildNodePosition = (event: MouseEvent, parentNode?: Node) => {
    const { domNode } = store.getState();

    if (
      !domNode ||
      !parentNode?.positionAbsolute ||
      !event.target ||
      !(event.target instanceof HTMLElement)
    ) {
      return;
    }

    const { top, left } = domNode.getBoundingClientRect();
    const panePosition = reactFlowInstance.project({
      x: event.clientX - left,
      y: event.clientY - top,
    });

    return {
      x: panePosition.x,
      y: panePosition.y,
    };
  };

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeRef.current = nodeId;
    setConnectingNodeId(nodeId);
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        'react-flow__pane'
      );
      const node = (event.target as Element).closest('.react-flow__node');

      if (node) {
        node.querySelector('input')?.focus({ preventScroll: true });
      } else if (targetIsPane && connectingNodeRef.current) {
        const parentNode = nodeInternals.get(connectingNodeRef.current);
        const childNodePosition = getChildNodePosition(
          event as unknown as MouseEvent,
          parentNode
        );

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, childNodePosition);
        }
      }

      setConnectingNodeId(null);
      connectingNodeRef.current = null;
    },
    [getChildNodePosition]
  );

  // 検索機能の実装
  const handleSearch = (query: string) => {
    // 検索クエリが空の場合はハイライトをクリア
    if (!query) {
      setSearchHighlightedNodes([]);
      return;
    }

    // 検索クエリに一致するノードを検索
    const matchingNodeIds = nodes
      .filter(node => 
        node.data.label.toLowerCase().includes(query.toLowerCase())
      )
      .map(node => node.id);

    // 一致するノードをハイライト
    setSearchHighlightedNodes(matchingNodeIds);

    // 一致するノードが見つかった場合、最初のノードにビューをセンタリング
    if (matchingNodeIds.length > 0) {
      const firstMatchingNode = nodes.find(node => node.id === matchingNodeIds[0]);
      if (firstMatchingNode && firstMatchingNode.position) {
        reactFlowInstance.setCenter(
          firstMatchingNode.position.x,
          firstMatchingNode.position.y,
          { duration: 800 }
        );
      }
    }
  };

  // ナビゲーションアイテムがクリックされたときの処理
  const handleNavigationItemClick = (item: string) => {
    // treeとstorageの場合はサイドパネルモードを設定し、パネルを表示
    if (item === 'tree' || item === 'storage') {
      setSidePanelMode(item);
      setShowSidePanel(true);
    } else {
      // それ以外のアイテム（account, projectsなど）はサイドパネルを非表示に
      // ※必要に応じて他のUIコンポーネントを表示する処理を追加
      setShowSidePanel(false);
    }
  };

  return (
    <div className="flex h-screen">
      <NavigationBar 
        activeItem={sidePanelMode} 
        onItemClick={handleNavigationItemClick} 
      />
      <div className="flex-1 ml-16">
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            // 検索結果に含まれるノードをハイライト
            className: searchHighlightedNodes.includes(node.id) ? 'search-highlighted' : undefined
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          connectionLineStyle={connectionLineStyle}
          connectionLineType={ConnectionLineType.Straight}
          defaultEdgeOptions={defaultEdgeOptions}
          nodeOrigin={nodeOrigin}
          className="bg-slate-50"
          fitView
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Header onSearch={handleSearch} />
          {showSidePanel && <SidePanel mode={sidePanelMode} />}
          <Controls showInteractive={false} />
          <Background variant={BackgroundVariant.Dots} gap={16} size={2} color="#F6AD55" />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Flow;