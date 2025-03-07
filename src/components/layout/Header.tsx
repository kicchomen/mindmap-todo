import React from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm shadow-md rounded-full px-4 py-2 flex items-center ${className || ''}`}>
      <div className="flex items-center space-x-2">
        <AccountTreeIcon className="text-gray-800" />
        <h1 className="text-lg font-semibold text-gray-800">MindMap Todo</h1>
      </div>
    </header>
  );
};

export default Header;
