import React from 'react';
import { 
  Play, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Settings
} from 'lucide-react';

interface CompileResult {
  task_id: string;
  video_url?: string;
  srt_url?: string;
  message?: string;
}

interface CompileToolbarProps {
  onCompile: () => void;
  isCompiling?: boolean;
  compileStatus?: 'idle' | 'compiling' | 'success' | 'error';
  compileResult?: CompileResult | null;
  errorCount?: number;
  warningCount?: number;
  progressMessage?: string;
}

const CompileToolbar: React.FC<CompileToolbarProps> = ({
  onCompile,
  isCompiling = false,
  compileStatus = 'idle',
  compileResult = null,
  errorCount = 0,
  warningCount = 0,
  progressMessage = ''
}) => {
  const getStatusIcon = () => {
    switch (compileStatus) {
      case 'compiling':
        return <Loader2 size={16} className="animate-spin" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <Play size={16} />;
    }
  };

  const getStatusText = () => {
    switch (compileStatus) {
      case 'compiling':
        return progressMessage || '编译中...';
      case 'success':
        return '编译成功';
      case 'error':
        return '编译失败';
      default:
        return '编译';
    }
  };

  const getStatusColor = () => {
    switch (compileStatus) {
      case 'compiling':
        return 'bg-blue-500/30 text-blue-200 border-blue-400/30';
      case 'success':
        return 'bg-green-500/30 text-green-200 border-green-400/30';
      case 'error':
        return 'bg-red-500/30 text-red-200 border-red-400/30';
      default:
        return 'bg-slate-500/30 text-slate-200 border-slate-400/30 hover:bg-slate-500/40';
    }
  };

  return (
    <div className="liquid-glass-dark border-b border-slate-700/50 p-3">
      <div className="flex items-center justify-between">
        {/* Left side - Compile button and status */}
        <div className="flex items-center gap-3">
          {/* Compile Button */}
          <button
            onClick={onCompile}
            disabled={isCompiling}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl 
              transition-all duration-300 border
              ${getStatusColor()}
              ${isCompiling ? 'cursor-not-allowed opacity-70' : 'hover:scale-105'}
              glass-button-pulse
            `}
            title={getStatusText()}
          >
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </button>

          {/* Status indicators */}
          {(errorCount > 0 || warningCount > 0) && (
            <div className="flex items-center gap-2">
              {errorCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 border border-red-400/30">
                  <AlertCircle size={12} className="text-red-400" />
                  <span className="text-xs text-red-200">{errorCount}</span>
                </div>
              )}
              {warningCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-400/30">
                  <AlertCircle size={12} className="text-yellow-400" />
                  <span className="text-xs text-yellow-200">{warningCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side - Additional controls */}
        <div className="flex items-center gap-2">
          {/* Task ID display - only show when compiling or completed */}
          {(compileStatus === 'compiling' || compileStatus === 'success') && compileResult?.task_id && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-500/20 border border-slate-400/30">
              <span className="text-xs text-slate-300">任务ID:</span>
              <code className="text-xs text-slate-200 font-mono">{compileResult.task_id.slice(0, 8)}...</code>
            </div>
          )}

          {/* Output/Logs button */}
          <button
            className="p-2 rounded-xl transition-all duration-300 hover:bg-slate-500/30 text-slate-300 hover:text-slate-200 border border-transparent hover:border-slate-400/30 glass-button"
            title="查看输出"
          >
            <FileText size={16} />
          </button>

          {/* Settings button */}
          <button
            className="p-2 rounded-xl transition-all duration-300 hover:bg-slate-500/30 text-slate-300 hover:text-slate-200 border border-transparent hover:border-slate-400/30 glass-button"
            title="编译设置"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompileToolbar;