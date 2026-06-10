export type Sport = 'MLB' | 'NBA' | 'NFL' | 'NHL' | 'Soccer' | 'Tennis';

export type GameStatus = 'scheduled' | 'live' | 'final' | 'postponed';

export type DateFilter = 'today' | 'tomorrow' | 'week';

export interface Team {
  name: string;
  logo?: string;
  rotationNumber: number;
}

export interface Odds {
  moneyLine: { away: number; home: number };
  total: number;
  overUnder: { over: number; under: number };
  runLine: { away: string; home: string };
  yesNo: { yes: number; no: number };
  srl: { away: number; home: number };
  solo: { away: number; home: number };
}

export interface Game {
  id: string;
  sport: Sport;
  league?: string;
  gameTime: string;
  status: GameStatus;
  awayTeam: Team;
  homeTeam: Team;
  odds: Odds;
  liveScore?: {
    away: number;
    home: number;
  };
}

export interface AdminCredentials {
  username: string;
  password: string;
}
