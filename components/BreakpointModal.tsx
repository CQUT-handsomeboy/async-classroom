import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface BreakpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
  currentTime: number;
  subtitleText?: string;
}

const BreakpointModal: React.FC<BreakpointModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentTime,
  subtitleText
}) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 重置状态当模态框打开时
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(description.trim());
      onClose();
    } catch (error) {
      console.error('提交断点失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 模态框 */}
      <div 
        className="relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
        onKeyDown={handleKeyDown}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-400" size={20} />
            <h3 className="text-lg font-semibold text-white">添加学习断点</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 时间和字幕信息 */}
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-sm text-slate-300 mb-1">
            时间点: <span className="font-mono text-blue-300">{formatTime(currentTime)}</span>
          </div>
          {subtitleText && (
            <div className="text-sm text-slate-400">
              当前字幕: "{subtitleText}"
            </div>
          )}
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              请描述您遇到的困难或疑问：
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：这个概念不太理解，能否详细解释一下..."
              className="w-full h-24 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
              autoFocus
              required
            />
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!description.trim() || isSubmitting}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  提交中...
                </>
              ) : (
                '添加断点'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BreakpointModal;