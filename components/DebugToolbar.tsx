import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  Circle, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp,
  RotateCcw
} from 'lucide-react';

interface DebugToolbarProps {
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onStop: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onBreakpoint: () => void;
  onStepIn: () => void;
  onStepOut: () => void;
  onStepOver: () => void;
  onRestart: () => void;
}

const DebugToolbar: React.FC<DebugToolbarProps> = ({
  isPlaying,
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
  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
      <div className="flex items-center gap-1">
        {/* Play/Pause */}
        <button
          onClick={() => onPlayPause(!isPlaying)}
          className={`p-2.5 rounded-xl transition-all duration-300 group ${
            isPlaying 
              ? 'bg-orange-500/30 text-orange-200 border border-orange-400/30 shadow-lg shadow-orange-500/20' 
              : 'bg-green-500/30 text-green-200 border border-green-400/30 shadow-lg shadow-green-500/20 hover:bg-green-500/40'
          }`}
          title={isPlaying ? "暂停" : "播放"}
        >
          {isPlaying ? (
            <Pause size={16} className="group-hover:scale-110 transition-transform" />
          ) : (
            <Play size={16} className="group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Stop */}
        <button
          onClick={onStop}
          className="p-2.5 rounded-xl transition-all duration-300 hover:bg-red-500/30 text-slate-300 hover:text-red-200 hover:border-red-400/30 border border-transparent group"
          title="停止"
        >
          <Square size={16} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Step Back */}
        <button
          onClick={onStepBack}
          className="p-2.5 rounded-xl transition-all duration-300 hover:bg-blue-500/30 text-slate-300 hover:text-blue-200 hover:border-blue-400/30 border border-transparent group"
          title="上一步"
        >
          <SkipBack size={16} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          className="p-2.5 rounded-xl transition-all duration-300 hover:bg-blue-500/30 text-slate-300 hover:text-blue-200 hover:border-blue-400/30 border border-transparent group"
          title="下一步"
        >
          <SkipForward size={16} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Step Into */}
        <button
          onClick={onStepIn}
          className="p-2.5 rounded-xl transition-all duration-300 hover:bg-purple-500/30 text-slate-300 hover:text-purple-200 hover:border-purple-400/30 border border-transparent group"
          title="步入 (Step In)"
        >
          <ArrowDown size={16} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Step Over */}
        <button
          onClick={onStepOver}
          className="p-2.5 rounded-xl transition-all duration-300 hover:bg-purple-500/30 text-slate-300 hover:text-purple-200 hover:border-purple-400/30 border border-transparent group"
          title="步过 (Step Over)"
        >
          <ArrowRight size={16} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Step Out */}
        <button
          onClick={onStepOut}
          className="p-2.5 rounded-xl transition-all duration-300 hover:bg-purple-500/30 text-slate-300 hover:text-purple-200 hover:border-purple-400/30 border border-transparent group"
          title="步出 (Step Out)"
        >
          <ArrowUp size={16} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Breakpoint */}
        <button
          onClick={onBreakpoint}
          className="p-2.5 rounded-xl transition-all duration-300 hover:bg-red-500/30 text-slate-300 hover:text-red-200 hover:border-red-400/30 border border-transparent group"
          title="断点 (我没听懂)"
        >
          <Circle size={16} className="group-hover:scale-110 transition-transform fill-current" />
        </button>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="p-2.5 rounded-xl transition-all duration-300 hover:bg-yellow-500/30 text-slate-300 hover:text-yellow-200 hover:border-yellow-400/30 border border-transparent group"
          title="重新开始"
        >
          <RotateCcw size={16} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default DebugToolbar;