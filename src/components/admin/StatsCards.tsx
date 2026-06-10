import { motion } from 'framer-motion';
import { Database, Radio, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import type { Game, Sport } from '@/types/game';

interface StatsCardsProps {
  games: Game[];
}

const SPORT_COLORS: Record<Sport, string> = {
  MLB: '#1A56DB',
  NBA: '#F59E0B',
  NFL: '#22C55E',
  NHL: '#475569',
  Soccer: '#DC2626',
  Tennis: '#7C3AED',
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function StatsCards({ games }: StatsCardsProps) {
  const totalGames = games.length;
  const liveGames = games.filter(g => g.status === 'live').length;
  const today = new Date().toISOString().split('T')[0];
  const todayGames = games.filter(g => g.gameTime.startsWith(today)).length;
  const sportsCount = new Set(games.map(g => g.sport)).size;

  // Sport breakdown data
  const sportCounts: Record<string, number> = {};
  games.forEach(g => {
    sportCounts[g.sport] = (sportCounts[g.sport] || 0) + 1;
  });
  const totalForBar = totalGames || 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Games */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg p-4 transition-all duration-200 hover:-translate-y-0.5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#EBF0FE' }}
          >
            <Database size={20} style={{ color: '#1A56DB' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalGames}</p>
            <p className="text-xs text-gray-500">Total Games</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp size={12} style={{ color: '#22C55E' }} />
          <span className="text-xs" style={{ color: '#22C55E' }}>+3 from yesterday</span>
        </div>
      </motion.div>

      {/* Card 2: Live Games */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg p-4 transition-all duration-200 hover:-translate-y-0.5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(220,38,38,0.08)' }}
          >
            <Radio size={20} style={{ color: '#DC2626' }} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{liveGames}</p>
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#22C55E' }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Live Now</p>
      </motion.div>

      {/* Card 3: Today&apos;s Games */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg p-4 transition-all duration-200 hover:-translate-y-0.5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(34,197,94,0.08)' }}
          >
            <Calendar size={20} style={{ color: '#22C55E' }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{todayGames}</p>
            <p className="text-xs text-gray-500">Scheduled Today</p>
          </div>
        </div>
      </motion.div>

      {/* Card 4: Sports Breakdown */}
      <motion.div
        custom={3}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg p-4 transition-all duration-200 hover:-translate-y-0.5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}
          >
            <BarChart3 size={20} style={{ color: '#F59E0B' }} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{sportsCount} Sports</p>
          </div>
        </div>
        {/* Mini bar */}
        <div className="flex h-1 rounded-full overflow-hidden mt-1" style={{ backgroundColor: '#E2E8F0' }}>
          {(Object.entries(sportCounts) as [string, number][]).map(([sport, count]) => (
            <div
              key={sport}
              className="h-full transition-all"
              style={{
                width: `${(count / totalForBar) * 100}%`,
                backgroundColor: SPORT_COLORS[sport as Sport] || '#94A3B8',
              }}
              title={`${sport}: ${count}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
          {(Object.entries(sportCounts) as [string, number][]).map(([sport, count]) => (
            <span key={sport} className="text-[10px] text-gray-500">
              {sport} ({count})
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
