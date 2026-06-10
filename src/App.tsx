import { Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import PWAInstallPrompt from './components/PWAInstallPrompt';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout onSearch={handleSearch}>
              <Home searchQuery={searchQuery} />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <PWAInstallPrompt />
    </>
  );
}
