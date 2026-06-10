import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/icons/SportIcons';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const easeSmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeSmooth, delay: 0.15 },
  },
  shake: {
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.4 },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeSmooth, delay },
  },
});

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: easeSmooth, delay: 0.2 },
  },
};

const headerTitle = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeSmooth, delay: 0.25 },
  },
};

const headerSubtitle = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeSmooth, delay: 0.3 },
  },
};

const fieldUsername = fadeUp(0.35);
const fieldPassword = fadeUp(0.4);
const buttonAnim = fadeUp(0.45);
const footerAnim = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, delay: 0.5 } },
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

interface FieldErrors {
  username?: string;
  password?: string;
}

function validateForm(username: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!username.trim()) {
    errors.username = 'Username is required';
  } else if (username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 3) {
    errors.password = 'Password must be at least 3 characters';
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  /* Redirect already-authenticated users */
  useEffect(() => {
    const auth = localStorage.getItem('quickline-admin-auth');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        if (parsed.authenticated && parsed.expires && parsed.expires > Date.now()) {
          navigate('/admin');
        }
      } catch {
        /* invalid JSON, ignore */
      }
    }
  }, [navigate]);

  const triggerShake = useCallback(() => {
    setShakeKey((k) => k + 1);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    /* Client-side validation */
    const errors = validateForm(username, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake();
      return;
    }

    setLoading(true);

    /* Simulate network delay + authentication */
    setTimeout(() => {
      if (username.trim() === 'admin' && password === 'admin123') {
        const authData = {
          authenticated: true,
          user: 'admin',
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };
        localStorage.setItem('quickline-admin-auth', JSON.stringify(authData));

        const redirect = searchParams.get('redirect');
        navigate(redirect || '/admin');
      } else {
        setFormError('Invalid username or password. Please try again.');
        setPassword('');
        triggerShake();
      }
      setLoading(false);
    }, 800);
  };

  const usernameHasError = !!fieldErrors.username;
  const passwordHasError = !!fieldErrors.password;

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#F8FAFC]">
      {/* Subtle diagonal line pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage:
            'repeating-linear-gradient(45deg, #0F172A 0, #0F172A 1px, transparent 0, transparent 20px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* ---- Minimal Header Bar ---- */}
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeSmooth }}
        className="fixed top-0 left-0 right-0 z-50 h-14"
        style={{
          background: 'linear-gradient(180deg, #0C1B2E 0%, #0F2340 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-6">
          {/* Left — Logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity duration-150 hover:opacity-90">
            <LogoIcon size={28} className="text-[#1A56DB]" />
            <span
              className="text-white font-bold tracking-tight"
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                letterSpacing: '-0.02em',
              }}
            >
              NMV SPORTS
            </span>
          </Link>

          {/* Right — Back to Site */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeSmooth, delay: 0.1 }}
          >
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors duration-150 group"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-150 group-hover:-translate-x-0.5"
              />
              <span>Back to Site</span>
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* ---- Main Content: Login Card ---- */}
      <div className="flex-1 flex items-center justify-center px-4 pt-14">
        <motion.div
          key={`card-${shakeKey}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px] relative z-10"
        >
          <Card
            className={cn(
              'w-full border-0 shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)]',
              'rounded-xl overflow-hidden'
            )}
            style={{
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              borderTop: '4px solid #1A56DB',
            }}
          >
            <CardContent className="p-8">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Card Header */}
                <div className="flex flex-col items-center mb-8">
                  {/* Shield Icon */}
                  <motion.div
                    variants={scaleIn}
                    className="w-16 h-16 rounded-full bg-[#EBF0FE] flex items-center justify-center mb-4"
                  >
                    <ShieldCheck
                      size={40}
                      className="text-[#1A56DB]"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    variants={headerTitle}
                    className="text-2xl font-bold text-[#0A0A0A] mb-2"
                    style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}
                  >
                    Admin Access
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    variants={headerSubtitle}
                    className="text-sm text-[#94A3B8]"
                    style={{ fontSize: '0.875rem', lineHeight: 1.5 }}
                  >
                    Enter your credentials to manage games
                  </motion.p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Username Field */}
                  <motion.div variants={fieldUsername}>
                    <Label
                      htmlFor="username"
                      className="block text-[0.6875rem] font-medium uppercase text-[#475569] mb-1.5"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      Username
                    </Label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                      />
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (fieldErrors.username) {
                            setFieldErrors((prev) => ({ ...prev, username: undefined }));
                          }
                        }}
                        placeholder="Enter username"
                        autoComplete="username"
                        className={cn(
                          'h-11 pl-10 pr-3 py-2 text-sm text-[#0A0A0A] placeholder:text-[#94A3B8]',
                          'border rounded-md transition-all duration-150',
                          'focus-visible:ring-[3px] focus-visible:ring-[rgba(26,86,219,0.1)]',
                          usernameHasError
                            ? 'border-[#EF4444] focus-visible:border-[#EF4444] focus-visible:ring-[rgba(239,68,68,0.1)]'
                            : 'border-[#CBD5E1] focus-visible:border-[#1A56DB]'
                        )}
                      />
                    </div>
                    <AnimatePresence>
                      {usernameHasError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs text-[#EF4444] mt-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {fieldErrors.username}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div variants={fieldPassword}>
                    <Label
                      htmlFor="password"
                      className="block text-[0.6875rem] font-medium uppercase text-[#475569] mb-1.5"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                      />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (fieldErrors.password) {
                            setFieldErrors((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                        placeholder="Enter password"
                        autoComplete="current-password"
                        className={cn(
                          'h-11 pl-10 pr-10 py-2 text-sm text-[#0A0A0A] placeholder:text-[#94A3B8]',
                          'border rounded-md transition-all duration-150',
                          'focus-visible:ring-[3px] focus-visible:ring-[rgba(26,86,219,0.1)]',
                          passwordHasError
                            ? 'border-[#EF4444] focus-visible:border-[#EF4444] focus-visible:ring-[rgba(239,68,68,0.1)]'
                            : 'border-[#CBD5E1] focus-visible:border-[#1A56DB]'
                        )}
                      />
                      {/* Show / hide toggle */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors duration-150 focus:outline-none"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {passwordHasError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs text-[#EF4444] mt-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {fieldErrors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Form-level error banner */}
                  <AnimatePresence>
                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: easeSmooth }}
                        className="flex items-start gap-2 px-3 py-2.5 rounded-md border"
                        style={{
                          backgroundColor: 'rgba(239,68,68,0.06)',
                          borderColor: 'rgba(239,68,68,0.2)',
                        }}
                      >
                        <AlertCircle
                          size={16}
                          className="text-[#EF4444] mt-0.5 flex-shrink-0"
                        />
                        <p
                          className="text-[#EF4444] font-medium"
                          style={{ fontSize: '0.8125rem', lineHeight: 1.4 }}
                        >
                          {formError}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sign In Button */}
                  <motion.div variants={buttonAnim}>
                    <Button
                      type="submit"
                      disabled={loading || !username.trim() || !password}
                      className={cn(
                        'w-full h-11 bg-[#1A56DB] text-white text-sm font-semibold rounded-md',
                        'hover:bg-[#1647B3] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(26,86,219,0.25)]',
                        'active:scale-[0.98] active:transition-transform active:duration-100',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
                        'transition-all duration-150'
                      )}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight size={16} className="ml-1" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Demo Credentials Hint */}
                <motion.div
                  variants={fadeUp(0.5)}
                  className="mt-6 text-center"
                >
                  <p
                    className="text-[#94A3B8]"
                    style={{ fontSize: '0.75rem', lineHeight: 1.4 }}
                  >
                    Demo: username{' '}
                    <code
                      className="font-mono text-[#475569] bg-[#F1F5F9] px-1.5 py-0.5 rounded-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      admin
                    </code>{' '}
                    / password{' '}
                    <code
                      className="font-mono text-[#475569] bg-[#F1F5F9] px-1.5 py-0.5 rounded-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      admin123
                    </code>
                  </p>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ---- Minimal Footer ---- */}
      <motion.footer
        variants={footerAnim}
        initial="hidden"
        animate="visible"
        className="py-4 px-6 relative z-10"
      >
        <div className="max-w-[420px] mx-auto flex items-center justify-center gap-2">
          <span className="text-xs font-medium text-[#94A3B8]">NMV SPORTS</span>
          <span className="text-xs text-[#CBD5E1]">&#183;</span>
          <span className="text-xs text-[#94A3B8]">&copy; 2025</span>
          <span className="text-xs text-[#CBD5E1]">&#183;</span>
          <span className="text-xs text-[#94A3B8]">
            For informational purposes only
          </span>
        </div>
      </motion.footer>
    </div>
  );
}
