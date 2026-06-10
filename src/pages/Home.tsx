import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Info,
  QrCode,
  Link as LinkIcon,
  Copy,
  Check,
  RefreshCw,
  Download,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useGames } from '@/hooks/useGames';
import type { Sport, DateFilter, Game } from '@/types/game';
import { cn } from '@/lib/utils';
import {
  MlbIcon,
  NbaIcon,
  NflIcon,
  NhlIcon,
  SoccerIcon,
  TennisIcon,
  TeamLogoPlaceholder,
} from '@/components/icons/SportIcons';

const sports: { key: Sport | 'All'; label: string; Icon: React.FC<{ className?: string; size?: number }> }[] = [
  { key: 'All', label: 'ALL', Icon: LayoutGrid },
  { key: 'MLB', label: 'MLB', Icon: MlbIcon },
  { key: 'NBA', label: 'NBA', Icon: NbaIcon },
  { key: 'NFL', label: 'NFL', Icon: NflIcon },
  { key: 'NHL', label: 'NHL', Icon: NhlIcon },
  { key: 'Soccer', label: 'SOCCER', Icon: SoccerIcon },
  { key: 'Tennis', label: 'TENNIS', Icon: TennisIcon },
];

const dateFilters: { key: DateFilter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'week', label: 'Week' },
];

const tableColumns = [
  { key: 'gameInfo', label: 'GAME', width: '200px', align: 'left' as const },
  { key: 'rot', label: 'ROT#', width: '70px', align: 'center' as const },
  { key: 'ml', label: 'M.L.', width: '90px', align: 'right' as const },
  { key: 'total', label: 'TOTAL', width: '90px', align: 'center' as const },
  { key: 'ou', label: 'O/U', width: '90px', align: 'right' as const },
  { key: 'rl', label: 'RL', width: '90px', align: 'right' as const },
  { key: 'yn', label: 'Y-N', width: '90px', align: 'right' as const },
  { key: 'srl', label: 'SRL', width: '90px', align: 'right' as const },
  { key: 'solo', label: 'SOLO', width: '90px', align: 'right' as const },
];

const columnTooltips: Record<string, string> = {
  ml: 'Money Line — straight win odds',
  ou: 'Over/Under — total points odds',
  rl: 'Run Line — spread odds',
  yn: 'Yes/No — proposition odds',
  srl: 'Secondary Run Line',
  solo: 'Solo odds',
};

function getBestWorstOdds(games: Game[], column: keyof Game['odds'], subKey: string) {
  const values: { id: string; val: number }[] = [];
  games.forEach((g) => {
    const oddsVal = (g.odds as Record<string, unknown>)[column];
    if (oddsVal && typeof oddsVal === 'object' && oddsVal !== null) {
      const sub = (oddsVal as Record<string, unknown>)[subKey];
      if (typeof sub === 'number') {
        values.push({ id: `${g.id}-${subKey}`, val: sub });
      } else if (typeof sub === 'string') {
        const numMatch = sub.match(/-?\d+/);
        if (numMatch) {
          values.push({ id: `${g.id}-${subKey}`, val: parseInt(numMatch[0], 10) });
        }
      }
    }
  });

  if (values.length === 0) return { best: null, worst: null };

  const sorted = [...values].sort((a, b) => {
    if (a.val > 0 && b.val > 0) return b.val - a.val;
    if (a.val < 0 && b.val < 0) return Math.abs(a.val) - Math.abs(b.val);
    return b.val - a.val;
  });

  return { best: sorted[0]?.id ?? null, worst: sorted[sorted.length - 1]?.id ?? null };
}

function formatOddsValue(val: number | string): string {
  if (typeof val === 'number') {
    return val > 0 ? `+${val}` : `${val}`;
  }
  return val;
}

function getNumericValue(val: number | string): number {
  if (typeof val === 'number') return val;
  const match = val.match(/-?\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function Home() {
  const { games, getGameCountBySport } = useGames();
  const [activeSport, setActiveSport] = useState<Sport | 'All'>('All');
  const [activeDate, setActiveDate] = useState<DateFilter>('today');
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);

  // Quick filters
  const [bestOddsOnly, setBestOddsOnly] = useState(false);
  const [hideFinished, setHideFinished] = useState(false);
  const [liveOnly, setLiveOnly] = useState(false);

  // QR Code
  const [qrUrl, setQrUrl] = useState('https://quickline.odds');
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Short link
  const [shortLink, setShortLink] = useState('qln.co/a3x9');
  const [copied, setCopied] = useState(false);

  const filteredGames = useMemo(() => {
    let filtered = activeSport === 'All' ? games : games.filter((g) => g.sport === activeSport);

    if (hideFinished) {
      filtered = filtered.filter((g) => g.status !== 'final');
    }
    if (liveOnly) {
      filtered = filtered.filter((g) => g.status === 'live');
    }

    return filtered;
  }, [games, activeSport, hideFinished, liveOnly]);

  const bestWorstMap = useMemo(() => {
    const map: Record<string, { best: string | null; worst: string | null }> = {};
    if (filteredGames.length === 0) return map;

    const columns = [
      { col: 'moneyLine' as const, keys: ['away', 'home'] },
      { col: 'overUnder' as const, keys: ['over', 'under'] },
      { col: 'srl' as const, keys: ['away', 'home'] },
      { col: 'solo' as const, keys: ['away', 'home'] },
    ];

    columns.forEach(({ col, keys }) => {
      keys.forEach((k) => {
        map[`${col}-${k}`] = getBestWorstOdds(filteredGames, col, k);
      });
    });

    return map;
  }, [filteredGames]);

  const generateShortLink = useCallback(() => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setShortLink(`qln.co/${code}`);
    setCopied(false);
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = shortLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shortLink]);

  const downloadQR = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quickline-qr.png';
    a.click();
  }, []);

  const generateQR = useCallback(() => {
    setQrGenerated(true);
  }, []);

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  const resetFilters = useCallback(() => {
    setBestOddsOnly(false);
    setHideFinished(false);
    setLiveOnly(false);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Sub-Navigation */}
      <div
        className="sticky top-14 z-40 bg-white border-b-2 border-gray-200"
        style={{ borderColor: '#E2E8F0' }}
      >
        <div className="max-w-[1440px] mx-auto px-4">
          {/* Row 1: Sport Tabs */}
          <div className="flex items-center gap-1 h-11 overflow-x-auto scrollbar-hide">
            {sports.map((sport) => {
              const count = getGameCountBySport(sport.key);
              const isActive = activeSport === sport.key;
              return (
                <button
                  key={sport.key}
                  onClick={() => setActiveSport(sport.key)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-150 shrink-0 text-xs font-medium uppercase',
                    isActive
                      ? 'text-white font-semibold shadow-[0_1px_3px_rgba(26,86,219,0.25)]'
                      : 'text-gray-600 bg-gray-100 hover:text-gray-700 hover:bg-gray-200'
                  )}
                  style={
                    isActive
                      ? { background: 'linear-gradient(180deg, #1A56DB 0%, #1647B3 100%)' }
                      : undefined
                  }
                >
                  <sport.Icon size={16} />
                  <span>{sport.label}</span>
                  <span className={cn('text-[0.6875rem] ml-0.5', isActive ? 'text-white/80' : 'text-gray-500')}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Date Tabs + Game Count */}
          <div className="flex items-center justify-between h-11 border-t border-gray-100">
            <div className="flex items-center">
              {dateFilters.map((df) => {
                const isActive = activeDate === df.key;
                return (
                  <button
                    key={df.key}
                    onClick={() => setActiveDate(df.key)}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'text-blue border-b-2 border-blue bg-white'
                        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                    )}
                  >
                    {df.label}
                    {isActive && df.key === 'today' && (
                      <span className="relative flex h-2 w-2 ml-1">
                        <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <span className="text-[0.6875rem] text-gray-400 pr-2">
              Showing {filteredGames.length} games
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Odds Table */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-table overflow-hidden" style={{ minHeight: '400px' }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-200" style={{ height: '40px' }}>
                      {tableColumns.map((col) => (
                        <th
                          key={col.key}
                          className={cn(
                            'py-2 px-3 text-[0.6875rem] font-medium uppercase tracking-wider text-gray-600 whitespace-nowrap',
                            col.align === 'center' && 'text-center',
                            col.align === 'right' && 'text-right',
                            col.align === 'left' && 'text-left'
                          )}
                          style={{ width: col.width, letterSpacing: '0.05em' }}
                        >
                          <div className={cn('flex items-center gap-1', col.align === 'right' && 'justify-end', col.align === 'center' && 'justify-center')}>
                            {col.label}
                            {columnTooltips[col.key] && (
                              <span title={columnTooltips[col.key]} className="cursor-help text-gray-400 hover:text-gray-600">
                                <Info size={12} />
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="wait">
                      {filteredGames.length === 0 ? (
                        <tr key="empty">
                          <td colSpan={9} className="text-center py-16">
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex flex-col items-center gap-3"
                            >
                              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-gray-300">
                                <rect x="25" y="20" width="70" height="80" rx="6" stroke="currentColor" strokeWidth="2" />
                                <path d="M40 40h40M40 55h30M40 70h35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="80" cy="85" r="14" stroke="currentColor" strokeWidth="2" />
                                <path d="M73 85h14M80 78v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              <p className="text-base text-gray-500 font-medium">No games match your filters</p>
                              <p className="text-sm text-gray-400">Try adjusting your sport or date selection</p>
                            </motion.div>
                          </td>
                        </tr>
                      ) : (
                        filteredGames.map((game, idx) => (
                          <GameRows
                            key={game.id}
                            game={game}
                            index={idx}
                            isHovered={hoveredGameId === game.id}
                            onHover={setHoveredGameId}
                            bestWorstMap={bestWorstMap}
                          />
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky" style={{ top: 'calc(56px + 88px + 24px)' }}>
              <div className="flex flex-col gap-4">
                {/* QR Code Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-white rounded-lg shadow-card p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode size={18} className="text-blue" />
                    <h3 className="text-base font-semibold">Share QuickLine</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Scan to view on mobile</p>

                  <label className="block text-[0.6875rem] font-medium text-gray-600 mb-1">Page URL</label>
                  <input
                    type="text"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue focus:ring-2 focus:ring-blue/10 outline-none transition-colors mb-3"
                  />

                  <button
                    onClick={generateQR}
                    className="w-full h-10 bg-blue text-white rounded-md text-sm font-medium hover:bg-blue-hover transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-1.5 mb-3"
                  >
                    <RefreshCw size={14} />
                    {qrGenerated ? 'Regenerate QR Code' : 'Generate QR Code'}
                  </button>

                  <div
                    className={cn(
                      'w-[200px] h-[200px] mx-auto border border-gray-200 rounded-lg bg-white flex items-center justify-center overflow-hidden transition-all duration-300',
                      qrGenerated ? 'opacity-100 scale-100' : 'opacity-50'
                    )}
                  >
                    {qrGenerated ? (
                      <motion.div
                        ref={qrRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <QRCodeCanvas value={qrUrl} size={180} level="M" />
                      </motion.div>
                    ) : (
                      <span className="text-xs text-gray-400">QR code will appear here</span>
                    )}
                  </div>

                  {qrGenerated && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      onClick={downloadQR}
                      className="w-full h-9 mt-3 text-gray-600 bg-gray-100 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-1.5"
                    >
                      <Download size={14} />
                      Download PNG
                    </motion.button>
                  )}
                </motion.div>

                {/* Short Link Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-white rounded-lg shadow-card p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <LinkIcon size={18} className="text-blue" />
                    <h3 className="text-base font-semibold">Short Link</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Quick shareable URL</p>

                  <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 px-3 py-2">
                    <span className="text-sm font-semibold text-blue tabular-nums flex-1">{shortLink}</span>
                    <button
                      onClick={copyToClipboard}
                      className="p-1.5 text-gray-400 hover:text-blue transition-colors"
                      aria-label="Copy link"
                    >
                      {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <button
                    onClick={generateShortLink}
                    className="w-full h-9 mt-3 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-md transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={14} />
                    Generate New Link
                  </button>
                </motion.div>

                {/* Quick Filters Card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="bg-white rounded-lg shadow-card p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <SlidersHorizontal size={18} className="text-blue" />
                    <h3 className="text-base font-semibold">Quick Filters</h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    <ToggleRow
                      label="Best Odds Only"
                      subLabel="Highlight top value"
                      checked={bestOddsOnly}
                      onChange={() => handleToggle(setBestOddsOnly)}
                    />
                    <ToggleRow
                      label="Hide Finished"
                      subLabel="Remove completed games"
                      checked={hideFinished}
                      onChange={() => handleToggle(setHideFinished)}
                    />
                    <ToggleRow
                      label="Live Only"
                      subLabel="In-progress games"
                      checked={liveOnly}
                      onChange={() => handleToggle(setLiveOnly)}
                      showLiveDot
                    />
                  </div>

                  <button
                    onClick={resetFilters}
                    className="mt-3 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-md px-3 py-1.5 transition-all duration-150"
                  >
                    Reset All
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function GameRows({
  game,
  index,
  isHovered,
  onHover,
  bestWorstMap,
}: {
  game: Game;
  index: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  bestWorstMap: Record<string, { best: string | null; worst: string | null }>;
}) {
  const isLive = game.status === 'live';
  const isFinal = game.status === 'final';
  const awayId = `${game.id}-away`;
  const homeId = `${game.id}-home`;

  return (
    <motion.tr
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
    >
      <td colSpan={9} className="p-0">
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
              <TeamLogoPlaceholder teamName={game.awayTeam.name} size={20} />
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
            isString
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
            'grid border-b transition-colors duration-150',
            isHovered ? 'bg-[#EBF0FE]' : 'bg-[#F8FAFC]',
          )}
          style={{
            gridTemplateColumns: '200px 70px 90px 90px 90px 90px 90px 90px 90px',
            borderColor: '#E2E8F0',
          }}
        >
          {/* Game Info */}
          <div className="py-2.5 px-3 min-h-[48px] flex items-center gap-1.5">
            <TeamLogoPlaceholder teamName={game.homeTeam.name} size={20} />
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
            isString
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
      </td>
    </motion.tr>
  );
}

function OddsCell({
  value,
  highlightKey,
  bestWorst,
  isString = false,
}: {
  value: number | string;
  highlightKey: string;
  bestWorst: { best: string | null; worst: string | null } | null;
  isString?: boolean;
}) {
  const isBest = bestWorst?.best === highlightKey;
  const isWorst = bestWorst?.worst === highlightKey;

  return (
    <div
      className={cn(
        'py-2.5 px-3 min-h-[48px] flex items-center justify-end transition-all duration-200',
        isBest && 'border-l-2 border-l-green bg-[rgba(34,197,94,0.06)]',
        isWorst && 'border-l-2 border-l-red bg-[rgba(239,68,68,0.04)]',
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

function ToggleRow({
  label,
  subLabel,
  checked,
  onChange,
  showLiveDot = false,
}: {
  label: string;
  subLabel: string;
  checked: boolean;
  onChange: () => void;
  showLiveDot?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-1.5 min-w-0">
        {showLiveDot && (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green" />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-[0.6875rem] text-gray-400">{subLabel}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={cn(
          'relative shrink-0 inline-flex h-[18px] w-8 items-center rounded-full transition-colors duration-150',
          checked ? 'bg-blue' : 'bg-gray-300'
        )}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-150',
            checked ? 'translate-x-[14px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}
