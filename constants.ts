import { Course, Commit, CrashPoint, TranscriptLine } from './types';

// 环境变量配置
export const CONFIG = {
  VIDEO_SERVER_URL: 'https://frp-put.com:33747',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
} as const;

export const COURSES: Course[] = [
  {
    id: '1',
    title: '微积分本质：极限与导数',
    author: '3Blue1Brown (Mirror)',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    description: '通过Manim可视化引擎，直观地理解微积分的核心概念。',
    duration: '15:20',
    views: 12400
  },
  {
    id: '2',
    title: '线性代数：特征向量',
    author: '张教授',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    description: '深入浅出讲解特征值与特征向量的几何意义。',
    duration: '22:10',
    views: 8900
  },
  {
    id: '3',
    title: '傅里叶变换详解',
    author: 'AsyncOfficial',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    description: '从声波到频率域，揭示信号处理的奥秘。',
    duration: '18:45',
    views: 32000
  }
];

export const MOCK_MARKDOWN = `没有获取到数据`;

export const COMMITS: Commit[] = [
  // 主分支提交
  { id: 'c1', message: 'feat: Add tangent line visualization', author: 'Teacher', date: '2023-10-25', isCurrent: true, branch: 'main' },
  { id: 'c3', message: 'docs: Update explanation text', author: 'Teacher', date: '2023-10-23', isCurrent: false, branch: 'main' },
  { id: 'c5', message: 'fix: Animation timing issues', author: 'Teacher', date: '2023-10-21', isCurrent: false, branch: 'main' },
  { id: 'c8', message: 'init: Initial project setup', author: 'Teacher', date: '2023-10-20', isCurrent: false, branch: 'main' },
  
  // 学生分支提交
  { id: 'c2', message: 'fix: Adjust axis range', author: 'Student_01', date: '2023-10-24', isCurrent: false, branch: 'student-fork' },
  { id: 'c6', message: 'style: Improve UI colors', author: 'Student_01', date: '2023-10-21', isCurrent: false, branch: 'student-fork' },
  { id: 'c9', message: 'feat: Add dark mode support', author: 'Student_01', date: '2023-10-19', isCurrent: false, branch: 'student-fork' },
  
  // 功能分支提交
  { id: 'c4', message: 'feat: Add interactive controls', author: 'Student_02', date: '2023-10-22', isCurrent: false, branch: 'feature/controls' },
  { id: 'c7', message: 'feat: Add math formula renderer', author: 'Student_02', date: '2023-10-20', isCurrent: false, branch: 'feature/controls' },
  { id: 'c10', message: 'test: Add unit tests for controls', author: 'Student_02', date: '2023-10-18', isCurrent: false, branch: 'feature/controls' },
  
  // 实验分支提交
  { id: 'c11', message: 'experiment: Try WebGL renderer', author: 'Student_03', date: '2023-10-17', isCurrent: false, branch: 'experiment/webgl' },
  { id: 'c12', message: 'perf: Optimize animation performance', author: 'Student_03', date: '2023-10-16', isCurrent: false, branch: 'experiment/webgl' },
  
  // 修复分支提交
  { id: 'c13', message: 'hotfix: Critical bug in calculation', author: 'Teacher', date: '2023-10-15', isCurrent: false, branch: 'hotfix/calculation' },
  { id: 'c14', message: 'fix: Memory leak in animation loop', author: 'Teacher', date: '2023-10-14', isCurrent: false, branch: 'hotfix/calculation' },
  
  // 文档分支提交
  { id: 'c15', message: 'docs: Add API documentation', author: 'Student_04', date: '2023-10-13', isCurrent: false, branch: 'docs/api' },
  { id: 'c16', message: 'docs: Update README with examples', author: 'Student_04', date: '2023-10-12', isCurrent: false, branch: 'docs/api' },
];

export const CRASH_DATA: CrashPoint[] = [
  { timestamp: 10, count: 2 },
  { timestamp: 30, count: 5 },
  { timestamp: 45, count: 12 }, // Crash spike
  { timestamp: 60, count: 8 },
  { timestamp: 90, count: 35 }, // Major crash spike
  { timestamp: 120, count: 10 },
  { timestamp: 150, count: 3 },
];

export const TRANSCRIPT: TranscriptLine[] = [
  { id: 't1', startTime: 0, endTime: 5, text: '欢迎来到异步课堂。今天我们来讲导数。' },
  { id: 't2', startTime: 5, endTime: 12, text: '首先，我们建立一个坐标系，并画出函数 $f(x) = x^3 - 2x$ 的图像。' },
  { id: 't3', startTime: 12, endTime: 20, text: '大家注意看，这条白色的曲线就是我们的函数。' },
  { id: 't4', startTime: 20, endTime: 30, text: '导数的几何意义，就是曲线上某一点切线的斜率。' },
  { id: 't5', startTime: 30, endTime: 45, text: '很多同学不理解切线是怎么来的。其实它是割线的极限。' },
  { id: 't6', startTime: 45, endTime: 60, text: '我们定义两个点，它们之间的连线就是割线。' },
  { id: 't7', startTime: 60, endTime: 90, text: '现在，让这两个点的距离 $\\Delta x$ 无限接近于 0。观察黄色的线段变化。' },
  { id: 't8', startTime: 90, endTime: 100, text: '当 $\\Delta x \\to 0$ 时，割线就变成了切线。这就是导数的本质：$$\\frac{dy}{dx} = \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}$$' },
  { id: 't9', startTime: 100, endTime: 120, text: '如果这一步没有看懂，请使用左侧的 AI 助手进行提问，或者在代码第 25 行打断点。' },
];