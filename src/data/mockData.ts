import { v4 as uuidv4 } from 'uuid';
import type { Game, Sport } from '@/types/game';

function createGame(
  sport: Sport,
  league: string,
  gameTime: string,
  status: Game['status'],
  awayTeam: string,
  awayRot: number,
  homeTeam: string,
  homeRot: number,
  moneyLineAway: number,
  moneyLineHome: number,
  total: number,
  overOdds: number,
  underOdds: number,
  runLineAway: string,
  runLineHome: string,
  yesNoYes: number,
  yesNoNo: number,
  srlAway: number,
  srlHome: number,
  soloAway: number,
  soloHome: number,
  liveScore?: { away: number; home: number },
): Game {
  return {
    id: uuidv4(),
    sport,
    league,
    gameTime,
    status,
    awayTeam: { name: awayTeam, rotationNumber: awayRot },
    homeTeam: { name: homeTeam, rotationNumber: homeRot },
    odds: {
      moneyLine: { away: moneyLineAway, home: moneyLineHome },
      total,
      overUnder: { over: overOdds, under: underOdds },
      runLine: { away: runLineAway, home: runLineHome },
      yesNo: { yes: yesNoYes, no: yesNoNo },
      srl: { away: srlAway, home: srlHome },
      solo: { away: soloAway, home: soloHome },
    },
    liveScore,
  };
}

