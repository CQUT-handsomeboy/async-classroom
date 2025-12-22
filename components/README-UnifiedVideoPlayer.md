# UnifiedVideoPlayer 组件

## 概述

`UnifiedVideoPlayer` 是一个统一的视频播放器组件，整合了视频播放功能和 Liquid Glass 风格的控件。它替代了之前分离的 `VideoPlayer` 和 `LiquidGlassVideoControls` 组件，提供了更好的维护性和一致的用户体验。

## 特性

### 🎥 视频播放功能
- 支持标准视频格式播放
- 自动同步播放状态和时间
- 支持全屏播放
- 音量控制

### 🎨 Liquid Glass 设计
- 毛玻璃效果的控制面板
- 渐变进度条带闪光效果
- 悬停时的动态效果
- 脉冲按钮动画

### 🎛️ 高级控制
- 快进/快退 10 秒
- 可拖拽的进度条
- 音量滑块
- 设置和全屏按钮
- 中央播放按钮（暂停时显示）

### 📱 交互体验
- 鼠标悬停显示/隐藏控件
- 点击视频区域播放/暂停
- 平滑的动画过渡
- 响应式设计

## 使用方法

```tsx
import UnifiedVideoPlayer from '../components/UnifiedVideoPlayer';

<UnifiedVideoPlayer
  src="video-url.mp4"
  currentTime={currentTime}
  onTimeUpdate={setCurrentTime}
  isPlaying={isPlaying}
  onPlayPause={setIsPlaying}
  volume={volume}
  onVolumeChange={setVolume}
  className="w-full h-full"
  showAdvancedControls={true}
  onSeek={handleSeek}
/>
```

## Props

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `src` | `string` | ✅ | - | 视频源URL |
| `currentTime` | `number` | ✅ | - | 当前播放时间（秒） |
| `onTimeUpdate` | `(time: number) => void` | ✅ | - | 时间更新回调 |
| `isPlaying` | `boolean` | ✅ | - | 播放状态 |
| `onPlayPause` | `(playing: boolean) => void` | ✅ | - | 播放/暂停回调 |
| `volume` | `number` | ❌ | `0.8` | 音量 (0-1) |
| `onVolumeChange` | `(volume: number) => void` | ❌ | - | 音量变化回调 |
| `className` | `string` | ❌ | `''` | 额外的CSS类名 |
| `showAdvancedControls` | `boolean` | ❌ | `true` | 是否显示高级控制按钮 |
| `onSeek` | `(time: number) => void` | ❌ | - | 跳转时间回调 |

## 样式类

组件使用了以下 Liquid Glass CSS 类：

- `.glass-video-control` - 主控制面板
- `.glass-progress` - 进度条容器
- `.glass-progress-fill` - 进度条填充
- `.glass-button` - 玻璃按钮基础样式
- `.glass-button-pulse` - 脉冲效果按钮
- `.glass-volume-slider` - 音量滑块
- `.center-play-button` - 中央播放按钮
- `.time-display` - 时间显示

## 集成说明

### 学生课堂页面
- 替换了原有的 `<video>` 元素和注释掉的 `LiquidGlassVideoControls`
- 提供完整的播放控制功能
- 支持与转录文本的同步

### 教师工作室页面
- 替换了 `VideoPlayer` 组件
- 保持与 Markdown 编辑器的同步
- 提供实时预览功能

## 维护优势

1. **统一接口**: 两个页面使用相同的组件，减少代码重复
2. **一致体验**: 确保学生和教师界面的播放器行为一致
3. **易于维护**: 只需要维护一个组件而不是多个
4. **功能完整**: 集成了所有必要的播放控制功能
5. **样式统一**: 使用统一的 Liquid Glass 设计语言