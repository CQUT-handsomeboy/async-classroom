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
import GitLensPanel from '../components/GitLensPanel';
import FloatingGitDock from '../components/FloatingGitDock';
import FloatingAIDock from '../components/FloatingAIDock';
import FloatingAIButton from '../components/FloatingAIButton';
import CompileToolbar from '../components/CompileToolbar';
import BreakpointModal from '../components/BreakpointModal';
import { COURSES, MOCK_MARKDOWN, COMMITS, TRANSCRIPT, CRASH_DATA } from '../constants';
import { CompileService, CompileTask } from '../services/compileService';
import { apiService } from '../services/api';
import { TranscriptLine, Breakpoint, BreakpointMarker } from '../types';
import { secondsToSrtTime, srtTimeToSeconds } from '../utils';


const UnifiedWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<SidebarTab>('git');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isGitDockVisible, setIsGitDockVisible] = useState(false);
  const [isAIDockVisible, setIsAIDockVisible] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentMode, setCurrentMode] = useState<'edit' | 'debug'>('edit');
  
  // Compile toolbar state
  const [compileStatus, setCompileStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle');
  const [isCompiling, setIsCompiling] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [compileResult, setCompileResult] = useState<{
    task_id: string;
    video_url?: string;
    srt_url?: string;
    message?: string;
  } | null>(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState("https://media.w3.org/2010/05/sintel/trailer.mp4");
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  
  // 字幕数据状态
  const [transcriptData, setTranscriptData] = useState<TranscriptLine[]>(TRANSCRIPT);
  const [isLoadingSubtitles, setIsLoadingSubtitles] = useState(false);
  const [subtitlesError, setSubtitlesError] = useState<string | null>(null);
  
  // 断点相关状态
  const [breakpoints, setBreakpoints] = useState<BreakpointMarker[]>([]);
  const [isBreakpointModalOpen, setIsBreakpointModalOpen] = useState(false);
  const [pendingBreakpointTime, setPendingBreakpointTime] = useState<number>(0);
  const [pendingBreakpointText, setPendingBreakpointText] = useState<string>('');
  const [aiBreakpointsContext, setAiBreakpointsContext] = useState<Breakpoint[]>([]);
  
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 加载workspace数据
  useEffect(() => {
    const loadWorkspaceData = async () => {
      if (!id) {
        setWorkspaceError('未提供workspace ID');
        setIsLoadingWorkspace(false);
        return;
      }

      try {
        setIsLoadingWorkspace(true);
        setWorkspaceError(null);
        
        // 从API获取workspace任务数据
        const taskData = await CompileService.getTaskByWorkspaceId(id);
        
        // 将code字段填充到编辑器中
        if (taskData.code) {
          setEditorContent(taskData.code);
        } else {
          // 如果没有code字段，使用默认内容
          setEditorContent(MOCK_MARKDOWN);
        }
        
        // 如果有视频URL，更新视频播放器
        if (taskData.video_url) {
          console.log("✅ 有视频URL:", taskData.video_url);
          setCurrentVideoUrl(taskData.video_url);
        } else {
          console.error("❌ 无视频URL，taskData:", taskData);
        }
        
        // 如果有字幕URL，加载字幕数据
        if (taskData.srt_url) {
          console.log("✅ 有字幕URL:", taskData.srt_url);
          await loadSubtitles(taskData.srt_url);
        } else {
          console.log("⚠️ 无字幕URL，使用默认TRANSCRIPT数据");
          setTranscriptData(TRANSCRIPT);
        }
        
        // 加载断点数据
        await loadBreakpoints(id);
        
        console.log('Workspace数据加载成功:', taskData);
      } catch (error) {
        console.error('加载workspace数据失败:', error);
        setWorkspaceError(error instanceof Error ? error.message : '加载workspace数据失败');
        // 出错时使用默认内容
        setEditorContent(MOCK_MARKDOWN);
        setTranscriptData(TRANSCRIPT);
      } finally {
        setIsLoadingWorkspace(false);
      }
    };

    loadWorkspaceData();
  }, [id]);

  // 加载字幕数据
  const loadSubtitles = async (srtUrl: string) => {
    try {
      setIsLoadingSubtitles(true);
      setSubtitlesError(null);
      
      const subtitles = await CompileService.getSubtitles(srtUrl);
      setTranscriptData(subtitles);
      
      console.log('✅ 字幕数据加载成功:', subtitles);
    } catch (error) {
      console.error('❌ 加载字幕数据失败:', error);
      setSubtitlesError(error instanceof Error ? error.message : '加载字幕数据失败');
      // 出错时使用默认TRANSCRIPT数据
      setTranscriptData(TRANSCRIPT);
    } finally {
      setIsLoadingSubtitles(false);
    }
  };

  // 加载断点数据
  const loadBreakpoints = async (workspaceId: string) => {
    try {
      console.log('📍 开始加载断点数据:', workspaceId);
      
      const breakpointsData = await apiService.getBreakpoints(workspaceId);
      
      // 设置AI助手的断点上下文
      setAiBreakpointsContext(breakpointsData);
      
      // 将API返回的断点数据转换为UI需要的格式
      const breakpointMarkers: BreakpointMarker[] = breakpointsData.map((bp, index) => {
        // 将时间格式 HH:MM:SS,mmm 转换为秒数
        const timeInSeconds = srtTimeToSeconds(bp.start_time);
        
        return {
          id: `breakpoint-${index}-${Date.now()}`,
          time: timeInSeconds,
          description: bp.description || bp.text || '学习断点'
        };
      });
      
      setBreakpoints(breakpointMarkers);
      console.log('✅ 断点数据加载成功:', breakpointMarkers);
    } catch (error) {
      console.error('❌ 加载断点数据失败:', error);
      // 出错时不影响其他功能，只是没有断点标记
      setBreakpoints([]);
      setAiBreakpointsContext([]);
    }
  };



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
          ? <AIChat contextCode={MOCK_MARKDOWN} breakpoints={aiBreakpointsContext} />
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
    if (!editorContent.trim()) {
      setCompileStatus('error');
      setErrorCount(1);
      setProgressMessage('编辑器内容为空');
      return;
    }

    setIsCompiling(true);
    setCompileStatus('compiling');
    setErrorCount(0);
    setWarningCount(0);
    setProgressMessage('正在提交编译任务...');
    setCompileResult(null);

    try {
      // 提交编译任务
      const response = await CompileService.submitCompileTask(editorContent);
      
      setCompileResult({
        task_id: response.task_id,
        message: response.message
      });
      
      setProgressMessage('编译任务已提交，正在处理...');

      // 开始轮询任务状态
      const finalTask = await CompileService.pollTaskStatus(
        response.task_id,
        (task: CompileTask) => {
          // 更新进度消息
          switch (task.status) {
            case 'pending':
              setProgressMessage('任务排队中...');
              break;
            case 'processing':
              setProgressMessage('正在编·译视频...');
              break;
            case 'completed':
              setProgressMessage('编译完成！');
              break;
            case 'failed':
              setProgressMessage('编译失败');
              break;
          }
        }
      );

      // 处理最终结果
      if (finalTask.status === 'completed') {
        setCompileStatus('success');
        setCompileResult({
          task_id: finalTask.task_id,
          video_url: finalTask.video_url || undefined,
          srt_url: finalTask.srt_url || undefined,
          message: finalTask.message
        });
        setProgressMessage('编译成功！');
        
        // 将编译生成的视频URL设置到播放器中
        if (finalTask.video_url) {
          console.log('✅ 视频已更新:', finalTask.video_url);
          setCurrentVideoUrl(finalTask.video_url);
          setCurrentTime(0); // 重置播放时间到开始
          setIsPlaying(false); // 暂停播放
          
          // 如果有字幕URL，也更新字幕数据
          if (finalTask.srt_url) {
            console.log('✅ 字幕已更新:', finalTask.srt_url);
            await loadSubtitles(finalTask.srt_url);
          }
        } else {
          console.error("❌ 编译完成但没有视频URL，finalTask:", finalTask);
        }
      } else {
        setCompileStatus('error');
        setErrorCount(1);
        setProgressMessage(finalTask.message || '编译失败');
      }

    } catch (error) {
      console.error('编译失败:', error);
      setCompileStatus('error');
      setErrorCount(1);
      setProgressMessage(error instanceof Error ? error.message : '编译过程中发生未知错误');
    } finally {
      setIsCompiling(false);
    }
  };

  // Debug toolbar handlers
  const handleStepForward = () => {
    const currentIndex = transcriptData.findIndex(
      line => currentTime >= line.startTime && currentTime < line.endTime
    );
    const nextIndex = Math.min(currentIndex + 1, transcriptData.length - 1);
    if (nextIndex >= 0 && transcriptData[nextIndex]) {
      setCurrentTime(transcriptData[nextIndex].startTime);
    }
  };

  const handleStepBack = () => {
    const currentIndex = transcriptData.findIndex(
      line => currentTime >= line.startTime && currentTime < line.endTime
    );
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (prevIndex >= 0 && transcriptData[prevIndex]) {
      setCurrentTime(transcriptData[prevIndex].startTime);
    }
  };

  const handleBreakpoint = () => {
    setIsPlaying(false);
    console.log('学生表示没听懂，触发断点');
    
    // 找到当前时间对应的字幕行
    const currentIndex = transcriptData.findIndex(
      line => currentTime >= line.startTime && currentTime < line.endTime
    );
    
    const currentLine = currentIndex >= 0 ? transcriptData[currentIndex] : null;
    
    // 设置待处理的断点信息
    setPendingBreakpointTime(currentTime);
    setPendingBreakpointText(currentLine?.text || '');
    
    // 打开断点描述输入模态框
    setIsBreakpointModalOpen(true);
  };

  const handleBreakpointSubmit = async (description: string) => {
    try {
      // 创建断点数据
      const breakpoint: Breakpoint = {
        start_time: secondsToSrtTime(pendingBreakpointTime),
        end_time: secondsToSrtTime(pendingBreakpointTime), // 对于断点而言，开始和结束时间相同
        text: pendingBreakpointText || "学生在此处表示没听懂",
        description: description
      };
      
      console.log('创建断点:', breakpoint);
      
      // 调用API创建断点
      if (id) {
        await apiService.createBreakpoint(id, breakpoint);
        console.log('✅ 断点创建成功');
        
        // 添加断点标记到本地状态
        const newBreakpointMarker: BreakpointMarker = {
          id: `breakpoint-${Date.now()}`,
          time: pendingBreakpointTime,
          description: description
        };
        
        setBreakpoints(prev => [...prev, newBreakpointMarker]);
        
        // 更新AI助手的断点上下文
        setAiBreakpointsContext(prev => [...prev, breakpoint]);
        
        // 可以在这里添加成功提示
        console.log('✅ 断点标记已添加到视频进度条');
      } else {
        console.error('❌ 无法创建断点：缺少workspace ID');
        throw new Error('缺少workspace ID');
      }
    } catch (error) {
      console.error('❌ 创建断点失败:', error);
      throw error; // 重新抛出错误，让模态框处理
    }
  };

  const handleStepIn = () => {
    console.log('Step In 步入这一句的详细解释');
  };

  const handleStepOut = () => {
    console.log('联系整个上下文对当前概念进行解释');
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

    const totalLines = editorContent.split('\n').length;
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
  }, [currentTime, isPlaying, currentMode, editorContent]);

  // Auto-scroll transcript in debug mode
  useEffect(() => {
    if (currentMode !== 'debug') return;
    
    const activeIndex = transcriptData.findIndex(
      line => currentTime >= line.startTime && currentTime < line.endTime
    );
    
    if (activeIndex !== -1 && scrollContainerRef.current) {
      const element = scrollContainerRef.current.children[activeIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, currentMode, transcriptData]);

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

      {/* 浮动AI Dock */}
      <FloatingAIDock
        isVisible={isAIDockVisible}
        onClose={() => setIsAIDockVisible(false)}
        contextCode={MOCK_MARKDOWN}
        selectedContext={{
          text: "const handleCompile = () => {",
          file: "components/CompileToolbar.tsx",
          line: 42
        }}
        breakpoints={aiBreakpointsContext}
      />

      {/* 浮动AI按钮 */}
      <FloatingAIButton
        onClick={() => setIsAIDockVisible(true)}
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
                    src={currentVideoUrl}
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
                    breakpoints={breakpoints}
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
                        compileResult={compileResult}
                        errorCount={errorCount}
                        warningCount={warningCount}
                        progressMessage={progressMessage}
                      />
                      
                      <div className="flex-1">
                        {isLoadingWorkspace ? (
                          <div className="h-full flex items-center justify-center bg-slate-900">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                              <p className="text-slate-400">正在加载workspace数据...</p>
                            </div>
                          </div>
                        ) : workspaceError ? (
                          <div className="h-full flex items-center justify-center bg-slate-900">
                            <div className="text-center">
                              <p className="text-red-400 mb-2">加载失败</p>
                              <p className="text-slate-500 text-sm">{workspaceError}</p>
                            </div>
                          </div>
                        ) : (
                          <Editor
                            height="100%"
                            defaultLanguage="markdown"
                            theme="vs-dark"
                            value={editorContent}
                            onChange={(value) => setEditorContent(value || '')}
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
                        )}
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
                            onRestart={handleRestart}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4 w-full">
                        {isLoadingSubtitles ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-slate-400 text-sm">正在加载字幕数据...</p>
                          </div>
                        ) : subtitlesError ? (
                          <div className="text-center py-8">
                            <p className="text-red-400 text-sm mb-2">字幕加载失败</p>
                            <p className="text-slate-500 text-xs">{subtitlesError}</p>
                            <p className="text-slate-400 text-xs mt-2">使用默认字幕数据</p>
                          </div>
                        ) : null}
                        
                        {transcriptData.map((line) => {
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
                      compileResult={compileResult}
                      errorCount={errorCount}
                      warningCount={warningCount}
                      progressMessage={progressMessage}
                    />
                    
                    <div className="flex-1">
                      {isLoadingWorkspace ? (
                        <div className="h-full flex items-center justify-center bg-slate-900">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-slate-400">正在加载workspace数据...</p>
                          </div>
                        </div>
                      ) : workspaceError ? (
                        <div className="h-full flex items-center justify-center bg-slate-900">
                          <div className="text-center">
                            <p className="text-red-400 mb-2">加载失败</p>
                            <p className="text-slate-500 text-sm">{workspaceError}</p>
                          </div>
                        </div>
                      ) : (
                        <Editor
                          height="100%"
                          defaultLanguage="markdown"
                          theme="vs-dark"
                          value={editorContent}
                          onChange={(value) => setEditorContent(value || '')}
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
                      )}
                    </div>
                  </div>
                }
                rightPanel={
                  <div className="h-full bg-black relative flex flex-col">
                    <div className="flex-1 relative">
                      <UnifiedVideoPlayer 
                        src={currentVideoUrl}
                        currentTime={currentTime}
                        onTimeUpdate={setCurrentTime}
                        isPlaying={isPlaying}
                        onPlayPause={setIsPlaying}
                        volume={volume}
                        onVolumeChange={setVolume}
                        className="w-full h-full"
                        showAdvancedControls={true}
                        breakpoints={breakpoints}
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
                      src={currentVideoUrl}
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
                      breakpoints={breakpoints}
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
                            onRestart={handleRestart}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4 w-full">
                        {transcriptData.map((line) => {
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
      
      {/* 断点描述输入模态框 */}
      <BreakpointModal
        isOpen={isBreakpointModalOpen}
        onClose={() => setIsBreakpointModalOpen(false)}
        onSubmit={handleBreakpointSubmit}
        currentTime={pendingBreakpointTime}
        subtitleText={pendingBreakpointText}
      />
    </div>
  );
};

export default UnifiedWorkspace;