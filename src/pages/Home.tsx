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
  Settings,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useGames } from '@/hooks/useGames';
import type { Sport, DateFilter, Game } from '@/types/game';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  MlbIcon,
  NbaIcon,
  NflIcon,
  NhlIcon,
  SoccerIcon,
  TennisIcon,
} from '@/components/icons/SportIcons';
import SportSelector, { getFavoriteSports, saveFavoriteSports } from '@/components/SportSelector';
import SportSection from '@/components/SportSection';
import GameCard from '@/components/GameCard';

const SPORT_ORDER: Sport[] = ['MLB', 'NBA', 'NFL', 'NHL', 'Soccer', 'Tennis'];

const dateFiltersKeys: DateFilter[] = ['today', 'tomorrow', 'week'];

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
  ml: 'Money Line -- straight win odds',
  ou: 'Over/Under -- total points odds',
  rl: 'Run Line -- spread odds',
  yn: 'Yes/No -- proposition odds',
  srl: 'Secondary Run Line',
  solo: 'Solo odds',
};

function getBestWorstOdds(games: Game[], column: keyof Game['odds'], subKey: string) {
  const values: { id: string; val: number }[] = [];
  games.forEach((g) => {
    const oddsVal = (g.odds as unknown as Record<string, unknown>)[column];
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

interface HomeProps {
  searchQuery?: string;
}

export default function Home({ searchQuery = '' }: HomeProps) {
  const { lang, t } = useLanguage();
  const { games, getGameCountBySport } = useGames();
  const [activeSport, setActiveSport] = useState<Sport | 'All' | 'My Sports'>('All');
  const [activeDate, setActiveDate] = useState<DateFilter>('today');
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);

  // Favorite sports
  const [favoriteSports, setFavoriteSports] = useState<Sport[]>(() => getFavoriteSports());
  const [sportSelectorOpen, setSportSelectorOpen] = useState(false);

  // Quick filters
  const [bestOddsOnly, setBestOddsOnly] = useState(false);
  const [hideFinished, setHideFinished] = useState(false);
  const [liveOnly, setLiveOnly] = useState(false);

  // QR Code
  const [qrUrl, setQrUrl] = useState('https://nmvsports.odds');
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Short link
  const [shortLink, setShortLink] = useState('nmv.co/a3x9');
  const [copied, setCopied] = useState(false);

  // Save favorite sports to localStorage whenever they change
  useEffect(() => {
    saveFavoriteSports(favoriteSports);
  }, [favoriteSports]);

  const filteredGames = useMemo(() => {
    let filtered = [...games];

    // Sport filter
    if (activeSport === 'My Sports') {
      filtered = filtered.filter((g) => favoriteSports.includes(g.sport));
    } else if (activeSport !== 'All') {
      filtered = filtered.filter((g) => g.sport === activeSport);
    }

    // Search filter (by team name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.awayTeam.name.toLowerCase().includes(q) ||
          g.homeTeam.name.toLowerCase().includes(q)
      );
    }

    if (hideFinished) {
      filtered = filtered.filter((g) => g.status !== 'final');
    }
    if (liveOnly) {
      filtered = filtered.filter((g) => g.status === 'live');
    }

    return filtered;
  }, [games, activeSport, favoriteSports, searchQuery, hideFinished, liveOnly]);

  // Group games by sport for "All" and "My Sports" views
  const groupedGames = useMemo(() => {
    if (activeSport !== 'All' && activeSport !== 'My Sports') {
      // Single sport view -- no grouping needed
      return null;
    }

    const groups: { sport: Sport; games: Game[] }[] = [];
    const sportsToShow = activeSport === 'My Sports' ? favoriteSports : SPORT_ORDER;

    sportsToShow.forEach((sport) => {
      const sportGames = filteredGames.filter((g) => g.sport === sport);
      if (sportGames.length > 0) {
        groups.push({ sport, games: sportGames });
      }
    });

    return groups;
  }, [filteredGames, activeSport, favoriteSports]);

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
    setShortLink(`nmv.co/${code}`);
    setCopied(false);
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
    a.download = 'nmv-sports-qr.png';
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

  const handleFavoriteChange = (sports: Sport[]) => {
    setFavoriteSports(sports);
  };

  // Get display count for a sport tab
  const getTabCount = (key: Sport | 'All' | 'My Sports') => {
    if (key === 'All') return games.length;
    if (key === 'My Sports') return games.filter((g) => favoriteSports.includes(g.sport)).length;
    return getGameCountBySport(key);
  };

  // Date filter labels with i18n
  const getDateLabel = (key: DateFilter) => {
    switch (key) {
      case 'today': return t.today;
      case 'tomorrow': return t.tomorrow;
      case 'week': return t.week;
      default: return key;
    }
  };

  // Build sports array with dynamic labels
  const sportsTabs: { key: Sport | 'All' | 'My Sports'; label: string; Icon: React.FC<{ className?: string; size?: number }> }[] = [
    { key: 'All', label: t.all, Icon: LayoutGrid },
    { key: 'My Sports', label: t.mySports, Icon: LayoutGrid },
    { key: 'MLB', label: 'MLB', Icon: MlbIcon },
    { key: 'NBA', label: 'NBA', Icon: NbaIcon },
    { key: 'NFL', label: 'NFL', Icon: NflIcon },
    { key: 'NHL', label: 'NHL', Icon: NhlIcon },
    { key: 'Soccer', label: 'SOCCER', Icon: SoccerIcon },
    { key: 'Tennis', label: 'TENNIS', Icon: TennisIcon },
  ];

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
            {sportsTabs.map((sport) => {
              const count = getTabCount(sport.key);
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

            {/* Settings icon for sport selector */}
            <button
              onClick={() => setSportSelectorOpen(true)}
              className="ml-1 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
              title={t.selectSports}
              aria-label={t.selectSports}
            >
              <Settings size={16} />
            </button>
          </div>

          {/* Row 2: Date Tabs + Game Count */}
          <div className="flex items-center justify-between h-11 border-t border-gray-100">
            <div className="flex items-center">
              {dateFiltersKeys.map((dfKey) => {
                const isActive = activeDate === dfKey;
                return (
                  <button
                    key={dfKey}
                    onClick={() => setActiveDate(dfKey)}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-xs font-medium transition-all duration-150',
                      isActive
                        ? 'text-blue border-b-2 border-blue bg-white'
                        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                    )}
                  >
                    {getDateLabel(dfKey)}
                    {isActive && dfKey === 'today' && (
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
              {filteredGames.length} {lang === 'es' ? 'juegos' : 'games'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Odds Table / Cards */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-table overflow-hidden" style={{ minHeight: '400px' }}>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Game content - each sport section has its own column headers */}
                  <AnimatePresence mode="wait">
                    {filteredGames.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-3 py-16"
                      >
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-gray-300">
                          <rect x="25" y="20" width="70" height="80" rx="6" stroke="currentColor" strokeWidth="2" />
                          <path d="M40 40h40M40 55h30M40 70h35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="80" cy="85" r="14" stroke="currentColor" strokeWidth="2" />
                          <path d="M73 85h14M80 78v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p className="text-base text-gray-500 font-medium">{t.noGamesFound}</p>
                      </motion.div>
                    ) : (
                      <div className="p-2">
                        {groupedGames && (activeSport === 'All' || activeSport === 'My Sports') ? (
                          // Grouped by sport view
                          groupedGames.map((group, groupIdx) => (
                            <SportSection
                              key={group.sport}
                              sport={group.sport}
                              games={group.games}
                              bestWorstMap={bestWorstMap}
                              hoveredGameId={hoveredGameId}
                              onHover={setHoveredGameId}
                              showSeparator={activeSport === 'All' && groupIdx < groupedGames.length - 1}
                              startIndex={groupedGames.slice(0, groupIdx).reduce((acc, g) => acc + g.games.length, 0)}
                            />
                          ))
                        ) : (
                          // Single sport view -- column header + cards
                          <>
                            {/* Column headers for single sport */}
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
                            {filteredGames.map((game, idx) => (
                              <GameCard
                                key={game.id}
                                game={game}
                                index={idx}
                                isHovered={hoveredGameId === game.id}
                                onHover={setHoveredGameId}
                                bestWorstMap={bestWorstMap}
                              />
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
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
                    <h3 className="text-base font-semibold">{t.share}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{t.qrCode}</p>

                  <label className="block text-[0.6875rem] font-medium text-gray-600 mb-1">URL</label>
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
                    {qrGenerated ? t.refresh : t.generate}
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
                      <span className="text-xs text-gray-400">{t.qrCode}</span>
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
                      PNG
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
                    <h3 className="text-base font-semibold">{t.shortLink}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{t.shortLink}</p>

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
                    {t.generate}
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
                    <h3 className="text-base font-semibold">{t.odds}</h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    <ToggleRow
                      label={t.showBestOdds}
                      checked={bestOddsOnly}
                      onChange={() => handleToggle(setBestOddsOnly)}
                    />
                    <ToggleRow
                      label={t.hideFinished}
                      checked={hideFinished}
                      onChange={() => handleToggle(setHideFinished)}
                    />
                    <ToggleRow
                      label={t.showLiveOnly}
                      checked={liveOnly}
                      onChange={() => handleToggle(setLiveOnly)}
                      showLiveDot
                    />
                  </div>

                  <button
                    onClick={resetFilters}
                    className="mt-3 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-md px-3 py-1.5 transition-all duration-150"
                  >
                    {t.cancel}
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sport Selector Modal */}
      <SportSelector
        open={sportSelectorOpen}
        onClose={() => setSportSelectorOpen(false)}
        selected={favoriteSports}
        onChange={handleFavoriteChange}
      />
    </div>
  );
}

/* ─── Sub-components ─── */

function ToggleRow({
  label,
  checked,
  onChange,
  showLiveDot = false,
}: {
  label: string;
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
