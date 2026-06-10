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
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const sportIcons: Record<Sport, React.FC<{ className?: string; size?: number }>> = {
  MLB: MlbIcon,
  NBA: NbaIcon,
  NFL: NflIcon,
  NHL: NhlIcon,
  Soccer: SoccerIcon,
  Tennis: TennisIcon,
};

const sportEmojis: Record<Sport, string> = {
  MLB: '\u26BE',
  NBA: '\uD83C\uDFC0',
  NFL: '\uD83C\uDFC8',
  NHL: '\uD83C\uDFD2',
  Soccer: '\u26BD',
  Tennis: '\uD83C\uDFBE',
};

const tableColumns = [
  { key: 'code', label: 'code', width: '70px', align: 'center' as const },
  { key: 'gameInfo', label: 'game', width: '200px', align: 'left' as const },
  { key: 'ml', label: 'ml', width: '90px', align: 'right' as const },
  { key: 'total', label: 'total', width: '90px', align: 'center' as const },
  { key: 'ou', label: 'overUnder', width: '90px', align: 'right' as const },
  { key: 'rl', label: 'rl', width: '90px', align: 'right' as const },
  { key: 'yn', label: 'yn', width: '90px', align: 'right' as const },
  { key: 'srl', label: 'srl', width: '90px', align: 'right' as const },
  { key: 'solo', label: 'solo', width: '90px', align: 'right' as const },
];

const columnTooltips: Record<string, string> = {
  ml: 'Money Line',
  ou: 'Over/Under',
  rl: 'Run Line',
  yn: 'Yes/No',
  srl: 'Secondary Run Line',
  solo: 'Solo',
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
  const { lang, t } = useLanguage();
  const Icon = sportIcons[sport];

  return (
    <div className="mb-2">
      {/* Clean Sport Header */}
      <div className="flex items-center gap-2 px-1 py-2 mb-1">
        <span className="text-base">{sportEmojis[sport]}</span>
        {Icon && <Icon size={18} className="text-gray-500" />}
        <h2 className="text-gray-800 font-bold text-sm">{sport}</h2>
        <span className="text-gray-400 text-xs">
          — {games.length} {lang === 'es' ? (games.length === 1 ? 'juego' : 'juegos') : (games.length === 1 ? 'game' : 'games')}
        </span>
      </div>

      {/* Column headers per sport */}
      <div
        className="grid border-b border-gray-300 bg-gray-200 rounded-t-lg"
        style={{
          gridTemplateColumns: '70px 200px 90px 90px 90px 90px 90px 90px 90px',
        }}
      >
        {tableColumns.map((col) => {
          const colLabel = (t as unknown as Record<string, string>)[col.label] || col.label;
          return (
            <div
              key={col.key}
              className={cn(
                'px-2 py-2 text-gray-800 font-black text-xs uppercase tracking-wider whitespace-nowrap flex items-center',
                col.align === 'center' && 'justify-center',
                col.align === 'right' && 'justify-end',
                col.align === 'left' && 'justify-start'
              )}
            >
              <div className={cn('flex items-center gap-0.5', col.align === 'right' && 'justify-end', col.align === 'center' && 'justify-center')}>
                {colLabel}
                {columnTooltips[col.key] && (
                  <span title={columnTooltips[col.key]} className="cursor-help text-gray-300 hover:text-gray-500">
                    <Info size={10} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

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

      {/* Separator between sports */}
      {showSeparator && (
        <div
          className="my-3"
          style={{
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '2px',
          }}
        />
      )}
    </div>
  );
}
