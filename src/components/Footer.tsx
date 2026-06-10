import { Link } from 'react-router-dom';
import { LogoIcon } from './icons/SportIcons';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Live Odds', href: '/' },
  { label: 'Scores', href: '#' },
  { label: 'Trends', href: '#' },
  { label: 'Admin', href: '/login' },
];

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ backgroundColor: '#0C1B2E', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-[1440px] mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2">
              <LogoIcon size={24} className="text-blue" />
              <span className="text-white text-lg font-bold">NMV SPORTS</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Live Sports Betting Lines -- MLB, NBA, NFL, NHL, Soccer & Tennis.
            </p>
            <p className="mt-4 text-xs text-gray-500">
              &copy; 2025 NMV SPORTS. All rights reserved.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: '#94A3B8', letterSpacing: '0.05em' }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Info */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: '#94A3B8', letterSpacing: '0.05em' }}
            >
              Info
            </h4>
            <p className="text-sm text-gray-400">Powered by QuickLine</p>
            <p className="mt-1 text-xs text-gray-500">v1.0.0</p>
            <p className="mt-3 text-xs text-gray-500 max-w-[240px]">
              For informational purposes only. Not a gambling site.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
