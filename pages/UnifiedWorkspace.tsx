import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PlayCircle, BookOpen } from 'lucide-react';
import Editor from '@monaco-editor/react';
import AIChat from '../components/AIChat';
import DebugToolbar from '../components/DebugToolbar';
import MathRenderer from '../components/MathRenderer';
import CrashPanel from '../components/CrashPanel';
import UnifiedVideoPlayer from '../components/UnifiedVideoPlayer';
import ResizableSplitter from '../components/ResizableSplitter';
import Sidebar, { SidebarTab } from '../components/Sidebar';
import SidePanel from '../components/SidePanel';
import GitLensPanel from '../components/GitLensPanel';
import FloatingGitDock from '../components/FloatingGitDock';
import CompileToolbar from '../components/CompileToolbar';
import { COURSES, MOCK_MARKDOWN, COMMITS, TRANSCRIPT, CRASH_DATA } from '../constants';
import { getPanelTitle } from '../utils';

const UnifiedWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<SidebarTab>('git');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isGitDockVisible, setIsGitDockVisible] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentMode, setCurrentMode] = useState<'edit' | 'debug'>('edit');
  
  // Compile toolbar state
  const [compileStatus, setCompileStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle');
  const [isCompiling, setIsCompiling] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: SidebarTab) => {
    // 如果点击git选项卡，显示浮动dock而不是侧边栏
    if (tab === 'git') {
      setIsGitDockVisible(true);
      setActiveTab(tab);
      setIsPanelOpen(false); // 关闭侧边栏
      return;
    }
    
    // 如果点击编辑或调试选项卡，切换模式并设置 activeTab
    if (tab === 'edit') {
      setCurrentMode('edit');
      setActiveTab(tab);
      setIsPanelOpen(true);
      setIsGitDockVisible(false);
      return;
    }
    
    if (tab === 'debug') {
      setCurrentMode('debug');
      setActiveTab(tab);
      setIsPanelOpen(true);
      setIsGitDockVisible(false);
      return;
    }

    // 其他选项卡的正常处理
    if (activeTab === tab && isPanelOpen) {
      setIsPanelOpen(false);
    } else {
      setActiveTab(tab);
      setIsPanelOpen(true);
    }
    setIsGitDockVisible(false);
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
        return currentMode === 'debug' 
          ? <AIChat contextCode={MOCK_MARKDOWN} />
          : (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">AI 助手</h3>
              <p className="text-slate-400">编辑模式 AI 助手开发中...</p>
            </div>
          );
      case 'edit':
        return (
          <></>
        );
      case 'debug':
        return (
          <></>
        );
      default:
        return null;
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompileStatus('compiling');
    
    // 模拟编译过程
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const hasErrors = Math.random() > 0.7;
      const hasWarnings = Math.random() > 0.5;
      
      if (hasErrors) {
        setCompileStatus('error');
        setErrorCount(Math.floor(Math.random() * 5) + 1);
        setWarningCount(hasWarnings ? Math.floor(Math.random() * 3) + 1 : 0);
      } else {
        setCompileStatus('success');
        setErrorCount(0);
        setWarningCount(hasWarnings ? Math.floor(Math.random() * 3) + 1 : 0);
      }
    } catch (error) {
      setCompileStatus('error');
      setErrorCount(1);
      setWarningCount(0);
    } finally {
      setIsCompiling(false);
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
    console.log('学生表示没听懂，触发断点');
  };

  const handleStepIn = () => {
    console.log('步入详细解释');
  };

  const handleStepOut = () => {
    console.log('步出到上级概念');
  };

  const handleStepOver = () => {
    handleStepForward();
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  // Editor highlighting effect
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || currentMode !== 'edit') return;

    const totalLines = MOCK_MARKDOWN.split('\n').length;
    const line = Math.min(Math.floor(currentTime / 6) + 1, totalLines);
    
    const newDecorations = editorRef.current.deltaDecorations(decorations, [
      {
        range: new monacoRef.current.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'current-line-highlight',
        }
      }
    ]);
    setDecorations(newDecorations);

    if (isPlaying) {
      editorRef.current.revealLineInCenter(line);
    }
  }, [currentTime, isPlaying, currentMode]);

  // Auto-scroll transcript in debug mode
  useEffect(() => {
    if (currentMode !== 'debug') return;
    
    const activeIndex = TRANSCRIPT.findIndex(
      line => currentTime >= line.startTime && currentTime < line.endTime
    );
    
    if (activeIndex !== -1 && scrollContainerRef.current) {
      const element = scrollContainerRef.current.children[activeIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, currentMode]);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* 浮动Git Dock */}
      <FloatingGitDock
        commits={COMMITS}
        isVisible={isGitDockVisible}
        onClose={() => setIsGitDockVisible(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-slate-700 bg-surface flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-primary"/>
              {COURSES.find(c => c.id === id)?.title}
            </h1>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">当前模式:</span>
              <span className={`px-2 py-1 rounded-md font-medium ${
                currentMode === 'edit' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {currentMode === 'edit' ? '编辑模式' : '调试模式'}
              </span>
            </div>
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
                    <div className="h-full flex flex-col">
                      <CompileToolbar
                        onCompile={handleCompile}
                        isCompiling={isCompiling}
                        compileStatus={compileStatus}
                        errorCount={errorCount}
                        warningCount={warningCount}
                      />
                      
                      <div className="flex-1">
                        <Editor
                          height="100%"
                          defaultLanguage="markdown"
                          theme="vs-dark"
                          value={MOCK_MARKDOWN}
                          onMount={handleEditorDidMount}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            fontFamily: "'Fira Code', monospace",
                            wordWrap: 'on',
                            renderLineHighlight: 'none'
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    /* 调试模式功能区 */
                    <div className="flex-1 w-full overflow-y-auto p-4 relative" ref={scrollContainerRef}>
                      <div className="sticky top-0 bg-surface/95 backdrop-blur z-10 pb-3 mb-4 border-b border-slate-700/50">
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
                  )}
                </div>
              }
            />
          ) : (
            /* 其他模式保持原有布局 */
            currentMode === 'edit' ? (
              /* Edit Mode Layout */
              <ResizableSplitter
                defaultLeftWidth={35}
                minLeftWidth={25}
                maxLeftWidth={60}
                leftPanel={
                  <div className="h-full border-r border-slate-700 flex flex-col">
                    <CompileToolbar
                      onCompile={handleCompile}
                      isCompiling={isCompiling}
                      compileStatus={compileStatus}
                      errorCount={errorCount}
                      warningCount={warningCount}
                    />
                    
                    <div className="flex-1">
                      <Editor
                        height="100%"
                        defaultLanguage="markdown"
                        theme="vs-dark"
                        value={MOCK_MARKDOWN}
                        onMount={handleEditorDidMount}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: 'on',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          fontFamily: "'Fira Code', monospace",
                          wordWrap: 'on',
                          renderLineHighlight: 'none'
                        }}
                      />
                    </div>
                  </div>
                }
                rightPanel={
                  <div className="h-full bg-black relative flex flex-col">
                    <div className="flex-1 relative">
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
                      />
                      
                      <div className="absolute top-4 right-4 liquid-glass-dark text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2">
                        <PlayCircle size={14} className="text-green-400"/>
                        实时预览
                      </div>
                    </div>
                  </div>
                }
              />
            ) : (
              /* Debug Mode Layout */
              <ResizableSplitter
                defaultLeftWidth={50}
                minLeftWidth={30}
                maxLeftWidth={70}
                leftPanel={
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
                  <div className="h-full w-full flex flex-col bg-surface overflow-hidden border-l border-slate-700">
                    <div className="flex-1 w-full overflow-y-auto p-4 relative" ref={scrollContainerRef}>
                      <div className="sticky top-0 bg-surface/95 backdrop-blur z-10 pb-3 mb-4 border-b border-slate-700/50">
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedWorkspace;