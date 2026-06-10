import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  RefreshCw,
  Inbox,
  Download,
  ChevronRight as ChevronRightIcon,
  Shield,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Layout from '@/components/Layout';
import { useGames } from '@/hooks/useGames';
import type { Game, Sport, GameStatus } from '@/types/game';
import { useLanguage } from '@/i18n/LanguageContext';
import StatsCards from '@/components/admin/StatsCards';
import GameModal from '@/components/admin/GameModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

const SPORTS: (Sport | 'All')[] = ['All', 'MLB', 'NBA', 'NFL', 'NHL', 'Soccer', 'Tennis'];
const PAGE_SIZE = 10;

const statusBadgeStyle = (s: GameStatus) => {
  switch (s) {
    case 'scheduled':
      return { backgroundColor: '#E2E8F0', color: '#475569' };
    case 'live':
      return { backgroundColor: '#DC2626', color: '#FFFFFF' };
    case 'final':
      return { backgroundColor: '#1E293B', color: '#FFFFFF' };
    case 'postponed':
      return { backgroundColor: 'rgba(245,158,11,0.15)', color: '#D97706' };
    default:
      return { backgroundColor: '#E2E8F0', color: '#475569' };
  }
};

const sportBadgeStyle = (sport: Sport) => {
  const styles: Record<Sport, { bg: string; color: string }> = {
    MLB: { bg: 'rgba(26,86,219,0.1)', color: '#1A56DB' },
    NBA: { bg: 'rgba(245,158,11,0.1)', color: '#D97706' },
    NFL: { bg: 'rgba(34,197,94,0.1)', color: '#16A34A' },
    NHL: { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
    Soccer: { bg: 'rgba(239,68,68,0.1)', color: '#DC2626' },
    Tennis: { bg: 'rgba(139,92,246,0.1)', color: '#7C3AED' },
  };
  return styles[sport] || { bg: '#F1F5F9', color: '#475569' };
};

export default function Admin() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isAuthenticated = localStorage.getItem('quickline-admin-auth') === 'true';

  const {
    games,
    addGame,
    updateGame,
    deleteGame,
    moveGameUp,
    moveGameDown,
    resetToDefault,
  } = useGames();

  // Route guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Local state
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState<'All' | Sport>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGame, setEditGame] = useState<Game | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Game | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Status filters with i18n labels
  const STATUS_FILTERS: { value: string; label: string }[] = [
    { value: 'All', label: t.all },
    { value: t.scheduled, label: t.scheduled },
    { value: t.live, label: t.live },
    { value: t.final, label: t.final },
    { value: t.postponed, label: t.postponed },
  ];

  // Sort options with i18n
  const SORT_OPTIONS: { value: string; label: string }[] = [
    { value: 'date', label: t.time },
    { value: 'sport', label: t.sport },
    { value: 'status', label: t.status },
    { value: 'team', label: t.team },
  ];

  // Status label helper using i18n
  const getStatusLabel = (s: GameStatus): string => {
    switch (s) {
      case 'scheduled': return t.scheduled;
      case 'live': return t.live;
      case 'final': return t.final;
      case 'postponed': return t.postponed;
      default: return s;
    }
  };

  // Filtered & sorted games
  const filteredGames = useMemo(() => {
    let list = [...games];

    // Sport filter
    if (sportFilter !== 'All') {
      list = list.filter(g => g.sport === sportFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      list = list.filter(g => getStatusLabel(g.status) === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        g =>
          g.awayTeam.name.toLowerCase().includes(q) ||
          g.homeTeam.name.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.gameTime).getTime() - new Date(b.gameTime).getTime();
        case 'sport':
          return a.sport.localeCompare(b.sport);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'team':
          return a.awayTeam.name.localeCompare(b.awayTeam.name);
        default:
          return 0;
      }
    });

    return list;
  }, [games, sportFilter, statusFilter, search, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedGames = filteredGames.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sportFilter, statusFilter, search, sortBy]);

  // Handlers
  const handleAdd = () => {
    setEditGame(null);
    setModalOpen(true);
  };

  const handleEdit = (game: Game) => {
    setEditGame(game);
    setModalOpen(true);
  };

  const handleSaveGame = (game: Game) => {
    if (editGame) {
      updateGame(game.id, game);
      toast.success(lang === 'es' ? 'Juego actualizado' : 'Game updated successfully');
    } else {
      addGame(game);
      toast.success(lang === 'es' ? 'Juego agregado' : 'Game added successfully');
    }
  };

  const handleDeleteClick = (game: Game) => {
    setDeleteTarget(game);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    // Small delay for visual feedback
    setTimeout(() => {
      deleteGame(deleteTarget.id);
      toast.success(lang === 'es' ? 'Juego eliminado' : 'Game deleted');
      setDeletingId(null);
      setDeleteTarget(null);
    }, 250);
  };

  const handleMoveUp = (id: string) => {
    moveGameUp(id);
    toast.success(lang === 'es' ? 'Juego movido arriba' : 'Game moved up');
  };

  const handleMoveDown = (id: string) => {
    moveGameDown(id);
    toast.success(lang === 'es' ? 'Juego movido abajo' : 'Game moved down');
  };

  const handleSignOut = () => {
    localStorage.removeItem('quickline-admin-auth');
    toast.success(lang === 'es' ? 'Sesión cerrada' : 'Logged out successfully');
    navigate('/login');
  };

  const handleExportCSV = () => {
    const headers = [
      'ID', 'Sport', 'League', 'Game Time', 'Status',
      'Away Team', 'Away Rot#', 'Home Team', 'Home Rot#',
      'ML Away', 'ML Home', 'Total', 'O/U Over', 'O/U Under',
      'RL Away', 'RL Home', 'Y-N Yes', 'Y-N No',
      'SRL Away', 'SRL Home', 'Solo Away', 'Solo Home',
    ];
    const rows = filteredGames.map(g => [
      g.id,
      g.sport,
      g.league || '',
      g.gameTime,
      g.status,
      g.awayTeam.name,
      g.awayTeam.rotationNumber,
      g.homeTeam.name,
      g.homeTeam.rotationNumber,
      g.odds.moneyLine.away,
      g.odds.moneyLine.home,
      g.odds.total,
      g.odds.overUnder.over,
      g.odds.overUnder.under,
      g.odds.runLine.away,
      g.odds.runLine.home,
      g.odds.yesNo.yes,
      g.odds.yesNo.no,
      g.odds.srl.away,
      g.odds.srl.home,
      g.odds.solo.away,
      g.odds.solo.home,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nmv-sports-games-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(lang === 'es' ? 'CSV exportado' : 'CSV exported');
  };

  const formatGameTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const globalIndex = (pageIdx: number) => (safePage - 1) * PAGE_SIZE + pageIdx + 1;

  if (!isAuthenticated) return null;

  return (
    <Layout>
      {/* Admin header variant */}
      <div className="bg-[#0C1B2E] h-14 flex items-center px-6" style={{ background: 'linear-gradient(180deg, #0C1B2E 0%, #0F2340 100%)' }}>
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-[#1A56DB]" />
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">NMV SPORTS</span>
              <ChevronRightIcon size={12} className="text-gray-500" />
              <span className="text-gray-300 text-sm font-medium">{t.dashboard}</span>
            </div>
            <span
              className="text-[10px] font-bold uppercase ml-1 px-1.5 py-0.5 rounded"
              style={{ color: '#1A56DB', border: '1px solid #1A56DB' }}
            >
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefault}
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5"
              title={t.refresh}
            >
              <RefreshCw size={16} />
            </button>
            <div className="w-px h-5 bg-white/15" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1A56DB] flex items-center justify-center text-white text-xs font-semibold">
                A
              </div>
              <span className="text-gray-300 text-xs">Admin</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-medium p-1.5 rounded-md hover:bg-white/5"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-xl font-semibold text-gray-900">{t.dashboard}</h1>
            <p className="text-xs text-gray-400 -mt-0.5">NMV SPORTS - {t.liveOdds}</p>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              onClick={handleAdd}
              className="text-white hover:opacity-90 active:scale-[0.97] transition-all"
              style={{ backgroundColor: '#1A56DB' }}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">{t.addGame}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 active:scale-[0.97] transition-all"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </Button>
            <button
              onClick={resetToDefault}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title={t.refresh}
            >
              <RefreshCw size={16} />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Stats Cards */}
        <StatsCards games={games} />

        {/* Toolbar */}
        <div className="mt-6 bg-white border border-gray-200 rounded-t-lg px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {/* Sort dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-[160px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sport filter */}
              <Select value={sportFilter} onValueChange={v => setSportFilter(v as 'All' | Sport)}>
                <SelectTrigger className="h-9 w-[140px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map(s => (
                    <SelectItem key={s} value={s}>{s === 'All' ? t.all : s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[130px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                placeholder={t.searchTeams}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 pl-9 w-full sm:w-[240px] text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-lg overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <th className="py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 w-[50px]">#</th>
                  <th className="py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 w-[80px]">{t.sport}</th>
                  <th className="py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 w-[160px]">{t.time}</th>
                  <th className="py-2 px-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 min-w-[240px]">{t.team}</th>
                  <th className="py-2 px-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600 w-[100px]">{t.ml}</th>
                  <th className="py-2 px-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600 w-[70px]">{t.total}</th>
                  <th className="py-2 px-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600 w-[90px]">{t.overUnder}</th>
                  <th className="py-2 px-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600 w-[100px]">{t.status}</th>
                  <th className="py-2 px-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600 w-[140px]">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {paginatedGames.map((game, idx) => {
                    const sStyle = sportBadgeStyle(game.sport);
                    const stStyle = statusBadgeStyle(game.status);
                    const isEven = idx % 2 === 1;
                    const isDeleting = deletingId === game.id;

                    return (
                      <motion.tr
                        key={game.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: isDeleting ? 0 : 1, x: isDeleting ? -100 : 0, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: isDeleting ? 0.25 : 0.2, delay: isDeleting ? 0 : idx * 0.015 }}
                        className="transition-colors"
                        style={{
                          backgroundColor: isEven ? '#F8FAFC' : '#FFFFFF',
                          borderBottom: '1px solid #E2E8F0',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#EBF0FE';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = isEven ? '#F8FAFC' : '#FFFFFF';
                        }}
                      >
                        <td className="py-2 px-3 text-xs text-gray-500">{globalIndex(idx)}</td>
                        <td className="py-2 px-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                            style={{ backgroundColor: sStyle.bg, color: sStyle.color }}
                          >
                            {game.sport}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-900 whitespace-nowrap">
                          {formatGameTime(game.gameTime)}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600 flex-shrink-0">
                              {game.awayTeam.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900 truncate max-w-[100px]">
                              {game.awayTeam.name}
                            </span>
                            <span className="text-gray-400 mx-0.5">@</span>
                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600 flex-shrink-0">
                              {game.homeTeam.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900 truncate max-w-[100px]">
                              {game.homeTeam.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-xs text-right tabular-nums">
                          <div>{game.odds.moneyLine.away}</div>
                          <div>{game.odds.moneyLine.home}</div>
                        </td>
                        <td className="py-2 px-3 text-sm text-center tabular-nums">{game.odds.total}</td>
                        <td className="py-2 px-3 text-xs text-right tabular-nums">
                          <div>O: {game.odds.overUnder.over}</div>
                          <div>U: {game.odds.overUnder.under}</div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                            style={stStyle}
                          >
                            {game.status === 'live' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                            {getStatusLabel(game.status)}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEdit(game)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-[#1A56DB] hover:bg-gray-100 transition-colors"
                              title={t.editGame}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleMoveUp(game.id)}
                              disabled={(safePage - 1) * PAGE_SIZE + idx === 0}
                              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
                              title="Move up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              onClick={() => handleMoveDown(game.id)}
                              disabled={(safePage - 1) * PAGE_SIZE + idx === games.length - 1}
                              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
                              title="Move down"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(game)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title={t.deleteGame}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="md:hidden">
            <AnimatePresence mode="popLayout">
              {paginatedGames.map((game, idx) => {
                const sStyle = sportBadgeStyle(game.sport);
                const stStyle = statusBadgeStyle(game.status);
                const isDeleting = deletingId === game.id;

                return (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: isDeleting ? 0 : 1, x: isDeleting ? -100 : 0, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: isDeleting ? 0.25 : 0.2 }}
                    className="border-b border-gray-200 px-4 py-3"
                    style={{ backgroundColor: idx % 2 === 1 ? '#F8FAFC' : '#FFFFFF' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{ backgroundColor: sStyle.bg, color: sStyle.color }}
                        >
                          {game.sport}
                        </span>
                        <span className="text-xs text-gray-500">{formatGameTime(game.gameTime)}</span>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                        style={stStyle}
                      >
                        {game.status === 'live' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                        {getStatusLabel(game.status)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {game.awayTeam.name} @ {game.homeTeam.name}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        M.L. {game.odds.moneyLine.away} / {game.odds.moneyLine.home}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(game)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-[#1A56DB] hover:bg-gray-100 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(game)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                              <MoreVertical size={14} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMoveUp(game.id)}>
                              <ArrowUp size={14} className="mr-2" /> Move Up
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoveDown(game.id)}>
                              <ArrowDown size={14} className="mr-2" /> Move Down
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {paginatedGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Inbox size={48} className="text-gray-300 mb-4" />
              <p className="text-base font-medium text-gray-500">{t.noGamesFound}</p>
              <Button
                className="mt-4"
                style={{ backgroundColor: '#1A56DB' }}
                onClick={handleAdd}
              >
                <Plus size={16} className="mr-1" />
                {t.addGame}
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredGames.length > PAGE_SIZE && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-500">
              {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filteredGames.length)} / {filteredGames.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[32px] h-8 px-2 rounded-md text-xs font-medium transition-colors"
                  style={
                    page === safePage
                      ? { backgroundColor: '#1A56DB', color: '#FFFFFF' }
                      : { backgroundColor: '#F1F5F9', color: '#475569' }
                  }
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Game Modal */}
      <GameModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditGame(null); }}
        editGame={editGame}
        onSave={handleSaveGame}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
        awayTeam={deleteTarget?.awayTeam?.name || ''}
        homeTeam={deleteTarget?.homeTeam?.name || ''}
      />
    </Layout>
  );
}
