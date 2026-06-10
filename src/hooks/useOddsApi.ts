import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllSportsOdds, parseApiGames, SPORT_KEYS } from '@/services/oddsApi';
import type { Game } from '@/types/game';

export interface UseOddsApiResult {
  games: Game[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  isUsingFallback: boolean;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useOddsApi(enabled: boolean = true): UseOddsApiResult {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const refreshCount = useRef(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const sportKeys = Object.values(SPORT_KEYS);
      const apiGames = await fetchAllSportsOdds(sportKeys);

      if (apiGames.length === 0) {
        throw new Error('No games returned from API');
      }

      const parsedGames = parseApiGames(apiGames);
      setGames(parsedGames);
      setLastUpdated(new Date());
      setIsUsingFallback(false);

      // Cache in localStorage for offline resilience
      localStorage.setItem('quickline-api-cache', JSON.stringify({
        games: parsedGames,
        timestamp: Date.now(),
      }));
    } catch (err) {
      console.error('API fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch odds');
      setIsUsingFallback(true);

      // Try to load from cache
      const cached = localStorage.getItem('quickline-api-cache');
      if (cached) {
        try {
          const { games: cachedGames } = JSON.parse(cached);
          setGames(cachedGames);
        } catch {
          setGames([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  const refresh = useCallback(() => {
    refreshCount.current += 1;
    fetchData();
  }, [fetchData]);

  return { games, loading, error, lastUpdated, refresh, isUsingFallback };
}
