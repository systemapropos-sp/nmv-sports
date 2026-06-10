import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      {/* Spacer for fixed header */}
      <div className="h-14" />
      {/* Hero accent line */}
      <div
        className="h-0.5 w-full flex-shrink-0"
        style={{
          background: 'linear-gradient(90deg, #1A56DB 0%, #22C55E 35%, #F59E0B 70%, #1A56DB 100%)',
        }}
      />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
}
