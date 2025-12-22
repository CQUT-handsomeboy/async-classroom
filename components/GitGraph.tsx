import React from 'react';
import { GitCommit, GitBranch } from 'lucide-react';
import { Commit } from '../types';

interface GitGraphProps {
  commits: Commit[];
}

const GitGraph: React.FC<GitGraphProps> = ({ commits }) => {
  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-400">
        <GitBranch size={16} />
        <span>版本历史 (Git Lens)</span>
      </div>
      
      <div className="relative border-l-2 border-slate-700 ml-3 space-y-6 pb-4">
        {commits.map((commit, index) => (
          <div key={commit.id} className="relative pl-6">
            {/* Dot on the timeline */}
            <div 
              className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                commit.isCurrent 
                  ? 'bg-primary border-primary' 
                  : 'bg-surface border-slate-500'
              }`} 
            />
            
            <div className={`p-3 rounded-md border ${
              commit.isCurrent 
                ? 'bg-slate-800 border-primary/50' 
                : 'bg-transparent border-slate-700 hover:bg-slate-800/50'
            } transition-colors cursor-pointer`}>
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-accent">
                  {commit.id.substring(0, 7)}
                </span>
                <span className="text-xs text-slate-500">{commit.date}</span>
              </div>
              <p className="text-sm font-medium text-slate-200 mt-1">
                {commit.message}
              </p>
              <div className="flex items-center gap-2 mt-2">
                 <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-[10px] text-white">
                    {commit.author.charAt(0)}
                 </div>
                 <span className="text-xs text-slate-400">{commit.author}</span>
                 <span className={`text-[10px] px-1.5 py-0.5 rounded ml-auto ${
                   commit.branch === 'main' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'
                 }`}>
                   {commit.branch}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitGraph;
