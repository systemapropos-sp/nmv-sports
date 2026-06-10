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
  const Icon = sportIcons[sport];

  return (
    <div>
      {/* Sport Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 mb-3 mt-4"
      >
        <span className="text-lg">{sportEmojis[sport]}</span>
        {Icon && <Icon size={18} className="text-[#1A56DB]" />}
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0C1B2E' }}>
          {sport}
        </h2>
        <span className="text-xs text-gray-400 font-medium">
          -- {games.length} {games.length === 1 ? 'Game' : 'Games'}
        </span>
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
