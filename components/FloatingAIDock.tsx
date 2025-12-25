import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Maximize2, 
  Minimize2,
  Send,
  Trash2,
  Settings,
  Code,
  Circle
} from 'lucide-react';
import { ChatMessage, Breakpoint } from '../types';
import { createChatSession, sendMessage } from '../services/geminiService';
import { Chat } from '@google/genai';

interface FloatingAIDockProps {
  isVisible: boolean;
  onClose: () => void;
  contextCode?: string;
  selectedContext?: {
    text: string;
    file: string;
    line: number;
  };
  breakpoints?: Breakpoint[]; // 改为使用实际的断点数据
}

const FloatingAIDock: React.FC<FloatingAIDockProps> = ({ 
  isVisible, 
  onClose,
  contextCode = '',
  selectedContext,
  breakpoints = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '0', 
      role: 'model', 
      text: '随时问我。', 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize session with context
    let systemPrompt = `You are a helpful AI assistant for an educational platform.`;
    
    if (contextCode) {
      systemPrompt += `\nThe user is currently looking at the following content:\n\`\`\`\n${contextCode}\n\`\`\``;
    }
    
    // 如果有断点数据，添加到上下文中
    if (breakpoints && breakpoints.length > 0) {
      systemPrompt += `\n\nThe student has marked the following learning breakpoints where they had difficulties:`;
      breakpoints.forEach((bp, index) => {
        systemPrompt += `\n${index + 1}. At time ${bp.start_time}: "${bp.description || bp.text}"`;
      });
      systemPrompt += `\n\nPlease pay special attention to these areas when answering questions, as the student has indicated they found these concepts challenging.`;
    }
    
    systemPrompt += `\nAnswer their questions concisely and help them understand the concepts.`;
    
    chatSessionRef.current = createChatSession(systemPrompt);
  }, [contextCode, breakpoints]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    let responseText = '';
    if (chatSessionRef.current) {
      responseText = await sendMessage(chatSessionRef.current, input);
    } else {
      // Fallback if API key missing
      await new Promise(r => setTimeout(r, 1000));
      responseText = "我目前无法连接到服务器 (API Key missing)。但我可以帮你分析代码结构和概念。";
    }

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleClearChat = () => {
    setMessages([
      { 
        id: '0', 
        role: 'model', 
        text: '随时问我。', 
        timestamp: Date.now() 
      }
    ]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      
      {/* 浮动Dock */}
      <div className={`
        git-dock-clean
        relative rounded-lg shadow-2xl pointer-events-auto bg-white
        ${isExpanded 
          ? 'w-[90vw] h-[85vh] max-w-6xl' 
          : 'w-[70vw] h-[60vh] max-w-4xl'
        }
      `}>
        {/* 头部工具栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI 助手</h3>
              <p className="text-xs text-gray-600">
                {messages.length - 1} 条对话 · 智能问答
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 清空聊天按钮 */}
            <button 
              onClick={handleClearChat}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="清空聊天记录"
            >
              <Trash2 size={16} className="text-gray-600" />
            </button>
            
            {/* 设置按钮 */}
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings size={16} className="text-gray-600" />
            </button>
            
            {/* 展开/收缩按钮 */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? (
                <Minimize2 size={16} className="text-gray-600" />
              ) : (
                <Maximize2 size={16} className="text-gray-600" />
              )}
            </button>
            
            {/* 关闭按钮 */}
            <button 
              onClick={onClose}
              className="p-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X size={16} className="text-red-600" />
            </button>
          </div>
        </div>
        
        {/* 聊天区域 */}
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                  <Bot size={16} className="text-blue-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none border border-gray-200">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* 状态引用区域 */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {/* 左侧：选中上下文 */}
              <div className="flex items-center gap-3">
                {selectedContext ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-200/50 shadow-sm">
                    <Code size={14} className="text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">
                      {selectedContext.file}:{selectedContext.line}
                    </span>
                    <span className="text-xs text-blue-600 max-w-32 truncate">
                      {selectedContext.text}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
                    <Code size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500">无选中内容</span>
                  </div>
                )}
              </div>
              
              {/* 右侧：断点信息 */}
              <div className="flex items-center gap-2">
                {breakpoints && breakpoints.length > 0 ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-lg border border-red-200/50 shadow-sm">
                    <Circle size={14} className="text-red-600 fill-current" />
                    <span className="text-xs font-medium text-red-800">
                      {breakpoints.length} 个学习断点
                    </span>
                    <span className="text-xs text-red-600 max-w-32 truncate">
                      {breakpoints[0]?.description || breakpoints[0]?.text}
                      {breakpoints.length > 1 && ` +${breakpoints.length - 1}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50">
                    <Circle size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500">无学习断点</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 输入区域 */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="询问关于代码或课程的问题..."
                className="w-full bg-white border border-gray-300 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-2 p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingAIDock;