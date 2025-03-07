import React, { useState } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface HeaderProps {
  className?: string;
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ className, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch(''); // 空の検索クエリを送信して検索結果をクリア
    }
  };

  return (
    <header className={`fixed top-4 left-20 z-50 bg-white/90 backdrop-blur-sm shadow-md rounded-full px-4 py-2 flex items-center justify-between border-2 border-gray-300 ${className || ''}`}>
      <div className="flex items-center space-x-2">
        <AccountTreeIcon className="text-gray-800" />
        <h1 className="text-lg font-semibold text-gray-800">MindMap Todo</h1>
      </div>
      
      <form onSubmit={handleSearch} className="flex items-center ml-6 mr-[-7px]">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="ノードを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-100 rounded-full pl-12 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 w-56 transition-all duration-200 focus:w-72"
          />
          <SearchIcon className="absolute left-3 text-gray-400" sx={{ fontSize: 24 }} />
          {searchQuery && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <CloseIcon sx={{ fontSize: 24 }} />
            </button>
          )}
        </div>
      </form>
    </header>
  );
};

export default Header;
