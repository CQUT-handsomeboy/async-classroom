import React from 'react';
import { X } from 'lucide-react';
import { SidebarTab } from './Sidebar';

interface SidePanelProps {
  activeTab: SidebarTab;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ 
  activeTab, 
  isOpen, 
  onClose, 
  children, 
  title 
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 flex flex-col h-full">
      {/* Panel Header */}
      <div className="h-12 border-b border-slate-700/50 flex items-center justify-between px-4 bg-slate-800/50">
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SidePanel;