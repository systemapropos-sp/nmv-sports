import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Menu, X, Search, RefreshCw } from 'lucide-react';
import { LogoIcon } from './icons/SportIcons';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAutoSync } from '@/hooks/useAutoSync';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { lang, t, toggleLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  // Use a no-op refresh callback for auto-sync (refresh handled by consumer)
  const { autoSync, toggleAutoSync } = useAutoSync(() => {
    // Auto-sync refresh is handled by the Home component's useGames hook
    window.dispatchEvent(new CustomEvent('nmv-autosync-refresh'));
  });

  const navLinks = [
    { label: t.liveOdds, href: '/', active: true },
    { label: t.scores, href: '/scores', active: false },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14"
      style={{
        background: 'linear-gradient(180deg, #0C1B2E 0%, #0F2340 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-6">
        {/* Left - Logo */}
        <Link to="/" className="flex items-center gap-2">
          <LogoIcon size={28} className="text-blue" />
          <span
            className="text-white font-bold tracking-tight"
            style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', letterSpacing: '-0.02em' }}
          >
            NMV SPORTS
          </span>
        </Link>

        {/* Center - Search Bar (desktop) */}
        {onSearch && (
          <div className="hidden md:flex flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={t.search}
                className="w-full h-8 pl-8 pr-3 text-xs bg-white/10 border border-white/10 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:bg-white/15 focus:border-white/25 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Center - Nav Links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={cn(
                'px-3 py-4 text-xs font-medium uppercase tracking-wider transition-colors duration-150 relative',
                link.active ? 'text-white' : 'text-gray-400 hover:text-white'
              )}
              style={{ letterSpacing: '0.05em' }}
            >
              {link.label}
              {link.active && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue rounded-t-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right - Admin Link + Language Toggle */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors"
            style={{ letterSpacing: '0.05em' }}
          >
            <span className={lang === 'es' ? 'text-white' : 'text-gray-500'}>ES</span>
            <span className="text-gray-600">|</span>
            <span className={lang === 'en' ? 'text-white' : 'text-gray-500'}>EN</span>
          </button>

          <Link
            to="/login"
            className="hidden md:flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-white transition-colors duration-150"
            style={{ letterSpacing: '0.05em' }}
          >
            <Settings size={16} />
            <span>{t.admin}</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-14 left-0 right-0 py-4 px-6"
          style={{ background: 'linear-gradient(180deg, #0F2340 0%, #0C1B2E 100%)' }}
        >
          {/* Mobile Search */}
          {onSearch && (
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={t.search}
                className="w-full h-9 pl-8 pr-3 text-sm bg-white/10 border border-white/10 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:bg-white/15 focus:border-white/25 transition-colors"
              />
            </div>
          )}

          {/* Language Toggle (mobile) */}
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
            <span className="text-xs text-gray-400 uppercase tracking-wider">{lang === 'es' ? 'Idioma' : 'Language'}</span>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
            >
              <span className={lang === 'es' ? 'text-white' : 'text-gray-500'}>ES</span>
              <span className="text-gray-600">|</span>
              <span className={lang === 'en' ? 'text-white' : 'text-gray-500'}>EN</span>
            </button>
          </div>

          {/* Auto Sync Toggle (mobile) */}
          <button
            onClick={toggleAutoSync}
            className="flex items-center gap-2 w-full py-2 text-xs font-medium uppercase tracking-wider transition-colors mb-2"
          >
            <RefreshCw size={14} className={autoSync ? 'text-green' : 'text-gray-500'} />
            <span className={autoSync ? 'text-green' : 'text-gray-400'}>
              {autoSync ? t.autoSyncOn : t.autoSyncOff}
            </span>
          </button>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  'py-2 text-xs font-medium uppercase tracking-wider transition-colors',
                  link.active ? 'text-white' : 'text-gray-400 hover:text-white'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="flex items-center gap-1.5 py-2 text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Settings size={16} />
              <span>{t.admin}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
