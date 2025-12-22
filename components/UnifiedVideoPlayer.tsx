import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';

interface UnifiedVideoPlayerProps {
  src: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  className?: string;
  showAdvancedControls?: boolean;
  onSeek?: (time: number) => void;
}

const UnifiedVideoPlayer: React.FC<UnifiedVideoPlayerProps> = ({ 
  src, 
  currentTime, 
  onTimeUpdate, 
  isPlaying, 
  onPlayPause,
  volume = 0.8,
  onVolumeChange,
  className = '',
  showAdvancedControls = true,
  onSeek
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync prop currentTime to video element
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Sync prop isPlaying to video element
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    onPlayPause(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    
    if (onSeek) {
      onSeek(newTime);
    } else {
      onTimeUpdate(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    if (onSeek) {
      onSeek(newTime);
    } else {
      onTimeUpdate(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden group video-player-container ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => onPlayPause(false)}
        src={src}
        onClick={togglePlay}
      />
      
      {/* Liquid Glass Video Controls */}
      <div 
        className={`absolute bottom-4 left-4 right-4 transition-all duration-300 z-50 ${
          showControls ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        style={{ 
          pointerEvents: showControls ? 'auto' : 'none'
        }}
      >
        <div className="glass-video-control rounded-2xl p-4" style={{ pointerEvents: 'auto' }}>
          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              className="glass-progress h-2 cursor-pointer relative"
              onClick={handleProgressClick}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div 
                className="glass-progress-fill h-full rounded-full transition-all duration-300 relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform translate-x-2"></div>
              </div>
            </div>
            
            {/* Time Display */}
            <div className="flex justify-between text-xs text-white/70 mt-2">
              <span className="font-mono time-display">{formatTime(currentTime)}</span>
              <span className="font-mono time-display">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-3">
              {/* Skip Back */}
              {showAdvancedControls && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skipTime(-10);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="glass-button glass-button-pulse w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <SkipBack size={16} />
                </button>
              )}

              {/* Play/Pause Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="glass-button glass-button-pulse w-12 h-12 rounded-full flex items-center justify-center text-white hover:text-blue-300 transition-colors glass-shimmer"
              >
                {isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} className="ml-1" />
                )}
              </button>

              {/* Skip Forward */}
              {showAdvancedControls && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skipTime(10);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="glass-button glass-button-pulse w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <SkipForward size={16} />
                </button>
              )}

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-white/70" />
                <div className="w-20 h-1 glass-volume-slider relative">
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
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {showAdvancedControls && (
                <button 
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="glass-button glass-button-pulse w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <Settings size={16} />
                </button>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className="glass-button glass-button-pulse w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="center-play-button w-20 h-20 rounded-full flex items-center justify-center text-white hover:text-blue-300 transition-all duration-300 pointer-events-auto"
          >
            <Play size={32} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UnifiedVideoPlayer;