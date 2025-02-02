import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import AuthPage from './components/Auth/AuthPage';
import LoginPage from './components/Auth/LoginPage';
import { AuthProvider } from './context/AuthContext';
import {
  HomeProgress,
  KnowledgeProgress,
  EntertainmentProgress,
  HealthProgress
} from './components/Progress/ProgressPages';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" replace />;
};

const MainLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <div className="flex-1 ml-[250px] p-8">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/progress/home" element={
            <PrivateRoute>
              <MainLayout>
                <HomeProgress />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/progress/knowledge" element={
            <PrivateRoute>
              <MainLayout>
                <KnowledgeProgress />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/progress/entertainment" element={
            <PrivateRoute>
              <MainLayout>
                <EntertainmentProgress />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/progress/health" element={
            <PrivateRoute>
              <MainLayout>
                <HealthProgress />
              </MainLayout>
            </PrivateRoute>
          } />

          {/* Catch all redirect to login page */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
