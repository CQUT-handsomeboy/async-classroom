/**
 * 获取面板标题
 * @param activeTab 当前激活的标签页
 * @param context 上下文，用于区分不同页面的标题差异
 * @returns 面板标题
 */
export const getPanelTitle = (activeTab: string, context: 'teacher' | 'student' = 'student'): string => {
  switch (activeTab) {
    case 'git': return 'Git 版本控制';
    case 'crash': return '思维断点分析';
    case 'edit': return '编辑模式';
    case 'debug': return '调试模式';
    case 'chat': 
      return context === 'student' ? 'AI 学习助手' : 'AI 助手';
    case 'settings': return '设置';
    default: return '';
  }
};

/**
 * 将秒数转换为字幕时间格式 (HH:MM:SS,mmm)
 * @param seconds 秒数
 * @returns 字幕时间格式字符串
 */
export const secondsToSrtTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
};