# 编译工具栏 (CompileToolbar)

## 概述

编译工具栏是一个使用 Liquid Glass 风格设计的工具栏组件，位于 Monaco Editor 的上方，提供代码编译功能和状态显示。

## 功能特性

### 主要功能
- **编译按钮**: 触发代码编译过程
- **状态显示**: 实时显示编译状态（空闲/编译中/成功/失败）
- **错误统计**: 显示编译错误和警告数量
- **附加控制**: 输出查看和设置按钮

### 视觉效果
- **Liquid Glass 风格**: 使用半透明玻璃效果和模糊背景
- **动态状态**: 根据编译状态改变颜色和图标
- **悬停效果**: 按钮具有缩放和发光效果
- **加载动画**: 编译时显示旋转加载图标

## 组件接口

```typescript
interface CompileToolbarProps {
  onCompile: () => void;           // 编译回调函数
  isCompiling?: boolean;           // 是否正在编译
  compileStatus?: 'idle' | 'compiling' | 'success' | 'error';  // 编译状态
  errorCount?: number;             // 错误数量
  warningCount?: number;           // 警告数量
}
```

## 使用方式

```tsx
<CompileToolbar
  onCompile={handleCompile}
  isCompiling={isCompiling}
  compileStatus={compileStatus}
  errorCount={errorCount}
  warningCount={warningCount}
/>
```

## 集成位置

工具栏已集成到 `TeacherStudio.tsx` 中，位于：
- Monaco Editor 的上方
- 左侧面板的顶部
- ResizableSplitter 的 leftPanel 内

## 样式类

使用的主要 CSS 类：
- `liquid-glass-dark`: 主容器的玻璃效果
- `glass-button-pulse`: 按钮的脉冲效果
- `glass-button`: 基础玻璃按钮样式

## 状态颜色

- **空闲**: 灰色 (`slate-500/30`)
- **编译中**: 蓝色 (`blue-500/30`) + 旋转动画
- **成功**: 绿色 (`green-500/30`)
- **失败**: 红色 (`red-500/30`)
- **错误指示**: 红色背景 (`red-500/20`)
- **警告指示**: 黄色背景 (`yellow-500/20`)

## 模拟编译逻辑

当前实现包含模拟的编译过程：
- 2秒编译时间
- 30% 概率产生错误
- 50% 概率产生警告
- 随机错误/警告数量

在实际项目中，可以替换为真实的编译服务调用。