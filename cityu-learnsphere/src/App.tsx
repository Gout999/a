import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from '@/hooks/useAuth';
import { DocumentProvider } from '@/hooks/useDocuments';
import { AIProvider } from '@/hooks/useAI';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AuthRedirect } from '@/components/auth/auth-redirect';
import { LoginPage } from '@/pages/auth/login-page';
import { RegisterPage } from '@/pages/auth/register-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { DocumentsPage } from '@/pages/dashboard/documents-page';
import { AIAssistantPage } from '@/pages/dashboard/ai-assistant-page';

// Ant Design 主题配置
const theme = {
  token: {
    colorPrimary: '#0066CC',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AuthProvider>
        <DocumentProvider>
          <AIProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* 根路径重定向 */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* 认证相关路由 */}
                <Route 
                  path="/auth/login" 
                  element={
                    <AuthRedirect>
                      <LoginPage />
                    </AuthRedirect>
                  } 
                />
                <Route 
                  path="/auth/register" 
                  element={
                    <AuthRedirect>
                      <RegisterPage />
                    </AuthRedirect>
                  } 
                />
                
                {/* 受保护的路由 */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/documents" 
                  element={
                    <ProtectedRoute>
                      <DocumentsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ai-assistant" 
                  element={
                    <ProtectedRoute>
                      <AIAssistantPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 页面 */}
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                        <p className="text-gray-600 mb-8">页面未找到</p>
                        <a 
                          href="/dashboard" 
                          className="inline-block px-6 py-3 bg-cityu-blue text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          返回首页
                        </a>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </div>
          </Router>
          </AIProvider>
        </DocumentProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;