import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Channels from './pages/Channels/Channels';
import CreateChannel from './pages/Channels/CreateChannel';
import CreateStream from './pages/Streams/CreateStream';
import Broadcast from './pages/Broadcast/Broadcast';
import ViewerJoin from './pages/Viewer/ViewerJoin';
import WatchStream from './pages/Viewer/WatchStream';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes with layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/viewer" element={<Layout><ViewerJoin /></Layout>} />
          <Route path="/watch/:streamId" element={<Layout><WatchStream /></Layout>} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/channels" element={
            <Layout>
              <ProtectedRoute>
                <Channels />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/channels/create" element={
            <Layout>
              <ProtectedRoute>
                <CreateChannel />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/streams/create" element={
            <Layout>
              <ProtectedRoute>
                <CreateStream />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/broadcast/:streamId" element={
            <Layout>
              <ProtectedRoute>
                <Broadcast />
              </ProtectedRoute>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;