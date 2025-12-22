import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import AIChat from '../components/AIChat';
import DebugToolbar from '../components/DebugToolbar';
import MathRenderer from '../components/MathRenderer';
import CrashPanel from '../components/CrashPanel';
import UnifiedVideoPlayer from '../components/UnifiedVideoPlayer';
import ResizableSplitter from '../components/ResizableSplitter';
import Sidebar, { SidebarTab } from '../components/Sidebar';
import SidePanel from '../components/SidePanel';
import GitLensPanel from '../components/GitLensPanel';
import { COURSES, MOCK_MARKDOWN, COMMITS, TRANSCRIPT, CRASH_DATA } from '../constants';
import { getPanelTitle } from '../utils';

const StudentClassroom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('git');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [currentMode, setCurrentMode] = useState<'edit' | 'debug'>('debug'); // 学生默认调试模式
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleModeChange = (mode: 'teacher' | 'student') => {
    if (mode === 'teacher') {
      navigate(`/teacher/${id}`);
    }
    // If already in student mode, no navigation needed
  };

  const handleTabChange = (tab: SidebarTab) => {
    // 如果点击编辑或调试选项卡，切换模式并设置 activeTab
    if (tab === 'edit' || tab === 'debug') {
      setCurrentMode(tab);
      setActiveTab(tab);
      // 如果面板已关闭，打开它
      if (!isPanelOpen) {
        setIsPanelOpen(true);
      }
      return;
    }
    
    // 其他选项卡的处理
    if (activeTab === tab && isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
  };

  const renderPanelContent = () => {
    switch (activeTab) {
      case 'git':
        return <GitLensPanel commits={COMMITS} />;
      case 'crash':
        return (
          <CrashPanel 
            data={CRASH_DATA} 
            currentTime={currentTime}
            onSeek={(time: number) => {
              setCurrentTime(time);
              setIsPlaying(false);
            }}
          />
        );
      case 'chat':
        return <AIChat contextCode={MOCK_MARKDOWN} />;
      case 'settings':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">设置</h3>
            <p className="text-slate-400">设置面板开发中...</p>
          </div>
        );
      case 'edit':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">编辑模式</h3>
            <p className="text-slate-400">学生编辑面板开发中...</p>
          </div>
        );
      case 'debug':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">调试模式</h3>
            <p className="text-slate-400">当前处于学习调试模式</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Debug toolbar handlers
  const handleStepForward = () => {
    const currentIndex = TRANSCRIPT.findIndex(
      line => currentTime >= line.startTime && currentTime < line.endTime
    );
    const nextIndex = Math.min(currentIndex + 1, TRANSCRIPT.length - 1);
    if (nextIndex >= 0 && TRANSCRIPT[nextIndex]) {
      setCurrentTime(TRANSCRIPT[nextIndex].startTime);
    }
  };

  const handleStepBack = () => {
    const currentIndex = TRANSCRIPT.findIndex(
      line => currentTime >= line.startTime && currentTime < line.endTime
    );
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (prevIndex >= 0 && TRANSCRIPT[prevIndex]) {
      setCurrentTime(TRANSCRIPT[prevIndex].startTime);
    }
  };

  const handleBreakpoint = () => {
    setIsPlaying(false);
    // 可以在这里添加"我没听懂"的逻辑
    console.log('学生表示没听懂，触发断点');
  };

  const handleStepIn = () => {
    // 步入：可以跳转到更详细的解释或相关资料
    console.log('步入详细解释');
  };

  const handleStepOut = () => {
    // 步出：回到上一个概念层级
    console.log('步出到上级概念');
  };

  const handleStepOver = () => {
    // 步过：跳过当前段落到下一个重要点
    handleStepForward();
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  // Auto-scroll transcript
  useEffect(() => {
    const activeIndex = TRANSCRIPT.findIndex(
      line => currentTime >= line.startTime && currentTime < line.endTime
    );
    
    if (activeIndex !== -1 && scrollContainerRef.current) {
      const element = scrollContainerRef.current.children[activeIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime]);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole="student"
      />

      {/* Side Panel - 只在git模式下显示 */}
      {isPanelOpen && activeTab === 'git' && (
        <SidePanel
          activeTab={activeTab}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          title={getPanelTitle(activeTab, 'student')}
        >
          {renderPanelContent()}
        </SidePanel>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-slate-700 bg-surface flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-primary"/>
              {COURSES.find(c => c.id === id)?.title}
            </h1>
          </div>
        </header>

        {/* Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          {(currentMode === 'edit' || currentMode === 'debug') ? (
            /* 编辑模式和调试模式：左侧视频，右侧功能区 */
            <ResizableSplitter
              defaultLeftWidth={60}
              minLeftWidth={40}
              maxLeftWidth={75}
              leftPanel={
                /* Left: Video */
                <div className="h-full bg-black flex flex-col justify-center relative">
                  <UnifiedVideoPlayer
                    src="https://media.w3.org/2010/05/sintel/trailer.mp4"
                    currentTime={currentTime}
                    onTimeUpdate={setCurrentTime}
                    isPlaying={isPlaying}
                    onPlayPause={setIsPlaying}
                    volume={volume}
                    onVolumeChange={setVolume}
                    className="w-full h-full"
                    showAdvancedControls={true}
                    onSeek={(time: number) => {
                      setCurrentTime(time);
                      setIsPlaying(false);
                    }}
                  />
                </div>
              }
              rightPanel={
                /* Right: 功能区 */
                <div className="h-full w-full flex flex-col bg-surface overflow-hidden border-l border-slate-700">
                  {currentMode === 'edit' ? (
                    /* 编辑模式功能区 */
                    <div className="h-full flex flex-col p-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-4">编辑模式</h3>
                      <p className="text-slate-400">学生编辑面板开发中...</p>
                    </div>
                  ) : (
                    /* 调试模式功能区 - Transcript & Debug Toolbar */
                    <>
                      <div className="flex-1 w-full overflow-y-auto p-4 relative" ref={scrollContainerRef}>
                        <div className="sticky top-0 bg-surface/95 backdrop-blur z-10 pb-3 mb-4 border-b border-slate-700/50">
                          {/* Debug Toolbar */}
                          <div className="flex justify-center">
                            <DebugToolbar
                              isPlaying={isPlaying}
                              onPlayPause={setIsPlaying}
                              onStop={handleStop}
                              onStepForward={handleStepForward}
                              onStepBack={handleStepBack}
                              onBreakpoint={handleBreakpoint}
                              onStepIn={handleStepIn}
                              onStepOut={handleStepOut}
                              onStepOver={handleStepOver}
                              onRestart={handleRestart}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4 w-full">
                          {TRANSCRIPT.map((line) => {
                            const isActive = currentTime >= line.startTime && currentTime < line.endTime;
                            return (
                              <div 
                               key={line.id} 
                               onClick={() => {
                                 setCurrentTime(line.startTime);
                                 setIsPlaying(true);
                               }}
                               className={`p-3 rounded-lg cursor-pointer transition-all duration-300 w-full ${
                                 isActive 
                                   ? 'bg-primary/20 border border-primary/50 text-white shadow-lg shadow-primary/10 scale-105' 
                                   : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 border border-transparent'
                               }`}
                              >
                                <div className="flex justify-between text-[10px] mb-1 opacity-50 font-mono">
                                   <span>{Math.floor(line.startTime / 60)}:{Math.floor(line.startTime % 60).toString().padStart(2, '0')}</span>
                                </div>
                                <MathRenderer 
                                  text={line.text} 
                                  className="text-sm leading-relaxed" 
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              }
            />
          ) : (
            /* 其他模式保持原有布局 */
            <ResizableSplitter
              defaultLeftWidth={50}
              minLeftWidth={30}
              maxLeftWidth={70}
              leftPanel={
                /* Left: Video */
                <div className="h-full bg-black flex flex-col justify-center relative">
                  <UnifiedVideoPlayer
                    src="https://media.w3.org/2010/05/sintel/trailer.mp4"
                    currentTime={currentTime}
                    onTimeUpdate={setCurrentTime}
                    isPlaying={isPlaying}
                    onPlayPause={setIsPlaying}
                    volume={volume}
                    onVolumeChange={setVolume}
                    className="w-full h-full"
                    showAdvancedControls={true}
                    onSeek={(time: number) => {
                      setCurrentTime(time);
                      setIsPlaying(false);
                    }}
                  />
                </div>
              }
              rightPanel={
                /* Right: Transcript & Debug Toolbar */
                <div className="h-full w-full flex flex-col bg-surface overflow-hidden border-l border-slate-700">
                  
                  {/* Transcript List */}
                  <div className="flex-1 w-full overflow-y-auto p-4 relative" ref={scrollContainerRef}>
                     <div className="sticky top-0 bg-surface/95 backdrop-blur z-10 pb-3 mb-4 border-b border-slate-700/50">
                       {/* Debug Toolbar */}
                       <div className="flex justify-center">
                         <DebugToolbar
                           isPlaying={isPlaying}
                           onPlayPause={setIsPlaying}
                           onStop={handleStop}
                           onStepForward={handleStepForward}
                           onStepBack={handleStepBack}
                           onBreakpoint={handleBreakpoint}
                           onStepIn={handleStepIn}
                           onStepOut={handleStepOut}
                           onStepOver={handleStepOver}
                           onRestart={handleRestart}
                         />
                       </div>
                     </div>
                     
                     <div className="space-y-4 w-full">
                       {TRANSCRIPT.map((line) => {
                         const isActive = currentTime >= line.startTime && currentTime < line.endTime;
                         return (
                           <div 
                            key={line.id} 
                            onClick={() => {
                              setCurrentTime(line.startTime);
                              setIsPlaying(true);
                            }}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-300 w-full ${
                              isActive 
                                ? 'bg-primary/20 border border-primary/50 text-white shadow-lg shadow-primary/10 scale-105' 
                                : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 border border-transparent'
                            }`}
                           >
                             <div className="flex justify-between text-[10px] mb-1 opacity-50 font-mono">
                                <span>{Math.floor(line.startTime / 60)}:{Math.floor(line.startTime % 60).toString().padStart(2, '0')}</span>
                             </div>
                             <MathRenderer 
                               text={line.text} 
                               className="text-sm leading-relaxed" 
                             />
                           </div>
                         );
                       })}
                     </div>
                  </div>

                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentClassroom;