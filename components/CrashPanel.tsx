import React from 'react';
import { AlertTriangle } from 'lucide-react';
import CrashChart from './CrashChart';
import { CrashPoint } from '../types';

interface CrashPanelProps {
  data: CrashPoint[];
  currentTime: number;
  onSeek: (time: number) => void;
}

const CrashPanel: React.FC<CrashPanelProps> = ({ data, currentTime, onSeek }) => {
  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={20} className="text-accent" />
          <h2 className="text-xl font-bold text-slate-200">思维断点分析</h2>
        </div>
        <p className="text-sm text-slate-400">
          
        </p>
      </div>

      {/* Chart Container */}
      <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 min-h-0">
        <CrashChart 
          data={data} 
          currentTime={currentTime}
          onSeek={onSeek}
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-slate-800/20 rounded-lg border border-slate-700/30">
        <p className="text-xs text-slate-400 text-center">
          点击图表中的波峰可快速定位到学生高频疑惑点
        </p>
      </div>
    </div>
  );
};

export default CrashPanel;