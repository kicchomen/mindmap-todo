import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FolderIcon from '@mui/icons-material/Folder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StorageIcon from '@mui/icons-material/Storage';
import Tooltip from '@mui/material/Tooltip';

interface NavigationBarProps {
  className?: string;
  activeItem: string;
  onItemClick: (item: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  className, 
  activeItem = 'tree',
  onItemClick
}) => {
  // ナビゲーションアイテムをクリックした時の処理
  const handleItemClick = (item: string) => {
    onItemClick(item);
  };

  return (
    <div className={`fixed left-0 top-0 h-full z-50 bg-white/95 backdrop-blur-sm shadow-md border-r-2 border-gray-300 flex flex-col items-center py-6 w-16 ${className || ''}`}>
      <div className="mb-10">
        <AccountTreeIcon className="text-orange-500" sx={{ fontSize: 32 }} />
      </div>
      
      <div className="flex flex-col items-center space-y-6 mt-10">
        <Tooltip title="アカウント" placement="right" arrow>
          <button 
            className={`p-2 rounded-full transition-all duration-200 ${activeItem === 'account' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => handleItemClick('account')}
          >
            <AccountCircleIcon sx={{ fontSize: 28 }} />
          </button>
        </Tooltip>
        
        <Tooltip title="プロジェクト一覧" placement="right" arrow>
          <button 
            className={`p-2 rounded-full transition-all duration-200 ${activeItem === 'projects' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => handleItemClick('projects')}
          >
            <FolderIcon sx={{ fontSize: 28 }} />
          </button>
        </Tooltip>
        
        <Tooltip title="ツリービュー" placement="right" arrow>
          <button 
            className={`p-2 rounded-full transition-all duration-200 ${activeItem === 'tree' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => handleItemClick('tree')}
          >
            <AccountTreeIcon sx={{ fontSize: 28 }} />
          </button>
        </Tooltip>
        
        <Tooltip title="ストレージ管理" placement="right" arrow>
          <button 
            className={`p-2 rounded-full transition-all duration-200 ${activeItem === 'storage' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => handleItemClick('storage')}
          >
            <StorageIcon sx={{ fontSize: 28 }} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavigationBar;