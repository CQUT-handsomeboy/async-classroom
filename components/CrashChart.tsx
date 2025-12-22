import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CrashPoint } from '../types';

interface CrashChartProps {
  data: CrashPoint[];
  currentTime: number;
  onSeek: (time: number) => void;
}

const CrashChart: React.FC<CrashChartProps> = ({ data, currentTime, onSeek }) => {
  return (
    <div className="w-full h-full relative">
       <h3 className="text-xs font-semibold text-gray-400 absolute top-2 left-2 z-10">
         学生思维断点分布 (Crash Points)
       </h3>
       <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
          onClick={(e) => {
            if (e && e.activeLabel) {
              onSeek(Number(e.activeLabel));
            }
          }}
        >
          <defs>
            <linearGradient id="colorCrash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timestamp" 
            tick={{fontSize: 10, fill: '#94a3b8'}}
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} />
          <Tooltip 
            contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9'}}
            labelStyle={{color: '#94a3b8'}}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#f59e0b" 
            fillOpacity={1} 
            fill="url(#colorCrash)" 
            strokeWidth={2}
          />
          <ReferenceLine x={currentTime} stroke="#3b82f6" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrashChart;
