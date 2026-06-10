// API service for The Odds API (https://the-odds-api.com/)
import type { ApiGame, Game, Outcome, Sport, GameStatus } from '@/types/game';

const API_KEY = '2e8540ac64be25785e2e664858da7807';
const BASE_URL = 'https://api.the-odds-api.com/v4';

// Sport key mapping: our Sport type -> API sport keys
export const SPORT_KEYS: Record<string, string> = {
  MLB: 'baseball_mlb',
  NBA: 'basketball_nba',
  NFL: 'americanfootball_nfl',
  NHL: 'icehockey_nhl',
  Soccer: 'soccer_epl',
  Tennis: 'tennis_atp_french_open',
};

// Reverse mapping
export const KEY_TO_SPORT: Record<string, string> = {
  baseball_mlb: 'MLB',
  basketball_nba: 'NBA',
  americanfootball_nfl: 'NFL',
  americanfootball_ncaaf: 'NFL',
  icehockey_nhl: 'NHL',
  soccer_epl: 'Soccer',
  soccer_usa_mls: 'Soccer',
  tennis_atp_french_open: 'Tennis',
  tennis_wta_french_open: 'Tennis',
};

export interface FetchOddsOptions {
  sport: string;
  markets?: string;
  regions?: string;
  oddsFormat?: string;
  dateFormat?: string;
}

export async function fetchOdds(options: FetchOddsOptions) {
  const { sport, markets = 'h2h,spreads,totals', regions = 'us', oddsFormat = 'american', dateFormat = 'iso' } = options;

  const url = new URL(`${BASE_URL}/sports/${sport}/odds`);
  url.searchParams.set('apiKey', API_KEY);
  url.searchParams.set('regions', regions);
  url.searchParams.set('markets', markets);
  url.searchParams.set('oddsFormat', oddsFormat);
  url.searchParams.set('dateFormat', dateFormat);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as ApiGame[];
}

export async function fetchAllSportsOdds(sports: string[]) {
  const results = await Promise.allSettled(
    sports.map(sport => fetchOdds({ sport }))
  );

  const allGames: ApiGame[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      // Add sport_key to each game if not present
      result.value.forEach((game: ApiGame) => {
        if (!game.sport_key) game.sport_key = sports[index];
      });
      allGames.push(...result.value);
    } else {
      console.error(`Failed to fetch odds for ${sports[index]}:`, result.reason);
    }
  });

  return allGames;
}

// Parse API response and convert to our Game format
export function parseApiGames(apiGames: ApiGame[]): Game[] {
  return apiGames.map((apiGame, index) => {
    const sportKey = apiGame.sport_key || '';
    const sport = (KEY_TO_SPORT[sportKey] || 'MLB') as Sport;

    // Get the first bookmaker's odds (or aggregate)
    const bookmaker = apiGame.bookmakers?.[0];
    const h2hMarket = bookmaker?.markets?.h2h || bookmaker?.markets?.['h2h'];
    const spreadsMarket = bookmaker?.markets?.spreads || bookmaker?.markets?.['spreads'];
    const totalsMarket = bookmaker?.markets?.totals || bookmaker?.markets?.['totals'];

    // Extract moneyline odds
    let moneyLineAway = -110;
    let moneyLineHome = -110;
    if (h2hMarket?.outcomes) {
      h2hMarket.outcomes.forEach((outcome: Outcome) => {
        if (outcome.name === apiGame.away_team) moneyLineAway = outcome.price;
        if (outcome.name === apiGame.home_team) moneyLineHome = outcome.price;
      });
    }

    // Extract spread (run line / point spread)
    let runLineAway = '+1.5 -110';
    let runLineHome = '-1.5 -110';
    if (spreadsMarket?.outcomes) {
      const awayOutcome = spreadsMarket.outcomes.find((o: Outcome) => o.name === apiGame.away_team);
      const homeOutcome = spreadsMarket.outcomes.find((o: Outcome) => o.name === apiGame.home_team);
      if (awayOutcome) {
        const point = awayOutcome.point !== undefined ? (awayOutcome.point > 0 ? `+${awayOutcome.point}` : `${awayOutcome.point}`) : '+1.5';
        const price = awayOutcome.price > 0 ? `+${awayOutcome.price}` : `${awayOutcome.price}`;
        runLineAway = `${point} ${price}`;
      }
      if (homeOutcome) {
        const point = homeOutcome.point !== undefined ? (homeOutcome.point > 0 ? `+${homeOutcome.point}` : `${homeOutcome.point}`) : '-1.5';
        const price = homeOutcome.price > 0 ? `+${homeOutcome.price}` : `${homeOutcome.price}`;
        runLineHome = `${point} ${price}`;
      }
    }

    // Extract totals (over/under)
    let total = 8.5;
    let overOdds = -110;
    let underOdds = -110;
    if (totalsMarket?.outcomes) {
      const overOutcome = totalsMarket.outcomes.find((o: Outcome) => o.name === 'Over');
      const underOutcome = totalsMarket.outcomes.find((o: Outcome) => o.name === 'Under');
      if (overOutcome) {
        total = overOutcome.point || 8.5;
        overOdds = overOutcome.price;
      }
      if (underOutcome) {
        underOdds = underOutcome.price;
      }
    }

    // Determine status based on commence time
    const now = new Date();
    const gameTime = new Date(apiGame.commence_time);
    let status: GameStatus = 'scheduled';
    if (gameTime <= now) status = 'live';

    return {
      id: apiGame.id || `api-${sport}-${index}`,
      sport,
      league: getLeagueForSport(sport),
      gameTime: apiGame.commence_time || new Date().toISOString(),
      status,
      awayTeam: {
        name: apiGame.away_team || 'Away Team',
        rotationNumber: 100 + index * 2,
      },
      homeTeam: {
        name: apiGame.home_team || 'Home Team',
        rotationNumber: 101 + index * 2,
      },
      odds: {
        moneyLine: { away: moneyLineAway, home: moneyLineHome },
        total,
        overUnder: { over: overOdds, under: underOdds },
        runLine: { away: runLineAway, home: runLineHome },
        yesNo: { yes: Math.round(moneyLineAway * 0.8), no: Math.round(moneyLineHome * 0.8) },
        srl: {
          away: runLineAway.replace(/[\d.+-]+\s/, (match: string) => match.replace(/\s.*/, ' +0.5 ') + (moneyLineAway > 0 ? Math.round(moneyLineAway * 0.6) : Math.round(moneyLineAway * 1.2))),
          home: runLineHome.replace(/[\d.+-]+\s/, (match: string) => match.replace(/\s.*/, ' -0.5 ') + (moneyLineHome > 0 ? Math.round(moneyLineHome * 0.6) : Math.round(moneyLineHome * 1.2)))
        },
        solo: { away: String(total), home: String(total) },
      },
    };
  });
}

function getLeagueForSport(sport: Sport): string {
  switch (sport) {
    case 'MLB': return 'MLB';
    case 'NBA': return 'NBA';
    case 'NFL': return 'NFL';
    case 'NHL': return 'NHL';
    case 'Soccer': return 'Premier League';
    case 'Tennis': return 'ATP';
    default: return '';
  }
}
