import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, GraduationCap, Home } from 'lucide-react';

interface FloatingToolbarProps {
  currentMode: 'teacher' | 'student';
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ currentMode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleModeSwitch = (mode: 'teacher' | 'student') => {
    if (mode !== currentMode && id) {
      navigate(`/${mode}/${id}`);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
        {/* Home Button */}
        <button
          onClick={handleHome}
          className="p-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-slate-300 hover:text-white group"
          title="返回首页"
        >
          <Home size={18} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Separator */}
        <div className="w-px h-8 bg-white/10" />

        {/* Teacher Mode Button */}
        <button
          onClick={() => handleModeSwitch('teacher')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
            currentMode === 'teacher'
              ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="教师模式"
        >
          <Users size={16} className={currentMode === 'teacher' ? 'text-blue-300' : ''} />
          <span>教师模式</span>
        </button>

        {/* Student Mode Button */}
        <button
          onClick={() => handleModeSwitch('student')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
            currentMode === 'student'
              ? 'bg-green-500/30 text-green-200 border border-green-400/30 shadow-lg shadow-green-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="学生模式"
        >
          <GraduationCap size={16} className={currentMode === 'student' ? 'text-green-300' : ''} />
          <span>学生模式</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingToolbar;