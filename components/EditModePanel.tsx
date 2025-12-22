import React from 'react';
import { 
  Edit3, 
  Save, 
  FileText, 
  Video,
  Settings,
  Compile,
  Play,
  Eye,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react';

interface EditModePanelProps {
  onSave?: () => void;
  onCompile?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  isCompiling?: boolean;
  compileStatus?: 'idle' | 'compiling' | 'success' | 'error';
  errorCount?: number;
  warningCount?: number;
}

const EditModePanel: React.FC<EditModePanelProps> = ({
  onSave,
  onCompile,
  onPreview,
  onExport,
  onImport,
  isCompiling = false,
  compileStatus = 'idle',
  errorCount = 0,
  warningCount = 0
}) => {
  const editActions = [
    {
      id: 'save',
      icon: Save,
      label: '保存',
      description: '保存当前编辑内容',
      color: 'blue',
      onClick: onSave
    },
    {
      id: 'compile',
      icon: isCompiling ? RefreshCw : Compile,
      label: isCompiling ? '编译中...' : '编译',
      description: '编译markdown为视频内容',
      color: compileStatus === 'error' ? 'red' : compileStatus === 'success' ? 'green' : 'purple',
      onClick: onCompile,
      disabled: isCompiling
    },
    {
      id: 'preview',
      icon: Eye,
      label: '预览',
      description: '预览生成的视频内容',
      color: 'green',
      onClick: onPreview
    },
    {
      id: 'export',
      icon: Download,
      label: '导出',
      description: '导出课程内容',
      color: 'indigo',
      onClick: onExport
    },
    {
      id: 'import',
      icon: Upload,
      label: '导入',
      description: '导入课程内容',
      color: 'yellow',
      onClick: onImport
    }
  ];

  const quickActions = [
    {
      id: 'new-lesson',
      icon: FileText,
      label: '新建课程',
      description: '创建新的课程内容'
    },
    {
      id: 'video-settings',
      icon: Video,
      label: '视频设置',
      description: '配置视频生成参数'
    },
    {
      id: 'editor-settings',
      icon: Settings,
      label: '编辑器设置',
      description: '配置编辑器选项'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30',
      green: 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30',
      red: 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30',
      purple: 'bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30',
      indigo: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/30',
      yellow: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30',
      slate: 'bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30'
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/50">
            <Edit3 size={20} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-200">编辑模式</h2>
        </div>
        <p className="text-sm text-slate-400">
          创建和编辑课程内容，编译生成交互式学习视频
        </p>
      </div>

      {/* Compile Status */}
      {compileStatus !== 'idle' && (
        <div className="mb-4 p-3 rounded-lg border bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${
              compileStatus === 'compiling' ? 'bg-yellow-400 animate-pulse' :
              compileStatus === 'success' ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <span className="text-sm font-medium text-slate-200">
              {compileStatus === 'compiling' ? '编译中...' :
               compileStatus === 'success' ? '编译成功' : '编译失败'}
            </span>
          </div>
          {(errorCount > 0 || warningCount > 0) && (
            <div className="text-xs text-slate-400">
              {errorCount > 0 && <span className="text-red-400">{errorCount} 错误</span>}
              {errorCount > 0 && warningCount > 0 && <span className="mx-2">•</span>}
              {warningCount > 0 && <span className="text-yellow-400">{warningCount} 警告</span>}
            </div>
          )}
        </div>
      )}

      {/* Edit Actions */}
      <div className="space-y-3 flex-1">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">编辑操作</h3>
        
        {editActions.map((action) => {
          const Icon = action.icon;
          const colorClasses = getColorClasses(action.color);
          
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200
                flex items-center gap-4 text-left
                ${colorClasses}
                ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="shrink-0">
                <Icon size={20} className={isCompiling && action.id === 'compile' ? 'animate-spin' : ''} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">{action.label}</div>
                <div className="text-xs opacity-75">{action.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <h4 className="text-sm font-medium text-slate-300 mb-3">快速操作</h4>
        <div className="grid grid-cols-1 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-xs text-slate-300 transition-colors flex items-center gap-3"
              >
                <Icon size={14} />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="opacity-75">{action.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditModePanel;