import React from 'react';
import { GitBranch } from 'lucide-react';
import { Gitgraph, templateExtend, TemplateName } from '@gitgraph/react';
import { Commit } from '../types';

interface GitGraphProps {
  commits: Commit[];
}

const GitGraph: React.FC<GitGraphProps> = ({ commits }) => {
  // 自定义深色主题模板
  const customTemplate = templateExtend(TemplateName.Metro, {
    colors: ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'],
    branch: {
      lineWidth: 3,
      spacing: 50,
      label: {
        display: true,
        bgColor: '#1e293b',
        color: '#e2e8f0',
        borderRadius: 6,
        font: 'normal 11px sans-serif',
      },
    },
    commit: {
      spacing: 80,
      dot: {
        size: 10,
        strokeWidth: 2,
      },
      message: {
        displayAuthor: true,
        displayHash: true,
        color: '#e2e8f0',
        font: 'normal 12px sans-serif',
      },
    },
    arrow: {
      size: 8,
      color: '#64748b',
    },
  });

  // 如果没有提交数据，显示空状态
  if (!commits || commits.length === 0) {
    return (
      <div className="h-full overflow-auto pr-2">
        <div className="flex items-center gap-2 mb-4 p-4 text-sm font-semibold text-gray-400">
          <GitBranch size={16} />
          <span>Git 分支图</span>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4 min-h-96 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <GitBranch size={48} className="mx-auto mb-4 opacity-50" />
            <p>暂无提交记录</p>
          </div>
        </div>
      </div>
    );
  }

  // 按时间排序提交（从旧到新，用于正确的分支图显示）
  const chronologicalCommits = [...commits].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="h-full overflow-auto pr-2">
      <div className="flex items-center gap-2 mb-4 p-4 text-sm font-semibold text-gray-400">
        <GitBranch size={16} />
        <span>Git 分支图 ({commits.length} 个提交)</span>
      </div>
      
      <div className="bg-slate-900 rounded-lg p-4 min-h-96">
        <Gitgraph options={{ 
          template: customTemplate
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
            const branches: Record<string, any> = { main: master };
            
            // 首先添加主分支的提交
            if (commitsByBranch.main) {
              commitsByBranch.main.forEach((commit) => {
                master.commit({
                  subject: commit.message,
                  author: commit.author,
                  hash: commit.id,
                  style: {
                    dot: {
                      color: commit.isCurrent ? '#3b82f6' : '#64748b',
                      strokeWidth: commit.isCurrent ? 4 : 2,
                    },
                    message: {
                      color: commit.isCurrent ? '#3b82f6' : '#e2e8f0',
                    },
                  },
                });
              });
            }
            
            // 处理其他分支
            Object.keys(commitsByBranch).forEach((branchName) => {
              if (branchName !== 'main') {
                // 创建分支
                branches[branchName] = gitgraph.branch({
                  name: branchName,
                  from: master
                });
                
                // 添加该分支的提交
                commitsByBranch[branchName].forEach((commit) => {
                  branches[branchName].commit({
                    subject: commit.message,
                    author: commit.author,
                    hash: commit.id,
                    style: {
                      dot: {
                        color: commit.isCurrent ? '#3b82f6' : '#a855f7',
                        strokeWidth: commit.isCurrent ? 4 : 2,
                      },
                      message: {
                        color: commit.isCurrent ? '#3b82f6' : '#e2e8f0',
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
  );
};

export default GitGraph;
