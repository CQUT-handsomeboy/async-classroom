# 浮动AI聊天Dock

## 概述

浮动AI聊天Dock是一个仿照FloatingGitDock设计风格的AI助手界面组件，提供了便捷的AI问答功能。

## 功能特点

### 🎯 核心功能
- **浮动按钮**: 右下角蓝色AI按钮，带有脉冲动画效果
- **弹出式聊天界面**: 点击按钮弹出聊天dock
- **实时对话**: 支持与AI助手进行实时问答
- **上下文感知**: 可以传入当前代码/课程内容作为上下文

### 🎨 设计风格
- **一致性设计**: 完全仿照FloatingGitDock的视觉风格
- **简洁白底**: 白色背景，灰色边框，清晰易读
- **响应式布局**: 支持展开/收缩功能
- **优雅动画**: 平滑的过渡动画和交互效果

### 🛠️ 交互功能
- **展开/收缩**: 可在标准尺寸和全屏尺寸间切换
- **清空聊天**: 一键清空聊天记录
- **设置选项**: 预留设置功能入口
- **状态显示**: 实时显示AI在线状态和最后活动时间

## 组件结构

### FloatingAIButton.tsx
```typescript
interface FloatingAIButtonProps {
  onClick: () => void;
}
```
- 固定在右下角的浮动按钮
- 蓝色渐变背景，带有脉冲动画
- 悬停时显示tooltip提示

### FloatingAIDock.tsx
```typescript
interface FloatingAIDockProps {
  isVisible: boolean;
  onClose: () => void;
  contextCode?: string;
}
```
- 主要的聊天界面组件
- 支持传入上下文代码
- 完整的聊天功能实现

## 集成方式

### 1. 在UnifiedWorkspace中集成

```typescript
// 添加状态管理
const [isAIDockVisible, setIsAIDockVisible] = useState(false);

// 添加组件
<FloatingAIDock
  isVisible={isAIDockVisible}
  onClose={() => setIsAIDockVisible(false)}
  contextCode={MOCK_MARKDOWN}
/>

<FloatingAIButton
  onClick={() => setIsAIDockVisible(true)}
/>
```

### 2. 样式要求

确保项目中包含以下CSS类：
```css
.git-dock-clean {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 技术实现

### AI服务集成
- 使用现有的`geminiService`进行AI对话
- 支持上下文传递，提供更准确的回答
- 优雅的错误处理和降级方案

### 状态管理
- 本地状态管理聊天记录
- 支持清空聊天历史
- 实时更新消息计数

### 响应式设计
- 标准尺寸: 70vw × 60vh (最大4xl)
- 展开尺寸: 90vw × 85vh (最大6xl)
- 移动端友好的触摸交互

## 使用场景

### 教育平台
- 学生可以随时询问课程相关问题
- 教师可以获得教学辅助建议
- 代码解释和概念澄清

### 开发环境
- 代码审查和建议
- 技术问题解答
- 最佳实践指导

## 测试

运行测试页面查看效果：
```bash
# 打开测试页面
open test-floating-ai-dock.html
```

测试页面包含：
- 完整的UI演示
- 模拟AI对话功能
- 所有交互功能测试

## 扩展功能

### 计划中的功能
- [ ] 聊天记录持久化
- [ ] 多语言支持
- [ ] 自定义AI模型选择
- [ ] 语音输入/输出
- [ ] 文件上传支持
- [ ] 聊天记录导出

### 自定义选项
- AI助手人格设置
- 界面主题切换
- 快捷回复模板
- 上下文范围配置

## 注意事项

1. **API密钥**: 确保正确配置Gemini API密钥
2. **性能**: 大量聊天记录可能影响性能，建议定期清理
3. **隐私**: 聊天内容仅在本地存储，不会上传到服务器
4. **兼容性**: 需要现代浏览器支持backdrop-filter等CSS特性

## 贡献

欢迎提交Issue和Pull Request来改进这个组件！