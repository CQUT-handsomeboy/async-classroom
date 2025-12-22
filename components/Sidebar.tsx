import React from 'react';
import { 
  GitBranch, 
  Users, 
  MessageSquare, 
  Settings, 
  BookOpen,
  GraduationCap,
  User,
  AlertTriangle
} from 'lucide-react';

export type SidebarTab = 'git' | 'mode' | 'chat' | 'settings' | 'crash';

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  currentMode?: 'teacher' | 'student';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, currentMode }) => {
  const tabs = [
    {
      id: 'git' as SidebarTab,
      icon: GitBranch,
      label: '版本控制',
      tooltip: 'Git 历史和分支管理'
    },
    {
      id: 'crash' as SidebarTab,
      icon: AlertTriangle,
      label: '思维断点',
      tooltip: '学生思维断点分布分析'
    },
    {
      id: 'mode' as SidebarTab,
      icon: currentMode === 'teacher' ? User : GraduationCap,
      label: '模式切换',
      tooltip: '教师/学生模式切换'
    },
    {
      id: 'chat' as SidebarTab,
      icon: MessageSquare,
      label: 'AI 助手',
      tooltip: 'AI 聊天助手'
    },
    {
      id: 'settings' as SidebarTab,
      icon: Settings,
      label: '设置',
      tooltip: '应用设置'
    }
  ];

  return (
    <div className="w-12 bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 flex flex-col items-center py-4 gap-2">
      {/* Logo/Brand */}
      <div className="mb-4 p-2 rounded-lg bg-primary/10 border border-primary/20">
        <BookOpen size={20} className="text-primary" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col gap-1 flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative group w-10 h-10 rounded-lg flex items-center justify-center
                transition-all duration-200 ease-out
                ${isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }
              `}
              title={tab.tooltip}
            >
              <Icon size={18} />
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {tab.tooltip}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode indicator at bottom */}
      <div className="mt-auto">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
          ${currentMode === 'teacher' 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }
        `}>
          {currentMode === 'teacher' ? 'T' : 'S'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;