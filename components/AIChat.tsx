import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage, Breakpoint } from '../types';
import { createChatSession, sendMessage } from '../services/geminiService';
import { Chat } from '@google/genai';

interface AIChatProps {
  contextCode: string; // The current code/markdown shown to the student
  breakpoints?: Breakpoint[]; // 断点数据作为上下文
}

const AIChat: React.FC<AIChatProps> = ({ contextCode, breakpoints = [] }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize session with context
    let systemPrompt = `You are a helpful teaching assistant for an educational platform where courses are written in Markdown and compiled to video. 
    The student is currently looking at the following lesson plan (Markdown):
    \`\`\`markdown
    ${contextCode}
    \`\`\``;
    
    // 如果有断点数据，添加到上下文中
    if (breakpoints.length > 0) {
      systemPrompt += `\n\nThe student has marked the following learning breakpoints where they had difficulties:`;
      breakpoints.forEach((bp, index) => {
        systemPrompt += `\n${index + 1}. At time ${bp.start_time}: "${bp.description || bp.text}"`;
      });
      systemPrompt += `\n\nPlease pay special attention to these areas when answering questions, as the student has indicated they found these concepts challenging.`;
    }
    
    systemPrompt += `\nAnswer their questions concisely and encourage them to understand the mathematical concepts or the logic in the lesson.`;
    
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
        responseText = "我目前无法连接到服务器 (API Key missing). 但你可以尝试查看 Markdown 中的公式推导部分。";
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

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center gap-2">
        <Bot className="text-primary" />
        <h2 className="font-semibold text-slate-200">AI 助教</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-primary/20 text-primary'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-700 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                <Bot size={16} />
             </div>
             <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none border border-slate-700">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75" />
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150" />
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="询问关于代码或课程的问题..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-primary text-slate-200"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-2 p-1 text-slate-400 hover:text-primary disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;