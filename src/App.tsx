/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Resources from './pages/Resources';
import Upload from './pages/Upload';
import Registration from './pages/Registration';
import CommunityGateway from './pages/CommunityGateway';
import CommunityFeed from './pages/CommunityFeed';
import CommunityChat from './pages/CommunityChat';
import FAQ from './pages/FAQ';
import Profile from './pages/Profile';
import { useEffect, ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/register" replace />;
  }
  return <>{children}</>;
}

function CommunityRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const hasJoinedCommunity = localStorage.getItem('community_joined') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/register" replace />;
  }
  
  const { pathname } = useLocation();
  if (!hasJoinedCommunity && pathname !== '/community/gateway') {
    return <Navigate to="/community/gateway" replace />;
  }

  return <>{children}</>;
}

function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isRegistration = location.pathname === '/register';
  const isCommunity = location.pathname.startsWith('/community');

  if (isRegistration || isCommunity) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-gold/30 selection:text-brand-navy">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } 
            />
            <Route path="/register" element={<Registration />} />
            <Route path="/faq" element={<FAQ />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/community/gateway" element={<CommunityGateway />} />
            <Route 
              path="/community/feed" 
              element={
                <CommunityRoute>
                  <CommunityFeed />
                </CommunityRoute>
              } 
            />
            <Route 
              path="/community/chat" 
              element={
                <CommunityRoute>
                  <CommunityChat />
                </CommunityRoute>
              } 
            />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

