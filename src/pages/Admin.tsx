import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('quickline-admin-auth') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <Shield size={20} className="text-blue" />
          <h1 className="text-base font-semibold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-card p-8"
        >
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-blue-light flex items-center justify-center mb-4">
              <Shield size={32} className="text-blue" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h2>
            <p className="text-sm text-gray-500 text-center max-w-md mb-6">
              The admin panel will be implemented here with full CRUD operations for managing games.
              This stub is in place for the page agent to complete.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('quickline-admin-auth');
                navigate('/login');
              }}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
