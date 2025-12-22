import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  Clock, 
  User, 
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { Commit } from '../types';

interface GitLensPanelProps {
  commits: Commit[];
}

const GitLensPanel: React.FC<GitLensPanelProps> = ({ commits }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set());

  // Get unique branches
  const branches = ['all', ...Array.from(new Set(commits.map(c => c.branch)))];
  
  // Filter commits
  const filteredCommits = commits.filter(commit => {
    const matchesSearch = commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commit.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || commit.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  const toggleCommitExpansion = (commitId: string) => {
    const newExpanded = new Set(expandedCommits);
    if (newExpanded.has(commitId)) {
      newExpanded.delete(commitId);
    } else {
      newExpanded.add(commitId);
    }
    setExpandedCommits(newExpanded);
  };

  const getBranchColor = (branch: string) => {
    switch (branch) {
      case 'main': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'feature': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'hotfix': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter Bar */}
      <div className="p-4 space-y-3 border-b border-slate-700/50">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索提交信息或作者..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary/50 focus:bg-slate-800"
          />
        </div>

        {/* Branch Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-600/50 rounded text-sm text-slate-200 focus:outline-none focus:border-primary/50"
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>
                {branch === 'all' ? '所有分支' : branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Commit Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-slate-600/50 to-transparent" />
          
          <div className="space-y-4">
            {filteredCommits.map((commit, index) => {
              const isExpanded = expandedCommits.has(commit.id);
              const isFirst = index === 0;
              
              return (
                <div key={commit.id} className="relative">
                  {/* Timeline node */}
                  <div className={`
                    absolute left-4 top-3 w-4 h-4 rounded-full border-2 z-10
                    ${commit.isCurrent 
                      ? 'bg-primary border-primary shadow-lg shadow-primary/30' 
                      : isFirst
                        ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/30'
                        : 'bg-slate-700 border-slate-600'
                    }
                  `}>
                    {commit.isCurrent && (
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
                    )}
                  </div>

                  {/* Commit Card */}
                  <div className="ml-12 group">
                    <div 
                      className={`
                        p-4 rounded-lg border transition-all duration-200 cursor-pointer
                        ${commit.isCurrent 
                          ? 'bg-slate-800/80 border-primary/30 shadow-lg shadow-primary/5' 
                          : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/50'
                        }
                      `}
                      onClick={() => toggleCommitExpansion(commit.id)}
                    >
                      {/* Commit Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <GitCommit size={14} className="text-slate-400" />
                            <code className="text-xs font-mono text-accent bg-slate-700/50 px-2 py-0.5 rounded">
                              {commit.id.substring(0, 8)}
                            </code>
                          </div>
                          
                          <h3 className="text-sm font-medium text-slate-200 mb-2 leading-tight">
                            {commit.message}
                          </h3>
                          
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span>{commit.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{commit.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className={`
                          px-2 py-1 rounded text-xs font-medium border
                          ${getBranchColor(commit.branch)}
                        `}>
                          <GitBranch size={10} className="inline mr-1" />
                          {commit.branch}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                          {/* Files Changed */}
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300">
                              <FileText size={12} />
                              <span>文件变更</span>
                            </div>
                            <div className="space-y-1">
                              {['src/components/VideoPlayer.tsx', 'src/pages/StudentClassroom.tsx'].map((file, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  <span className="text-slate-400 font-mono">{file}</span>
                                  <span className="text-green-400">+12</span>
                                  <span className="text-red-400">-3</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded border border-primary/20 hover:bg-primary/20 transition-colors">
                              查看差异
                            </button>
                            <button className="px-3 py-1.5 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600/50 hover:bg-slate-700 transition-colors">
                              检出此版本
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="flex justify-between text-xs text-slate-400">
          <span>{filteredCommits.length} 个提交</span>
          <span>{branches.length - 1} 个分支</span>
        </div>
      </div>
    </div>
  );
};

export default GitLensPanel;