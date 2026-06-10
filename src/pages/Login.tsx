import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate auth check
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('quickline-admin-auth', 'true');
        navigate('/admin');
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4">
      {/* Subtle diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #0C1B2E 0, #0C1B2E 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="w-full max-w-[420px] bg-white rounded-xl shadow-modal p-8 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-blue-light flex items-center justify-center mb-4">
            <Lock size={28} className="text-blue" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your credentials to manage games</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className={`w-full h-11 px-3 py-2 text-sm border rounded-md outline-none transition-all ${
                error ? 'border-red focus:ring-2 focus:ring-red/10' : 'border-gray-300 focus:border-blue focus:ring-2 focus:ring-blue/10'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full h-11 px-3 py-2 pr-10 text-sm border rounded-md outline-none transition-all ${
                  error ? 'border-red focus:ring-2 focus:ring-red/10' : 'border-gray-300 focus:border-blue focus:ring-2 focus:ring-blue/10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red font-medium"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue text-white rounded-md text-sm font-medium hover:bg-blue-hover transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Demo credentials: <span className="font-medium text-gray-500">admin / admin123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
