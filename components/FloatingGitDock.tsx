import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  X, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Search
} from 'lucide-react';
import { Gitgraph, templateExtend, TemplateName } from '@gitgraph/react';
import { Commit } from '../types';

interface FloatingGitDockProps {
  commits: Commit[];
  isVisible: boolean;
  onClose: () => void;
}

const FloatingGitDock: React.FC<FloatingGitDockProps> = ({ 
  commits, 
  isVisible, 
  onClose 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  // 简洁白底黑字主题
  const customTemplate = templateExtend(TemplateName.Metro, {
    colors: ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#ea580c'],
    branch: {
      lineWidth: 3,
      spacing: 50,
      label: {
        display: true,
        bgColor: '#ffffff',
        color: '#1f2937',
        borderRadius: 6,
        font: 'bold 12px "Inter", sans-serif',
        strokeColor: '#e5e7eb',
      },
    },
    commit: {
      spacing: 80,
      dot: {
        size: 10,
        strokeWidth: 2,
        strokeColor: '#6b7280',
      },
      message: {
        displayAuthor: true,
        displayHash: true,
        color: '#374151',
        font: 'normal 13px "Inter", sans-serif',
      },
    },
    arrow: {
      size: 8,
      color: '#6b7280',
    },
  });

  // 获取所有分支
  const branches = Array.from(new Set(commits.map(c => c.branch)));
  
  // 过滤提交
  const filteredCommits = commits.filter(commit => {
    const matchesSearch = commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commit.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || commit.branch === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  // 按时间排序提交
  const chronologicalCommits = [...filteredCommits].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
              <GitBranch size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Git 分支图</h3>
              <p className="text-xs text-gray-600">
                {filteredCommits.length} 个提交 · {branches.length} 个分支
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 搜索框 */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索提交..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* 分支过滤器 */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">所有分支</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            
            {/* 刷新按钮 */}
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={16} className="text-gray-600" />
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
        
        {/* Git图表区域 */}
        <div className="flex-1 overflow-hidden">
          {chronologicalCommits.length === 0 ? (
            /* 空状态 */
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500 p-12 max-w-md mx-auto">
                <GitBranch size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">
                  {searchTerm || selectedBranch !== 'all' ? '未找到匹配的提交' : '暂无提交记录'}
                </p>
                <p className="text-sm opacity-75">
                  {searchTerm || selectedBranch !== 'all' ? '尝试调整搜索条件' : '开始您的第一次提交'}
                </p>
              </div>
            </div>
          ) : (
            /* Git图表 */
            <div className="h-full overflow-auto p-6 bg-white">
              <div className="git-graph-clean min-h-full p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <Gitgraph options={{ 
                  template: customTemplate,
                  orientation: 'vertical-reverse' as any,
                  mode: 'extended' as any
                }}>
                  {(gitgraph) => {
                    // 创建主分支
                    const master = gitgraph.branch('main');
                    
                    // 获取按分支分组的提交
                    const commitsByBranch = chronologicalCommits.reduce((acc, commit) => {
                      if (!acc[commit.branch]) {
                        acc[commit.branch] = [];
                      }
                      acc[commit.branch].push(commit);
                      return acc;
                    }, {} as Record<string, typeof chronologicalCommits>);
                    
                    // 创建分支映射
                    const branchMap: Record<string, any> = { main: master };
                    
                    // 首先添加主分支的提交
                    if (commitsByBranch.main) {
                      commitsByBranch.main.forEach((commit) => {
                        master.commit({
                          subject: commit.message.length > 60 
                            ? commit.message.substring(0, 57) + '...' 
                            : commit.message,
                          author: commit.author,
                          hash: commit.id.substring(0, 7),
                          style: {
                            dot: {
                              color: commit.isCurrent ? '#2563eb' : '#6b7280',
                              strokeWidth: commit.isCurrent ? 3 : 2,
                              size: commit.isCurrent ? 12 : 10,
                            },
                            message: {
                              color: commit.isCurrent ? '#1e40af' : '#374151',
                              font: commit.isCurrent 
                                ? 'bold 14px "Inter", sans-serif' 
                                : 'normal 13px "Inter", sans-serif',
                            },
                          },
                        });
                      });
                    }
                    
                    // 处理其他分支
                    Object.keys(commitsByBranch).forEach((branchName) => {
                      if (branchName !== 'main' && branchName !== 'master') {
                        // 创建分支
                        branchMap[branchName] = gitgraph.branch({
                          name: branchName,
                          from: master
                        });
                        
                        // 添加该分支的提交
                        commitsByBranch[branchName].forEach((commit) => {
                          branchMap[branchName].commit({
                            subject: commit.message.length > 60 
                              ? commit.message.substring(0, 57) + '...' 
                              : commit.message,
                            author: commit.author,
                            hash: commit.id.substring(0, 7),
                            style: {
                              dot: {
                                color: commit.isCurrent ? '#2563eb' : '#7c3aed',
                                strokeWidth: commit.isCurrent ? 3 : 2,
                                size: commit.isCurrent ? 12 : 10,
                              },
                              message: {
                                color: commit.isCurrent ? '#1e40af' : '#374151',
                                font: commit.isCurrent 
                                  ? 'bold 14px "Inter", sans-serif' 
                                  : 'normal 13px "Inter", sans-serif',
                              },
                            },
                          });
                        });
                      }
                    });
                  }}
                </Gitgraph>
              </div>
            </div>
          )}
        </div>
        
        {/* 底部状态栏 */}
        <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-600 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>当前分支</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>功能分支</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>历史提交</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <GitCommit size={12} />
            <span>最后更新: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingGitDock;