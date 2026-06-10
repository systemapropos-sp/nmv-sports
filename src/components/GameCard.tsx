import { motion } from 'framer-motion';
import type { Game } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: Game;
  index: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  bestWorstMap: Record<string, { best: string | null; worst: string | null }>;
}

function formatOddsValue(val: number | string): string {
  if (typeof val === 'number') {
    return val > 0 ? `+${val}` : `${val}`;
  }
  return val;
}



function OddsCell({
  value,
  highlightKey,
  bestWorst,
}: {
  value: number | string;
  highlightKey: string;
  bestWorst: { best: string | null; worst: string | null } | null;
}) {
  const isBest = bestWorst?.best === highlightKey;
  const isWorst = bestWorst?.worst === highlightKey;

  return (
    <div
      className={cn(
        'py-2.5 px-3 min-h-[48px] flex items-center justify-end transition-all duration-200',
        isBest && 'border-l-2 border-l-green bg-[rgba(34,197,94,0.06)]',
        isWorst && 'border-l-2 border-l-red bg-[rgba(239,68,68,0.04)]'
      )}
    >
      <div className="flex items-center gap-1">
        {isBest && <span className="w-1.5 h-1.5 rounded-full bg-green" />}
        <span className="text-[0.8125rem] font-semibold tabular-nums text-black">
          {formatOddsValue(value)}
        </span>
      </div>
    </div>
  );
}

export default function GameCard({ game, index, isHovered, onHover, bestWorstMap }: GameCardProps) {
  const isLive = game.status === 'live';
  const isFinal = game.status === 'final';
  const awayId = `${game.id}-away`;
  const homeId = `${game.id}-home`;

  // Get the away team's initial letter
  const awayInitial = game.awayTeam.name.charAt(0).toUpperCase();
  const homeInitial = game.homeTeam.name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.02,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      onMouseEnter={() => onHover(game.id)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer"
      style={{
        border: '1.5px solid #E2E8F0',
        borderRadius: '12px',
        marginBottom: '12px',
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Away Team Row */}
      <div
        className={cn(
          'grid transition-colors duration-150',
          isHovered ? 'bg-[#EBF0FE]' : 'bg-white'
        )}
        style={{ gridTemplateColumns: '200px 70px 90px 90px 90px 90px 90px 90px 90px' }}
      >
        {/* Game Info */}
        <div className="py-2.5 px-3 min-h-[48px] flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-normal">
              {new Date(game.gameTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-live-red text-white text-[0.625rem] font-bold uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-white" />
                </span>
                LIVE
              </span>
            )}
            {isFinal && (
              <span className="text-[0.625rem] text-gray-500 font-medium uppercase">FINAL</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700 flex-shrink-0"
            >
              {awayInitial}
            </span>
            <span className="text-[0.8125rem] font-medium text-black">@{game.awayTeam.name}</span>
          </div>
          {isLive && game.liveScore && (
            <div className="text-xs font-semibold text-live-red mt-0.5">
              {game.awayTeam.name} {game.liveScore.away} - {game.liveScore.home} {game.homeTeam.name}
            </div>
          )}
        </div>

        {/* Rot# */}
        <div className="py-2.5 px-3 min-h-[48px] flex items-center justify-center">
          <span className="text-xs text-gray-500">{game.awayTeam.rotationNumber}</span>
        </div>

        {/* M.L. */}
        <OddsCell
          value={game.odds.moneyLine.away}
          highlightKey={`moneyLine-away-${awayId}`}
          bestWorst={bestWorstMap['moneyLine-away']}
        />

        {/* Total */}
        <div className="py-2.5 px-3 min-h-[48px] flex items-center justify-center">
          <span className="text-[0.8125rem] font-medium tabular-nums">{game.odds.total}</span>
        </div>

        {/* O/U */}
        <OddsCell
          value={game.odds.overUnder.over}
          highlightKey={`overUnder-over-${awayId}`}
          bestWorst={bestWorstMap['overUnder-over']}
        />

        {/* RL */}
        <OddsCell
          value={game.odds.runLine.away}
          highlightKey={`runLine-away-${awayId}`}
          bestWorst={null}
        />

        {/* Y-N */}
        <OddsCell
          value={game.odds.yesNo.yes}
          highlightKey={`yesNo-yes-${awayId}`}
          bestWorst={null}
        />

        {/* SRL */}
        <OddsCell
          value={game.odds.srl.away}
          highlightKey={`srl-away-${awayId}`}
          bestWorst={bestWorstMap['srl-away']}
        />

        {/* Solo */}
        <OddsCell
          value={game.odds.solo.away}
          highlightKey={`solo-away-${awayId}`}
          bestWorst={bestWorstMap['solo-away']}
        />
      </div>

      {/* Home Team Row */}
      <div
        className={cn(
          'grid transition-colors duration-150',
          isHovered ? 'bg-[#EBF0FE]' : 'bg-[#F8FAFC]',
        )}
        style={{
          gridTemplateColumns: '200px 70px 90px 90px 90px 90px 90px 90px 90px',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        {/* Game Info */}
        <div className="py-2.5 px-3 min-h-[48px] flex items-center gap-1.5">
          <span
            className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700 flex-shrink-0"
          >
            {homeInitial}
          </span>
          <span className="text-[0.8125rem] font-medium text-black">{game.homeTeam.name}</span>
        </div>

        {/* Rot# */}
        <div className="py-2.5 px-3 min-h-[48px] flex items-center justify-center">
          <span className="text-xs text-gray-500">{game.homeTeam.rotationNumber}</span>
        </div>

        {/* M.L. */}
        <OddsCell
          value={game.odds.moneyLine.home}
          highlightKey={`moneyLine-home-${homeId}`}
          bestWorst={bestWorstMap['moneyLine-home']}
        />

        {/* Total */}
        <div className="py-2.5 px-3 min-h-[48px] flex items-center justify-center">
          <span className="text-[0.8125rem] font-medium tabular-nums">{game.odds.total}</span>
        </div>

        {/* O/U */}
        <OddsCell
          value={game.odds.overUnder.under}
          highlightKey={`overUnder-under-${homeId}`}
          bestWorst={bestWorstMap['overUnder-under']}
        />

        {/* RL */}
        <OddsCell
          value={game.odds.runLine.home}
          highlightKey={`runLine-home-${homeId}`}
          bestWorst={null}
        />

        {/* Y-N */}
        <OddsCell
          value={game.odds.yesNo.no}
          highlightKey={`yesNo-no-${homeId}`}
          bestWorst={null}
        />

        {/* SRL */}
        <OddsCell
          value={game.odds.srl.home}
          highlightKey={`srl-home-${homeId}`}
          bestWorst={bestWorstMap['srl-home']}
        />

        {/* Solo */}
        <OddsCell
          value={game.odds.solo.home}
          highlightKey={`solo-home-${homeId}`}
          bestWorst={bestWorstMap['solo-home']}
        />
      </div>
    </motion.div>
  );
}
