# 🚀 浮动Git Dock功能

## 概述

浮动Git Dock是一个全新的Git分支可视化功能，取代了传统的侧边栏Git面板。当用户点击左侧边栏的"版本控制"选项卡时，会显示一个漂亮的液态玻璃风格浮动窗口，使用gitgraphjs-react展示Git分支树。

## ✨ 主要特性

### 🎨 视觉设计
- **液态玻璃材质**：采用毛玻璃背景模糊效果
- **渐变边框**：蓝紫色渐变边框和阴影
- **平滑动画**：进入/退出动画和悬浮效果
- **响应式设计**：适配不同屏幕尺寸

### 🔧 功能特性
- **Git分支图**：使用gitgraphjs-react展示美观的分支树
- **搜索功能**：支持按提交信息和作者搜索
- **分支过滤**：可按特定分支过滤显示
- **大小调节**：支持展开/收缩窗口大小
- **实时刷新**：可手动刷新Git状态
- **状态栏**：显示提交统计和图例说明

### 🎯 交互体验
- **点击激活**：点击左侧"版本控制"图标激活
- **背景关闭**：点击背景区域或X按钮关闭
- **键盘支持**：支持ESC键关闭（待实现）
- **拖拽移动**：支持拖拽移动窗口位置（待实现）

## 🏗️ 技术实现

### 核心组件
```typescript
// 主要组件文件
components/FloatingGitDock.tsx    // 浮动Git Dock主组件
pages/UnifiedWorkspace.tsx        // 集成到统一工作空间
liquid-glass.css                  // 液态玻璃样式
```

### 依赖库
- `@gitgraph/react`: Git分支图可视化
- `lucide-react`: 图标库
- `React`: 前端框架

### 样式系统
```css
/* 主要CSS类 */
.floating-git-dock          // 主容器样式
.git-graph-container        // Git图表容器
.git-search-input          // 搜索输入框
.branch-filter             // 分支过滤器
.git-toolbar-button        // 工具栏按钮
.git-status-bar           // 状态栏
```

## 📋 使用说明

### 基本使用
1. 打开应用，进入任意课程页面
2. 点击左侧边栏的"版本控制"图标（GitBranch图标）
3. 浮动Git Dock将在屏幕中央出现
4. 使用各种功能按钮进行交互

### 功能操作
- **搜索提交**：在搜索框中输入关键词
- **过滤分支**：使用下拉菜单选择特定分支
- **调整大小**：点击展开/收缩按钮
- **刷新数据**：点击刷新按钮
- **关闭窗口**：点击X按钮或背景区域

## 🎨 设计亮点

### 液态玻璃效果
```css
background: linear-gradient(
  135deg,
  rgba(15, 23, 42, 0.95) 0%,
  rgba(30, 41, 59, 0.9) 50%,
  rgba(15, 23, 42, 0.95) 100%
);
backdrop-filter: blur(25px);
```

### 动画效果
- **进入动画**：scale + translateY + opacity
- **悬浮效果**：按钮涟漪动画
- **状态指示**：图例脉冲动画
- **过渡动画**：所有交互都有平滑过渡

### 自定义Git主题
```typescript
const customTemplate = templateExtend(TemplateName.Metro, {
  colors: ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316'],
  branch: {
    lineWidth: 2,
    spacing: 40,
    // ... 更多配置
  }
});
```

## 🔄 与原有系统的集成

### 状态管理
```typescript
const [isGitDockVisible, setIsGitDockVisible] = useState(false);

const handleTabChange = (tab: SidebarTab) => {
  if (tab === 'git') {
    setIsGitDockVisible(true);
    setIsPanelOpen(false); // 关闭侧边栏
    return;
  }
  // ... 其他逻辑
};
```

### 数据流
```
COMMITS (constants.ts) 
  ↓
UnifiedWorkspace 
  ↓
FloatingGitDock 
  ↓
Gitgraph (gitgraphjs-react)
```

## 🚀 未来扩展

### 计划功能
- [ ] 键盘快捷键支持
- [ ] 拖拽移动窗口
- [ ] 提交详情查看
- [ ] 分支合并可视化
- [ ] 冲突解决界面
- [ ] 历史回滚功能

### 性能优化
- [ ] 虚拟滚动（大量提交时）
- [ ] 懒加载分支数据
- [ ] 缓存Git状态
- [ ] 防抖搜索

## 🐛 已知问题

1. **大量提交时性能**：超过100个提交时可能有性能问题
2. **移动端适配**：小屏幕设备上的交互体验待优化
3. **浏览器兼容性**：backdrop-filter在某些旧浏览器中不支持

## 📝 更新日志

### v1.0.0 (2024-12-22)
- ✨ 初始版本发布
- 🎨 液态玻璃设计实现
- 🔧 基础功能完成
- 📱 响应式设计支持

## 🤝 贡献指南

如需修改或扩展此功能，请注意：

1. **样式修改**：主要在 `liquid-glass.css` 中添加新样式
2. **功能扩展**：在 `FloatingGitDock.tsx` 中添加新功能
3. **数据结构**：如需修改Git数据，请更新 `types.ts` 中的 `Commit` 接口
4. **测试**：使用 `test-floating-git-dock.html` 进行功能测试

---

*这个功能展示了现代Web应用中如何将复杂的数据可视化与优雅的用户界面设计相结合。*