import { useLayoutEffect, useEffect, useRef } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import useStore from '../store';

import DragIcon from './DragIcon';

export type NodeData = {
  label: string;
  collapsed?: boolean;
};

function MindMapNode({ id, data }: NodeProps<NodeData>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const toggleNodeCollapse = useStore((state) => state.toggleNodeCollapse);
  const nodes = useStore((state) => state.nodes);
  
  // 子ノードを持っているか確認
  const hasChildren = nodes.some(node => node.parentNode === id);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 1);
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${data.label.length * 8}px`;
    }
  }, [data.label.length]);

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNodeCollapse(id);
  };

  return (
    <>
      <div className="inputWrapper">
        <div className="dragHandle">
          <DragIcon />
        </div>
        <input
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
          ref={inputRef}
        />
        {hasChildren && (
          <div className="collapseButton" onClick={handleToggleCollapse}>
            {data.collapsed ? 
              <VisibilityOffIcon sx={{ fontSize: 16 }} /> : 
              <VisibilityIcon sx={{ fontSize: 16 }} />
            }
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </>
  );
}

export default MindMapNode;
