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
      // 測定用の一時的な要素を作成
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      
      // 入力フィールドと同じフォントスタイルを設定
      const computedStyle = window.getComputedStyle(inputRef.current);
      tempSpan.style.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      
      // テキストを設定して幅を測定
      tempSpan.textContent = data.label;
      document.body.appendChild(tempSpan);
      const textWidth = tempSpan.getBoundingClientRect().width;
      document.body.removeChild(tempSpan);
      
      // 余裕を持たせるためのパディング
      const padding = 10;
      // 最小幅を30pxに設定
      const minWidth = 30;
      const calculatedWidth = Math.max(textWidth + padding, minWidth);
      
      inputRef.current.style.width = `${calculatedWidth}px`;
    }
  }, [data.label]);

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
