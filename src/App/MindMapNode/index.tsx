import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const selectedNodeId = useStore((state) => state.selectedNodeId);
  const selectNode = useStore((state) => state.selectNode);
  const deleteNode = useStore((state) => state.deleteNode);
  const addChildNodeDirectly = useStore((state) => state.addChildNodeDirectly);
  
  // 子ノードを持っているか確認
  const hasChildren = nodes.some(node => node.parentNode === id);
  // 現在のノードが選択されているか
  const isSelected = selectedNodeId === id;
  // ルートノードかどうかを確認
  const isRootNode = id === 'root';

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
  
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // すでに選択されている場合は選択解除
    if (isSelected) {
      selectNode(null);
    } else {
      // 他のノードを選択
      selectNode(id);
    }
  };
  
  const handleDeleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };
  
  const handleAddChildNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    addChildNodeDirectly(id);
  };
  
  const handleInputClick = (e: React.MouseEvent) => {
    // 編集モードの際にイベントが親に伝播しないようにする
    e.stopPropagation();
  };
  
  // 選択されている場合のスタイルクラス
  const selectedClass = isSelected ? "node-selected" : "";

  return (
    <div 
      className={`node-container ${selectedClass}`} 
      onClick={handleNodeClick}
    >
      <div className="inputWrapper">
        <div className="dragHandle">
          <DragIcon />
        </div>
        <input
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
          ref={inputRef}
          onClick={handleInputClick}
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
      
      {/* 選択状態の時に表示するアクションメニュー */}
      {isSelected && (
        <div className="action-menu">
          <button 
            className="action-button add-button"
            onClick={handleAddChildNode}
            title="Add child node"
          >
            <AddIcon fontSize="small" />
          </button>
          
          {/* ルートノードは削除できないようにする */}
          {!isRootNode && (
            <button 
              className="action-button delete-button"
              onClick={handleDeleteNode}
              title="Delete node"
            >
              <DeleteIcon fontSize="small" />
            </button>
          )}
        </div>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </div>
  );
}

export default MindMapNode;