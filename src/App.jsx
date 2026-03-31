import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Promote from './pages/Promote';
import './index.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page">Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function SetupRoute() {
  const { user, userData, loading } = useAuth();
  if (loading) return <div className="page">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (userData && userData.hasSetup) return <Navigate to="/dashboard" />;
  return <Setup />;
}

function LayoutWithNav({ children }) {
  return (
    <>
      {children}
      <nav className="bottom-nav">
        <a href="/dashboard" className="nav-item">
          <span className="nav-icon">📊</span>
          <span className="nav-label">Dashboard</span>
        </a>
        <a href="/promote" className="nav-item">
          <span className="nav-icon">🚀</span>
          <span className="nav-label">Promover</span>
        </a>
      </nav>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/setup" element={<SetupRoute />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <LayoutWithNav>
                <Dashboard />
              </LayoutWithNav>
            </PrivateRoute>
          } />
          <Route path="/promote" element={
            <PrivateRoute>
              <LayoutWithNav>
                <Promote />
              </LayoutWithNav>
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}