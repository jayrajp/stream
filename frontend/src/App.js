
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StreamerDashboard from './pages/StreamerDashboard';
import ViewerPage from './pages/ViewerPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/streamer/:channelId" element={<StreamerDashboard />} />
          <Route path="/viewer/:channelId" element={<ViewerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
