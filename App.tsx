import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeacherStudio from './pages/TeacherStudio';
import StudentClassroom from './pages/StudentClassroom';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher/:id" element={<TeacherStudio />} />
        <Route path="/student/:id" element={<StudentClassroom />} />
      </Routes>
    </Router>
  );
};

export default App;
