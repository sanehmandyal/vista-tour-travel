import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WebsiteProvider } from './context/WebsiteContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebsiteProvider>
          <ErrorBoundary>
            <ScrollHandler />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '14px',
                  padding: '12px 18px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                },
                success: {
                  iconTheme: {
                    primary: '#38bdf8',
                    secondary: '#0f172a',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#f87171',
                    secondary: '#0f172a',
                  },
                },
              }}
            />
            <AppRoutes />
          </ErrorBoundary>
        </WebsiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
