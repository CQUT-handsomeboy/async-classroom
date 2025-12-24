import React,{useEffect} from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UnifiedWorkspace from './pages/UnifiedWorkspace';
import { CONFIG } from './constants';

const App: React.FC = () => {
  useEffect(() => {
    // 测试视频服务器连接
    const testVideoServer = async () => {
      const videoServerUrl = CONFIG.VIDEO_SERVER_URL;
      
      try {
        console.log('正在测试视频服务器连接:', videoServerUrl);
        const response = await fetch(videoServerUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          console.log('✅ 视频服务器连接成功:', response.status);
          const data = await response.text();
          console.log('服务器响应:', data);
        } else {
          console.warn('⚠️ 视频服务器响应异常:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ 视频服务器连接失败:', error);
      }
    };

    testVideoServer();
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace/:id" element={<UnifiedWorkspace />} />
        {/* 保持向后兼容 */}
        <Route path="/teacher/:id" element={<UnifiedWorkspace />} />
        <Route path="/student/:id" element={<UnifiedWorkspace />} />
      </Routes>
    </Router>
  );
};

export default App;
