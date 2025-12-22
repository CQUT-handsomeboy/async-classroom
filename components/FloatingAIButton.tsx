import React from 'react';
import { Bot } from 'lucide-react';

interface FloatingAIButtonProps {
  onClick: () => void;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group border-2 border-white/20"
      title="打开 AI 助手"
    >
      <Bot size={24} className="transition-transform duration-200 group-hover:scale-110" />
      
      {/* 脉冲动画 */}
      <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg">
        AI 助手
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
      </div>
    </button>
  );
};

export default FloatingAIButton;
