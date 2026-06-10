import { useCallback, useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useOddsApi } from './useOddsApi';
import { generateMockGames } from '@/data/mockData';
import type { Game, Sport } from '@/types/game';

const ADMIN_STORAGE_KEY = 'quickline-admin-games';
const USE_API_KEY = 'quickline-use-api';

export function useGames() {
  // Toggle between API and mock data
  const [useApi, setUseApi] = useState(() => {
    const stored = localStorage.getItem(USE_API_KEY);
    return stored ? JSON.parse(stored) : true;
  });

  const { games: apiGames, loading: apiLoading, error: apiError, lastUpdated, refresh: refreshApi, isUsingFallback } = useOddsApi(useApi);

  // Admin overrides stored in localStorage
  const [adminGames, setAdminGames] = useLocalStorage<Game[]>(ADMIN_STORAGE_KEY, []);

  // Keep useApi state in sync with localStorage
  useEffect(() => {
    localStorage.setItem(USE_API_KEY, JSON.stringify(useApi));
  }, [useApi]);

  // Combined games: API data + admin overrides
  const games = useMemo(() => {
    if (!useApi) return adminGames.length > 0 ? adminGames : generateMockGames();

    // If admin has made changes, those override API data for specific games
    if (adminGames.length > 0) {
      const apiMap = new Map(apiGames.map(g => [g.id, g]));
      adminGames.forEach(ag => {
        apiMap.set(ag.id, ag);
      });
      return Array.from(apiMap.values());
    }

    return apiGames.length > 0 ? apiGames : generateMockGames();
  }, [useApi, adminGames, apiGames]);

  const toggleApi = useCallback(() => {
    setUseApi((prev: boolean) => {
      const next = !prev;
      localStorage.setItem(USE_API_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addGame = useCallback((game: Game) => {
    setAdminGames(prev => [...prev, game]);
  }, [setAdminGames]);

  const updateGame = useCallback((id: string, updates: Partial<Game>) => {
    setAdminGames(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, [setAdminGames]);

  const deleteGame = useCallback((id: string) => {
    setAdminGames(prev => prev.filter(g => g.id !== id));
  }, [setAdminGames]);

  const moveGameUp = useCallback((id: string) => {
    setAdminGames(prev => {
      const idx = prev.findIndex(g => g.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return next;
    });
  }, [setAdminGames]);

  const moveGameDown = useCallback((id: string) => {
    setAdminGames(prev => {
      const idx = prev.findIndex(g => g.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, [setAdminGames]);

  const getGamesBySport = useCallback((sport: Sport | 'All') => {
    if (sport === 'All') return games;
    return games.filter(g => g.sport === sport);
  }, [games]);

  const getGameCountBySport = useCallback((sport: Sport | 'All') => {
    return getGamesBySport(sport).length;
  }, [getGamesBySport]);

  const resetToDefault = useCallback(() => {
    setAdminGames([]);
    localStorage.removeItem('quickline-api-cache');
  }, [setAdminGames]);

  return {
    games,
    apiLoading,
    apiError,
    lastUpdated,
    useApi,
    toggleApi,
    isUsingFallback,
    refreshApi,
    setAdminGames,
    addGame,
    updateGame,
    deleteGame,
    moveGameUp,
    moveGameDown,
    getGamesBySport,
    getGameCountBySport,
    resetToDefault,
  };
}
