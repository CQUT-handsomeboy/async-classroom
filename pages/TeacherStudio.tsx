import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import UnifiedVideoPlayer from '../components/UnifiedVideoPlayer';
import CrashPanel from '../components/CrashPanel';
import ResizableSplitter from '../components/ResizableSplitter';
import Sidebar, { SidebarTab } from '../components/Sidebar';
import SidePanel from '../components/SidePanel';
import GitLensPanel from '../components/GitLensPanel';
import CompileToolbar from '../components/CompileToolbar';
import { MOCK_MARKDOWN, COMMITS, CRASH_DATA } from '../constants';
import { getPanelTitle } from '../utils';

const TeacherStudio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<SidebarTab>('git');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [currentMode, setCurrentMode] = useState<'edit' | 'debug'>('edit'); // 教师默认编辑模式
  
  // Compile toolbar state
  const [compileStatus, setCompileStatus] = useState<'idle' | 'compiling' | 'success' | 'error'>('idle');
  const [isCompiling, setIsCompiling] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const handleModeChange = (mode: 'teacher' | 'student') => {
    if (mode === 'student') {
      navigate(`/student/${id}`);
    }
    // If already in teacher mode, no navigation needed
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
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">AI 助手</h3>
            <p className="text-slate-400">教师AI助手开发中...</p>
          </div>
        );
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
            <p className="text-slate-400">教师编辑面板开发中...</p>
          </div>
        );
      case 'debug':
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">调试模式</h3>
            <p className="text-slate-400">教师调试面板开发中...</p>
          </div>
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
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟编译时间
      
      // 模拟编译结果
      const hasErrors = Math.random() > 0.7; // 30% 概率有错误
      const hasWarnings = Math.random() > 0.5; // 50% 概率有警告
      
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

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    // Simple mock mapping: map video time to markdown lines roughly
    // In a real app, this would come from the compiler's source map
    const totalLines = MOCK_MARKDOWN.split('\n').length;
    // Assuming the video is approx 180s and the mock markdown is ~32 lines
    // We map roughly 6 seconds per line for this demo
    const line = Math.min(Math.floor(currentTime / 6) + 1, totalLines);
    
    // Use deltaDecorations to highlight the line
    const newDecorations = editorRef.current.deltaDecorations(decorations, [
      {
        range: new monacoRef.current.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'current-line-highlight', // Defined in index.html
        }
      }
    ]);
    setDecorations(newDecorations);

    // Auto scroll to the highlighted line if playing
    if (isPlaying) {
      editorRef.current.revealLineInCenter(line);
    }
    
  }, [currentTime, isPlaying]);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole="teacher"
      />

      {/* Side Panel - 只在git模式下显示 */}
      {isPanelOpen && activeTab === 'git' && (
        <SidePanel
          activeTab={activeTab}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          title={getPanelTitle(activeTab, 'teacher')}
        >
          {renderPanelContent()}
        </SidePanel>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Grid */}
        <div className="flex-1 flex overflow-hidden">
          {(currentMode === 'edit' || currentMode === 'debug') ? (
            /* 编辑模式和调试模式：左侧视频，右侧功能区 */
            <ResizableSplitter
              defaultLeftWidth={60}
              minLeftWidth={40}
              maxLeftWidth={75}
              leftPanel={
                /* Left: Video */
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
                    
                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4 liquid-glass-dark text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2">
                      <PlayCircle size={14} className="text-green-400"/>
                      {currentMode === 'edit' ? '编辑预览' : '调试模式'}
                    </div>
                  </div>
                </div>
              }
              rightPanel={
                /* Right: 功能区 */
                <div className="h-full border-l border-slate-700 flex flex-col bg-surface">
                  {currentMode === 'edit' ? (
                    /* 编辑模式功能区 */
                    <div className="h-full flex flex-col">
                      {/* Compile Toolbar */}
                      <CompileToolbar
                        onCompile={handleCompile}
                        isCompiling={isCompiling}
                        compileStatus={compileStatus}
                        errorCount={errorCount}
                        warningCount={warningCount}
                      />
                      
                      {/* Monaco Editor */}
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
                    <div className="h-full flex flex-col p-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-4">调试模式</h3>
                      <p className="text-slate-400">教师调试面板开发中...</p>
                    </div>
                  )}
                </div>
              }
            />
          ) : (
            /* 其他模式保持原有布局 */
            <ResizableSplitter
              defaultLeftWidth={35}
              minLeftWidth={25}
              maxLeftWidth={60}
              leftPanel={
                /* Left: Markdown Editor */
                <div className="h-full border-r border-slate-700 flex flex-col">
                  {/* Compile Toolbar */}
                  <CompileToolbar
                    onCompile={handleCompile}
                    isCompiling={isCompiling}
                    compileStatus={compileStatus}
                    errorCount={errorCount}
                    warningCount={warningCount}
                  />
                  
                  {/* Monaco Editor */}
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
                /* Right: Video Preview */
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
                    
                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4 liquid-glass-dark text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2">
                      <PlayCircle size={14} className="text-green-400"/>
                      实时预览
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

export default TeacherStudio;