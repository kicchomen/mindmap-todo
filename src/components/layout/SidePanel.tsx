import React from 'react';
import useStore from '../../App/store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { NodeData } from '../../App/MindMapNode';
import { useReactFlow } from 'reactflow';
import { clearMindMapFromStorage } from '../../utils/storage';

interface SidePanelProps {
  className?: string;
}

interface TreeNodeProps {
  node: any;
  nodes: any[];
  level: number;
  reactFlowInstance: any;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, nodes, level, reactFlowInstance }) => {
  const [expanded, setExpanded] = React.useState(level < 2);
  
  // Find child nodes
  const childNodes = nodes.filter(n => n.parentNode === node.id && !n.hidden);
  const hasChildren = childNodes.length > 0;
  
  const handleClick = () => {
    // ノードをクリックした際に、そのノードにビューをセンタリング
    if (node.position) {
      reactFlowInstance.setCenter(
        node.position.x,
        node.position.y,
        { duration: 800 }
      );
    }
  };
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  return (
    <div className="select-none">
      <div 
        className="flex items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
        onClick={handleClick}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <span className="mr-1 text-gray-500" onClick={toggleExpand}>
            {expanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
          </span>
        ) : (
          <span className="mr-1 w-6"></span>
        )}
        
        <span className="text-sm truncate">{node.data.label}</span>
      </div>
      
      {expanded && hasChildren && (
        <div className="ml-2">
          {childNodes.map(childNode => (
            <TreeNode 
              key={childNode.id} 
              node={childNode} 
              nodes={nodes} 
              level={level + 1}
              reactFlowInstance={reactFlowInstance}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StorageSection: React.FC = () => {
  const saveToStorage = useStore(state => state.saveToStorage);
  const loadFromStorage = useStore(state => state.loadFromStorage);
  
  const handleSave = () => {
    saveToStorage();
    alert('マインドマップをlocalStorageに手動保存しました');
  };
  
  const handleLoad = () => {
    loadFromStorage();
    alert('マインドマップをlocalStorageから再読み込みしました');
  };
  
  const handleClear = () => {
    if (window.confirm('マインドマップのデータをlocalStorageから削除しますか？\n(この操作は元に戻せません)')) {
      clearMindMapFromStorage();
      alert('マインドマップのデータをlocalStorageから削除しました。\n再読み込みするとデフォルト状態に戻ります。');
    }
  };
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">データ保存</h2>
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleSave}
          className="flex items-center text-xs px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600"
        >
          <SaveIcon fontSize="small" className="mr-1" />
          手動保存
        </button>
        <button
          onClick={handleLoad}
          className="flex items-center text-xs px-2 py-1 rounded bg-green-50 hover:bg-green-100 text-green-600"
        >
          <RefreshIcon fontSize="small" className="mr-1" />
          再読み込み
        </button>
        <button
          onClick={handleClear}
          className="flex items-center text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600"
        >
          <DeleteIcon fontSize="small" className="mr-1" />
          データクリア
        </button>
        <div className="text-xs text-gray-500 mt-1">
          ※編集時は自動保存されています
        </div>
      </div>
    </div>
  );
};

const SidePanel: React.FC<SidePanelProps> = ({ className }) => {
  // storeからノードを取得
  const nodes = useStore(state => state.nodes);
  const reactFlowInstance = useReactFlow();
  
  // 非表示でないルートノードを取得
  const rootNodes = nodes.filter(node => !node.parentNode && !node.hidden);
  
  return (
    <div className={`fixed top-24 left-20 z-40 bg-white/95 backdrop-blur-sm shadow-md rounded-3xl p-3 max-w-xs w-64 max-h-[calc(100vh-140px)] overflow-auto border-2 border-gray-300 ${className || ''}`}>
      <div className="mb-2 pb-2 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">Todo ツリー</h2>
      </div>
      <div className="space-y-1">
        {rootNodes.map(node => (
          <TreeNode 
            key={node.id} 
            node={node} 
            nodes={nodes} 
            level={0}
            reactFlowInstance={reactFlowInstance}
          />
        ))}
      </div>
      
      {/* ストレージ管理セクション */}
      <StorageSection />
    </div>
  );
};

export default SidePanel;
