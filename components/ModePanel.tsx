import React from 'react';
import { 
  User, 
  GraduationCap, 
  ArrowRight, 
  Settings,
  Users,
  BookOpen,
  BarChart3,
  MessageSquare
} from 'lucide-react';

interface ModePanelProps {
  currentMode: 'teacher' | 'student';
  onModeChange: (mode: 'teacher' | 'student') => void;
}

const ModePanel: React.FC<ModePanelProps> = ({ currentMode, onModeChange }) => {
  const modes = [
    {
      id: 'teacher' as const,
      title: '编辑模式',
      subtitle: 'Teacher Studio',
      description: '创建和编辑课程内容，分析学生学习数据',
      icon: User,
      color: 'blue',
      features: [
        { icon: BookOpen, text: '课程内容编辑' },
        { icon: BarChart3, text: '学习数据分析' },
        { icon: Users, text: '学生管理' },
        { icon: Settings, text: '高级设置' }
      ]
    },
    {
      id: 'student' as const,
      title: '调试模式',
      subtitle: 'Student Classroom',
      description: '观看课程视频，与AI助手互动学习',
      icon: GraduationCap,
      color: 'green',
      features: [
        { icon: BookOpen, text: '课程学习' },
        { icon: MessageSquare, text: 'AI 学习助手' },
        { icon: BarChart3, text: '学习进度' },
        { icon: Settings, text: '个人设置' }
      ]
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: {
        bg: isActive ? 'bg-blue-500/20' : 'bg-blue-500/5 hover:bg-blue-500/10',
        border: isActive ? 'border-blue-500/50' : 'border-blue-500/20 hover:border-blue-500/30',
        text: 'text-blue-400',
        icon: 'text-blue-500'
      },
      green: {
        bg: isActive ? 'bg-green-500/20' : 'bg-green-500/5 hover:bg-green-500/10',
        border: isActive ? 'border-green-500/50' : 'border-green-500/20 hover:border-green-500/30',
        text: 'text-green-400',
        icon: 'text-green-500'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-200 mb-2">模式切换</h2>
        <p className="text-sm text-slate-400">
          选择您的使用模式，享受不同的功能体验
        </p>
      </div>

      {/* Mode Cards */}
      <div className="space-y-4 flex-1">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id;
          const colors = getColorClasses(mode.color, isActive);
          const Icon = mode.icon;

          return (
            <div
              key={mode.id}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer
                ${colors.bg} ${colors.border}
                ${isActive ? 'shadow-lg' : 'hover:shadow-md'}
              `}
              onClick={() => onModeChange(mode.id)}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-4 right-4">
                  <div className={`w-3 h-3 rounded-full ${colors.icon} animate-pulse`} />
                </div>
              )}

              {/* Mode Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`
                  p-3 rounded-lg ${colors.bg} border ${colors.border}
                `}>
                  <Icon size={24} className={colors.icon} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-200 mb-1">
                    {mode.title}
                  </h3>
                  <p className={`text-sm ${colors.text} font-medium mb-2`}>
                    {mode.subtitle}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {mode.description}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {mode.features.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <FeatureIcon size={14} className={colors.text} />
                      <span className="text-xs text-slate-300">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                className={`
                  w-full py-2.5 px-4 rounded-lg font-medium text-sm
                  flex items-center justify-center gap-2
                  transition-all duration-200
                  ${isActive 
                    ? `${colors.bg} ${colors.text} border ${colors.border}` 
                    : `bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700 hover:text-slate-200`
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onModeChange(mode.id);
                }}
              >
                {isActive ? (
                  <>
                    <span>当前模式</span>
                  </>
                ) : (
                  <>
                    <span>切换到此模式</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <h4 className="text-sm font-medium text-slate-300 mb-3">快速操作</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-slate-300 transition-colors">
            <Settings size={16} className="mx-auto mb-1" />
            <div>偏好设置</div>
          </button>
          <button className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-slate-300 transition-colors">
            <Users size={16} className="mx-auto mb-1" />
            <div>用户管理</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModePanel;