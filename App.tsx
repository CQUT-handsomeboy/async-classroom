import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UnifiedWorkspace from './pages/UnifiedWorkspace';

const App: React.FC = () => {
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
