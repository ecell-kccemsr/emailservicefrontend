import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Templates from "./pages/Templates";
import SendEmail from "./pages/SendEmail";
import EmailLogs from "./pages/EmailLogs";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/common/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Application routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Templates />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/send-email"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SendEmail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/email-logs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EmailLogs />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      404
                    </h1>
                    <p className="text-gray-600 mb-8">Page not found</p>
                    <a
                      href="/dashboard"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
