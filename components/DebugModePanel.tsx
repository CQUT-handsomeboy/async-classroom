import React from 'react';
import { 
  Bug, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Square,
  RotateCcw,
  StepForward,
  StepBack,
  Zap
} from 'lucide-react';

interface DebugModePanelProps {
  isPlaying?: boolean;
  onPlayPause?: (playing: boolean) => void;
  onStop?: () => void;
  onStepForward?: () => void;
  onStepBack?: () => void;
  onBreakpoint?: () => void;
  onStepIn?: () => void;
  onStepOut?: () => void;
  onStepOver?: () => void;
  onRestart?: () => void;
}

const DebugModePanel: React.FC<DebugModePanelProps> = ({
  isPlaying = false,
  onPlayPause,
  onStop,
  onStepForward,
  onStepBack,
  onBreakpoint,
  onStepIn,
  onStepOut,
  onStepOver,
  onRestart
}) => {
  const debugActions = [
    {
      id: 'play-pause',
      icon: isPlaying ? Pause : Play,
      label: isPlaying ? '暂停' : '播放',
      description: '播放/暂停学习内容',
      color: 'green',
      onClick: () => onPlayPause?.(!isPlaying)
    },
    {
      id: 'stop',
      icon: Square,
      label: '停止',
      description: '停止播放并重置',
      color: 'red',
      onClick: onStop
    },
    {
      id: 'restart',
      icon: RotateCcw,
      label: '重新开始',
      description: '从头开始学习',
      color: 'blue',
      onClick: onRestart
    },
    {
      id: 'step-back',
      icon: SkipBack,
      label: '上一步',
      description: '回到上一个学习点',
      color: 'slate',
      onClick: onStepBack
    },
    {
      id: 'step-forward',
      icon: SkipForward,
      label: '下一步',
      description: '跳到下一个学习点',
      color: 'slate',
      onClick: onStepForward
    },
    {
      id: 'breakpoint',
      icon: Zap,
      label: '我没听懂',
      description: '标记难点，触发详细解释',
      color: 'yellow',
      onClick: onBreakpoint
    },
    {
      id: 'step-in',
      icon: StepForward,
      label: '深入理解',
      description: '获取更详细的解释',
      color: 'purple',
      onClick: onStepIn
    },
    {
      id: 'step-out',
      icon: StepBack,
      label: '返回概览',
      description: '回到上级概念',
      color: 'indigo',
      onClick: onStepOut
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30',
      red: 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30',
      blue: 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30',
      yellow: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30',
      purple: 'bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30',
      indigo: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/30',
      slate: 'bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30'
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/50">
            <Bug size={20} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-200">调试模式</h2>
        </div>
        <p className="text-sm text-slate-400">
          使用调试工具控制学习进度，标记难点并获取详细解释
        </p>
      </div>

      {/* Debug Controls */}
      <div className="space-y-3 flex-1">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">调试控制</h3>
        
        {debugActions.map((action) => {
          const Icon = action.icon;
          const colorClasses = getColorClasses(action.color);
          
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200
                flex items-center gap-4 text-left
                ${colorClasses}
              `}
            >
              <div className="shrink-0">
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{action.label}</div>
                <div className="text-xs opacity-75">{action.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Debug Info */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <h4 className="text-sm font-medium text-slate-300 mb-3">调试信息</h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>当前状态:</span>
            <span className={isPlaying ? 'text-green-400' : 'text-slate-400'}>
              {isPlaying ? '播放中' : '已暂停'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>断点数量:</span>
            <span>0</span>
          </div>
          <div className="flex justify-between">
            <span>学习进度:</span>
            <span>0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugModePanel;