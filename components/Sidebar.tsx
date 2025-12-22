import React from 'react';
import { 
  GitBranch, 
  MessageSquare, 
  Settings, 
  BookOpen,
  GraduationCap,
  User
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
      id: 'mode' as SidebarTab,
      icon: currentMode === 'teacher' ? User : GraduationCap,
      label: '模式切换',
      tooltip: '教师/学生模式切换'
    },
    {
      id: 'chat' as SidebarTab,
      icon: MessageSquare,
      label: 'AI',
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
    <div className="w-16 liquid-glass-dark border-r border-white/10 flex flex-col items-center py-6 gap-4">
      {/* Logo/Brand */}
      <div className="mb-6 p-3 rounded-xl liquid-glass-primary glass-hover">
        <BookOpen size={24} className="text-primary" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col gap-3 flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative group w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-300 ease-out glass-hover m-2
                ${isActive 
                  ? 'liquid-glass-primary text-primary border border-primary/30 shadow-lg shadow-primary/20 liquid-active' 
                  : 'liquid-glass text-slate-400 hover:text-slate-200 border border-white/5'
                }
              `}
              title={tab.tooltip}
            >
              <Icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-2 liquid-glass-dark text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                {tab.tooltip}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode indicator at bottom */}
      <div className="mt-auto">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
          transition-all duration-300 glass-hover m-2
          ${currentMode === 'teacher' 
            ? 'liquid-glass text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20' 
            : 'liquid-glass text-green-400 border border-green-500/30 shadow-lg shadow-green-500/20'
          }
        `}>
          {currentMode === 'teacher' ? 'T' : 'S'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;