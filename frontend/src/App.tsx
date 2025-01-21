import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestMainPage from './guestmainpage';
import VocabPage from './vocabpage';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 기본 경로를 게스트 메인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/guest" replace />} />
        {/* 게스트 메인 페이지 라우트 */}
        <Route path="/guest" element={<GuestMainPage />} />
        <Route path="/vocab" element={<VocabPage />} />
      </Routes>
    </Router>
  );
};

export default App;
