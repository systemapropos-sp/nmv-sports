import { motion } from 'framer-motion';
import type { Game, Sport } from '@/types/game';
import GameCard from './GameCard';
import {
  MlbIcon,
  NbaIcon,
  NflIcon,
  NhlIcon,
  SoccerIcon,
  TennisIcon,
} from '@/components/icons/SportIcons';
import { useLanguage } from '@/i18n/LanguageContext';

const sportIcons: Record<Sport, React.FC<{ className?: string; size?: number }>> = {
  MLB: MlbIcon,
  NBA: NbaIcon,
  NFL: NflIcon,
  NHL: NhlIcon,
  Soccer: SoccerIcon,
  Tennis: TennisIcon,
};

const sportEmojis: Record<Sport, string> = {
  MLB: '⚾',
  NBA: '🏀',
  NFL: '🏈',
  NHL: '🏒',
  Soccer: '⚽',
  Tennis: '🎾',
};

const sportFullNames: Record<Sport, string> = {
  MLB: 'Major League Baseball',
  NBA: 'National Basketball Association',
  NFL: 'National Football League',
  NHL: 'National Hockey League',
  Soccer: 'Fútbol Internacional',
  Tennis: 'ATP Tennis',
};

interface SportSectionProps {
  sport: Sport;
  games: Game[];
  bestWorstMap: Record<string, { best: string | null; worst: string | null }>;
  hoveredGameId: string | null;
  onHover: (id: string | null) => void;
  showSeparator: boolean;
  startIndex: number;
}

export default function SportSection({
  sport,
  games,
  bestWorstMap,
  hoveredGameId,
  onHover,
  showSeparator,
  startIndex,
}: SportSectionProps) {
  const { lang } = useLanguage();
  const Icon = sportIcons[sport];

  return (
    <div className="mb-4">
      {/* Premium Sport Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-[10px] mb-4"
        style={{
          background: 'linear-gradient(90deg, #0C1B2E 0%, #1A56DB 100%)',
          padding: '14px 20px',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left: Icon + Sport name + subtitle */}
          <div className="flex items-center gap-3">
            {/* Sport icon circle */}
            <div
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-lg flex-shrink-0"
              style={{ fontSize: '14px' }}
            >
              {sportEmojis[sport]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-[1.1rem] leading-tight">
                  {sport}
                </h2>
                {/* Game count badge */}
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500 text-[#0C1B2E] text-xs font-bold">
                  {games.length} {lang === 'es' ? (games.length === 1 ? 'juego activo' : 'juegos activos') : (games.length === 1 ? 'Active Game' : 'Active Games')}
                </span>
              </div>
              <p className="text-white/60 text-xs mt-0.5">
                {sportFullNames[sport]}
              </p>
            </div>
          </div>

          {/* Right: Sport icon component */}
          {Icon && <Icon size={28} className="text-white/80 flex-shrink-0" />}
        </div>

        {/* Subtle gradient separator line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #f59e0b 30%, #f59e0b 70%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* Game Cards */}
      {games.map((game, idx) => (
        <GameCard
          key={game.id}
          game={game}
          index={startIndex + idx}
          isHovered={hoveredGameId === game.id}
          onHover={onHover}
          bestWorstMap={bestWorstMap}
        />
      ))}

      {/* Thick separator between sports (only in "All" view) */}
      {showSeparator && (
        <div
          className="my-4"
          style={{
            height: '6px',
            background: '#0C1B2E',
            borderRadius: '3px',
            margin: '16px 0',
          }}
        />
      )}
    </div>
  );
}
