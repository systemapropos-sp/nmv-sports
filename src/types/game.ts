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
  srl: { away: string; home: string };
  solo: { away: string; home: string };
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

// API response types
export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

export interface ApiMarket {
  key: string;
  outcomes: Outcome[];
}

export interface ApiBookmaker {
  key: string;
  title: string;
  markets: Record<string, ApiMarket>;
}

export interface ApiGame {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: ApiBookmaker[];
}