export function generateMockGames(): Game[] {
  const games: Game[] = [];

  // MLB Games (14)
  games.push(
    createGame('MLB', 'AL East', '2025-06-11T19:05:00', 'live', 'New York Yankees', 101, 'Boston Red Sox', 102, -155, +135, 8.5, -110, -110, '+1.5 -130', '-1.5 +110', -140, +115, +0.5 -160, '-0.5 +140', -150, +130, { away: 3, home: 2 }),
    createGame('MLB', 'AL West', '2025-06-11T22:10:00', 'live', 'Los Angeles Dodgers', 103, 'San Diego Padres', 104, -180, +155, 7.5, -105, -115, '+1.5 -145', '-1.5 +125', -165, +140, '+0.5 -175', '-0.5 +155', -170, +150, { away: 1, home: 1 }),
    createGame('MLB', 'NL Central', '2025-06-11T13:05:00', 'scheduled', 'Chicago Cubs', 105, 'St. Louis Cardinals', 106, +120, -140, 9, -110, -110, '+1.5 -155', '-1.5 +135', +105, -125, '+0.5 +130', '-0.5 -150', +115, -135),
    createGame('MLB', 'NL East', '2025-06-11T19:10:00', 'scheduled', 'New York Mets', 107, 'Philadelphia Phillies', 108, +145, -170, 8, -105, -115, '+1.5 -130', '-1.5 +110', +135, -160, '+0.5 -140', '-0.5 +120', +140, -165),
    createGame('MLB', 'NL East', '2025-06-11T19:20:00', 'scheduled', 'Atlanta Braves', 109, 'Milwaukee Brewers', 110, -130, +110, 8.5, -110, -110, '-1.5 +115', '+1.5 -135', -120, +100, '-0.5 +120', '+0.5 -140', -125, +105),
    createGame('MLB', 'AL West', '2025-06-11T20:10:00', 'scheduled', 'Houston Astros', 111, 'Texas Rangers', 112, -160, +140, 7.5, -115, -105, '-1.5 -125', '+1.5 +105', -150, +130, '-0.5 -145', '+0.5 +125', -155, +135),
    createGame('MLB', 'AL West', '2025-06-11T22:10:00', 'scheduled', 'Seattle Mariners', 113, 'Los Angeles Angels', 114, +110, -130, 8, -110, -110, '+1.5 -145', '-1.5 +125', +100, -120, '+0.5 -155', '-0.5 +135', +105, -125),
    createGame('MLB', 'NL West', '2025-06-11T16:05:00', 'scheduled', 'San Francisco Giants', 115, 'Oakland Athletics', 116, -145, +125, 8.5, -105, -115, '-1.5 +105', '+1.5 -125', -135, +115, '-0.5 +110', '+0.5 -130', -140, +120),
    createGame('MLB', 'AL Central', '2025-06-11T19:10:00', 'scheduled', 'Minnesota Twins', 117, 'Cleveland Guardians', 118, +125, -150, 9, -110, -110, '+1.5 -140', '-1.5 +120', +115, -140, '+0.5 -135', '-0.5 +115', +120, -145),
    createGame('MLB', 'AL Central', '2025-06-11T18:40:00', 'scheduled', 'Detroit Tigers', 119, 'Tampa Bay Rays', 120, -120, +100, 7.5, -115, -105, '-1.5 +130', '+1.5 -150', -110, -110, '-0.5 -130', '+0.5 +110', -115, -105),
    createGame('MLB', 'AL East', '2025-06-11T19:07:00', 'scheduled', 'Toronto Blue Jays', 121, 'Baltimore Orioles', 122, +135, -160, 8.5, -110, -110, '+1.5 -135', '-1.5 +115', +125, -150, '+0.5 -145', '-0.5 +125', +130, -155),
    createGame('MLB', 'AL Central', '2025-06-11T20:10:00', 'scheduled', 'Kansas City Royals', 123, 'Chicago White Sox', 124, -175, +150, 8, -105, -115, '-1.5 -130', '+1.5 +110', -165, +140, '-0.5 -160', '+0.5 +140', -170, +145),
    createGame('MLB', 'NL West', '2025-06-11T20:40:00', 'scheduled', 'Colorado Rockies', 125, 'Arizona Diamondbacks', 126, +155, -180, 10, -110, -110, '+1.5 -120', '-1.5 +100', +145, -170, '+0.5 -125', '-0.5 +105', +150, -175),
    createGame('MLB', 'NL Central', '2025-06-11T18:35:00', 'scheduled', 'Cincinnati Reds', 127, 'Pittsburgh Pirates', 128, -110, -110, 8.5, -110, -110, '-1.5 +150', '+1.5 -175', -105, -115, '-0.5 +120', '+0.5 -140', -110, -110),
  );

  // NBA Games (6)
  games.push(
    createGame('NBA', 'Eastern', '2025-06-11T19:00:00', 'live', 'Boston Celtics', 201, 'Brooklyn Nets', 202, -220, +185, 224.5, -110, -110, '+5.5 -110', '-5.5 -110', -200, +170, '+3.5 -125', '-3.5 +105', -210, +180, { away: 67, home: 62 }),
    createGame('NBA', 'Western', '2025-06-11T22:00:00', 'scheduled', 'Los Angeles Lakers', 203, 'Golden State Warriors', 204, -150, +130, 232, -105, -115, '-3.5 -110', '+3.5 -110', -140, +120, '-2.5 -115', '+2.5 -105', -145, +125),
    createGame('NBA', 'Eastern', '2025-06-11T19:30:00', 'scheduled', 'Milwaukee Bucks', 205, 'Miami Heat', 206, +110, -130, 218.5, -110, -110, '+2.5 -110', '-2.5 -110', +100, -120, '+1.5 -135', '-1.5 +115', +105, -125),
    createGame('NBA', 'Western', '2025-06-11T21:00:00', 'scheduled', 'Phoenix Suns', 207, 'Denver Nuggets', 208, +135, -160, 228.5, -115, -105, '+3.5 -105', '-3.5 -115', +125, -150, '+2.5 -125', '-2.5 +105', +130, -155),
    createGame('NBA', 'Eastern', '2025-06-11T20:00:00', 'scheduled', 'Philadelphia 76ers', 209, 'New York Knicks', 210, -125, +105, 221, -110, -110, '-2.5 -110', '+2.5 -110', -115, -105, '-1.5 -120', '+1.5 +100', -120, +100),
    createGame('NBA', 'Western', '2025-06-11T22:30:00', 'scheduled', 'Dallas Mavericks', 211, 'Minnesota Timberwolves', 212, +160, -190, 226, -110, -110, '+4.5 -110', '-4.5 -110', +150, -180, '+3.5 -125', '-3.5 +105', +155, -185),
  );

  // NFL Games (8)
  games.push(
    createGame('NFL', 'AFC', '2025-06-15T13:00:00', 'scheduled', 'Kansas City Chiefs', 301, 'Buffalo Bills', 302, -180, +155, 48.5, -110, -110, '-3.5 -115', '+3.5 -105', -170, +145, '-2.5 -125', '+2.5 +105', -175, +150),
    createGame('NFL', 'NFC', '2025-06-15T16:25:00', 'scheduled', 'Philadelphia Eagles', 303, 'Dallas Cowboys', 304, +120, -140, 45.5, -105, -115, '+2.5 -110', '-2.5 -110', +110, -130, '+1.5 -135', '-1.5 +115', +115, -135),
    createGame('NFL', 'NFC', '2025-06-15T13:00:00', 'scheduled', 'San Francisco 49ers', 305, 'Baltimore Ravens', 306, -135, +115, 47, -110, -110, '-2.5 -105', '+2.5 -115', -125, +105, '-1.5 -115', '+1.5 -105', -130, +110),
    createGame('NFL', 'AFC', '2025-06-15T20:20:00', 'scheduled', 'Cincinnati Bengals', 307, 'Miami Dolphins', 308, +145, -170, 50.5, -115, -105, '+3.5 -105', '-3.5 -115', +135, -160, '+2.5 -120', '-2.5 +100', +140, -165),
    createGame('NFL', 'AFC', '2025-06-15T13:00:00', 'scheduled', 'New York Jets', 309, 'Green Bay Packers', 310, -110, -110, 44, -110, -110, '-1.5 -105', '+1.5 -115', -105, -115, '-0.5 -120', '+0.5 +100', -110, -110),
    createGame('NFL', 'NFC', '2025-06-15T16:00:00', 'scheduled', 'Minnesota Vikings', 311, 'Detroit Lions', 312, +155, -180, 49, -110, -110, '+3.5 -115', '-3.5 -105', +145, -170, '+2.5 -130', '-2.5 +110', +150, -175),
    createGame('NFL', 'NFC', '2025-06-15T13:00:00', 'scheduled', 'Tampa Bay Buccaneers', 313, 'New Orleans Saints', 314, -125, +105, 42.5, -105, -115, '-2.5 +100', '+2.5 -120', -115, -105, '-1.5 +105', '+1.5 -125', -120, +100),
    createGame('NFL', 'AFC', '2025-06-16T20:15:00', 'scheduled', 'Pittsburgh Steelers', 315, 'Cleveland Browns', 316, -145, +125, 41.5, -110, -110, '-3.5 +105', '+3.5 -125', -135, +115, '-2.5 -105', '+2.5 -115', -140, +120),
  );

  // NHL Games (4)
  games.push(
    createGame('NHL', 'Metro', '2025-06-11T19:00:00', 'scheduled', 'New York Rangers', 401, 'Boston Bruins', 402, +115, -135, 5.5, -115, -105, '+1.5 -185', '-1.5 +160', +105, -125, '+0.5 -155', '-0.5 +135', +110, -130),
    createGame('NHL', 'Atlantic', '2025-06-11T19:00:00', 'live', 'Toronto Maple Leafs', 403, 'Montreal Canadiens', 404, -165, +140, 6, -105, -115, '-1.5 +130', '+1.5 -150', -155, +130, '-0.5 -145', '+0.5 +125', -160, +135, { away: 2, home: 1 }),
    createGame('NHL', 'Atlantic', '2025-06-11T19:00:00', 'scheduled', 'Tampa Bay Lightning', 405, 'Florida Panthers', 406, +125, -150, 5.5, -110, -110, '+1.5 -165', '-1.5 +145', +115, -140, '+0.5 -140', '-0.5 +120', +120, -145),
    createGame('NHL', 'Central', '2025-06-11T21:00:00', 'scheduled', 'Colorado Avalanche', 407, 'Vegas Golden Knights', 408, -140, +120, 6, -110, -110, '-1.5 +155', '+1.5 -180', -130, +110, '-0.5 +115', '+0.5 -135', -135, +115),
  );

  // Soccer Games (6)
  games.push(
    createGame('Soccer', 'Premier League', '2025-06-11T15:00:00', 'scheduled', 'Arsenal', 501, 'Manchester City', 502, +185, -145, 2.5, -120, -110, '+0.5 -135', '-0.5 +115', +175, -140, '+0.25 -150', '-0.25 +130', +180, -150),
    createGame('Soccer', 'Premier League', '2025-06-11T12:30:00', 'live', 'Liverpool', 503, 'Chelsea', 504, -125, +105, 3, -110, -110, '-0.5 +115', '+0.5 -135', -115, -105, '-0.25 +120', '+0.25 -140', -120, +100, { away: 1, home: 0 }),
    createGame('Soccer', 'La Liga', '2025-06-11T16:00:00', 'scheduled', 'Real Madrid', 505, 'Barcelona', 506, +110, -130, 2.5, -115, -105, '+0.25 -125', '-0.25 +105', +100, -120, '+0.5 -140', '-0.5 +120', +105, -125),
    createGame('Soccer', 'Serie A', '2025-06-11T14:45:00', 'scheduled', 'Juventus', 507, 'Inter Milan', 508, +135, -165, 2.5, -110, -110, '+0.5 -115', '-0.5 -105', +125, -155, '+0.25 -130', '-0.25 +110', +130, -160),
    createGame('Soccer', 'Bundesliga', '2025-06-11T14:30:00', 'scheduled', 'Bayern Munich', 509, 'Borussia Dortmund', 510, -200, +165, 3.5, -105, -115, '-1.5 +115', '+1.5 -135', -190, +155, '-1.25 +125', '+1.25 -145', -195, +160),
    createGame('Soccer', 'Ligue 1', '2025-06-11T15:00:00', 'scheduled', 'Paris Saint-Germain', 511, 'Olympique Lyon', 512, -250, +200, 3, -110, -110, '-1.5 -105', '+1.5 -115', -240, +195, '-1.25 -110', '+1.25 -110', -245, +205),
  );

  // Tennis Games (4)
  games.push(
    createGame('Tennis', 'ATP', '2025-06-11T11:00:00', 'scheduled', 'Carlos Alcaraz', 601, 'Jannik Sinner', 602, -135, +115, 22.5, -110, -110, '-2.5 -105', '+2.5 -115', -125, +105, '-1.5 -125', '+1.5 +105', -130, +110),
    createGame('Tennis', 'ATP', '2025-06-11T14:00:00', 'live', 'Novak Djokovic', 603, 'Daniil Medvedev', 604, -155, +130, 24.5, -115, -105, '-3.5 +110', '+3.5 -130', -145, +120, '-2.5 +105', '+2.5 -125', -150, +125, { away: 6, home: 4 }),
    createGame('Tennis', 'WTA', '2025-06-11T10:00:00', 'scheduled', 'Iga Swiatek', 605, 'Aryna Sabalenka', 606, +105, -125, 21.5, -110, -110, '+1.5 -135', '-1.5 +115', +100, -120, '+0.5 -125', '-0.5 +105', -110, -110),
    createGame('Tennis', 'WTA', '2025-06-11T13:00:00', 'scheduled', 'Coco Gauff', 607, 'Elena Rybakina', 608, -120, +100, 23, -105, -115, '-1.5 +120', '+1.5 -140', -110, -110, '-0.5 +115', '+0.5 -135', -115, +105),
  );

  return games;
}
