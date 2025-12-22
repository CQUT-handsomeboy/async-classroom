import React from 'react';
import { SidebarTab } from './Sidebar';

interface SidePanelProps {
  activeTab: SidebarTab;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ 
  isOpen, 
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SidePanel;