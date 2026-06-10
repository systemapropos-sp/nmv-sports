import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Game, Sport } from '@/types/game';
import { generateMockGames } from '@/data/mockData';

const STORAGE_KEY = 'quickline-games';

export function useGames() {
  const [games, setGames] = useLocalStorage<Game[]>(STORAGE_KEY, generateMockGames());

  const addGame = useCallback((game: Game) => {
    setGames(prev => [...prev, game]);
  }, [setGames]);

  const updateGame = useCallback((id: string, updates: Partial<Game>) => {
    setGames(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, [setGames]);

  const deleteGame = useCallback((id: string) => {
    setGames(prev => prev.filter(g => g.id !== id));
  }, [setGames]);

  const moveGameUp = useCallback((id: string) => {
    setGames(prev => {
      const idx = prev.findIndex(g => g.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return next;
    });
  }, [setGames]);

  const moveGameDown = useCallback((id: string) => {
    setGames(prev => {
      const idx = prev.findIndex(g => g.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, [setGames]);

  const getGamesBySport = useCallback((sport: Sport | 'All') => {
    if (sport === 'All') return games;
    return games.filter(g => g.sport === sport);
  }, [games]);

  const getGameCountBySport = useCallback((sport: Sport | 'All') => {
    return getGamesBySport(sport).length;
  }, [getGamesBySport]);

  const resetToDefault = useCallback(() => {
    setGames(generateMockGames());
  }, [setGames]);

  return {
    games,
    setGames,
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
