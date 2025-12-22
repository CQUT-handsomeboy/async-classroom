import React from 'react';
import { Play, Pause, Volume2, Maximize, Settings } from 'lucide-react';

interface LiquidGlassVideoControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

const LiquidGlassVideoControls: React.FC<LiquidGlassVideoControlsProps> = ({
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  className = ''
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`glass-video-control rounded-2xl p-4 ${className}`} style={{ pointerEvents: 'auto' }}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div 
          className="glass-progress h-2 cursor-pointer relative"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            onSeek(percentage * duration);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div 
            className="glass-progress-fill h-full rounded-full transition-all duration-300 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform translate-x-2"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayPause();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="glass-button w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-blue-300 transition-colors glass-shimmer"
          >
            {isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-1" />
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-white/70" />
            <div className="w-20 h-1 glass-progress relative">
              <div 
                className="h-full bg-white/70 rounded-full"
                style={{ width: `${volume * 100}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onVolumeChange(parseFloat(e.target.value))}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="glass-button w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <Settings size={16} />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="glass-button w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiquidGlassVideoControls;