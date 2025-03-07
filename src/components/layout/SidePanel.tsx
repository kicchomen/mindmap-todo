import React from 'react';
import useStore from '../../App/store';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { NodeData } from '../../App/MindMapNode';
import { useReactFlow } from 'reactflow';

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

const SidePanel: React.FC<SidePanelProps> = ({ className }) => {
  // storeからノードを取得
  const nodes = useStore(state => state.nodes);
  const reactFlowInstance = useReactFlow();
  
  // 非表示でないルートノードを取得
  const rootNodes = nodes.filter(node => !node.parentNode && !node.hidden);
  
  return (
    <div className={`fixed top-24 left-4 z-40 bg-white/95 backdrop-blur-sm shadow-md rounded-3xl p-3 max-w-xs w-64 max-h-[calc(100vh-140px)] overflow-auto border-2 border-gray-300 ${className || ''}`}>
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
    </div>
  );
};

export default SidePanel;
