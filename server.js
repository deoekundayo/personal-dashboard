const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;
const REQUEST_TIMEOUT_MS = 7000;
const CACHE_TTL_MS = 45 * 1000;
const ESPN_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (compatible; Dashboard/1.0)'
};
const responseCache = new Map();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static('.'));

function getCachedValue(key) {
  const cached = responseCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return cached.value;
}

function setCachedValue(key, value) {
  responseCache.set(key, { timestamp: Date.now(), value });
}

async function fetchJsonWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: ESPN_HEADERS,
      signal: controller.signal
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.log(`Fetch failed for ${url}:`, error.message);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getNbaStatsData() {
  console.log('Fetching NBA stats...');
  const espnData = await fetchJsonWithTimeout('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
  const playerStats = [];

  if (espnData?.events?.length) {
    const recentGames = espnData.events.slice(0, 5);
    const finishedGames = recentGames.filter((event) => {
      const competition = event.competitions?.[0];
      if (!competition) return false;
      return competition.status?.type?.state === 'post';
    });

    const detailedGameStats = await Promise.all(
      finishedGames.map(async (event) => {
        const competition = event.competitions?.[0];
        const competitors = competition?.competitors;
        if (!competitors || competitors.length < 2) return [];

        const homeTeam = competitors.find((c) => c.homeAway === 'home');
        const awayTeam = competitors.find((c) => c.homeAway === 'away');
        if (!homeTeam || !awayTeam) return [];

        const gameData = await fetchJsonWithTimeout(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard/${event.id}`);
        if (!gameData?.boxscore?.players) return [];

        const topPerformers = [];
        for (const team of gameData.boxscore.players) {
          const stats = team.statistics?.[0];
          if (!stats?.athletes) continue;

          for (const athlete of stats.athletes.slice(0, 2)) {
            if (!athlete.athlete || !athlete.stats) continue;

            const points = parseInt(athlete.stats[0] || 0, 10);
            if (points <= 0) continue;

            topPerformers.push({
              name: athlete.athlete.displayName || 'Unknown Player',
              team: team.team ? team.team.abbreviation : 'UNK',
              points,
              rebounds: parseInt(athlete.stats[1] || 0, 10),
              assists: parseInt(athlete.stats[2] || 0, 10),
              game: `${awayTeam.team.abbreviation} @ ${homeTeam.team.abbreviation}`,
              league: 'NBA',
              gameId: event.id,
              isLive: false
            });
          }
        }

        topPerformers.sort((a, b) => b.points - a.points);
        return topPerformers.slice(0, 2);
      })
    );

    detailedGameStats.forEach((stats) => playerStats.push(...stats));
  }

  return {
    success: true,
    data: playerStats,
    source: 'espn',
    hasLiveGames: false
  };
}

async function getNflStatsData() {
  console.log('Fetching NFL stats...');
  const espnData = await fetchJsonWithTimeout('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
  const playerStats = [];

  if (espnData?.events?.length) {
    const recentGames = espnData.events.slice(0, 5);
    const finishedGames = recentGames.filter((event) => {
      const competition = event.competitions?.[0];
      if (!competition) return false;
      return competition.status?.type?.state === 'post';
    });

    const detailedGameStats = await Promise.all(
      finishedGames.map(async (event) => {
        const competition = event.competitions?.[0];
        const competitors = competition?.competitors;
        if (!competitors || competitors.length < 2) return [];

        const homeTeam = competitors.find((c) => c.homeAway === 'home');
        const awayTeam = competitors.find((c) => c.homeAway === 'away');
        if (!homeTeam || !awayTeam) return [];

        const gameData = await fetchJsonWithTimeout(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard/${event.id}`);
        const leaders = gameData?.competitions?.[0]?.leaders;
        if (!leaders?.length) return [];

        const topPerformers = [];
        for (const category of leaders) {
          if (!category.leaders?.length) continue;
          const topLeaders = category.leaders.slice(0, 2);

          for (const leader of topLeaders) {
            if (!leader.athlete || !leader.displayValue) continue;

            let teamAbbr = 'UNK';
            if (leader.team?.id) {
              const competitor = competitors.find((c) => c.team.id === leader.team.id);
              if (competitor) teamAbbr = competitor.team.abbreviation;
            }

            let stats = {};
            if (category.name === 'passingYards') {
              const match = leader.displayValue.match(/(\d+)\/(\d+),\s*(\d+)\s*YDS,\s*(\d+)\s*TD(?:,\s*(\d+)\s*INT)?/);
              if (match) {
                stats = {
                  name: leader.athlete.displayName || 'Unknown Player',
                  team: teamAbbr,
                  passingYards: parseInt(match[3], 10),
                  passingTDs: parseInt(match[4], 10),
                  passingINTs: parseInt(match[5] || 0, 10),
                  completions: parseInt(match[1], 10),
                  attempts: parseInt(match[2], 10),
                  game: `${awayTeam.team.abbreviation} @ ${homeTeam.team.abbreviation}`,
                  league: 'NFL',
                  isLive: false,
                  gameId: event.id
                };
              }
            } else if (category.name === 'rushingYards') {
              const match = leader.displayValue.match(/(\d+)\s*CAR,\s*(\d+)\s*YDS(?:,\s*(\d+)\s*TD)?/);
              if (match) {
                stats = {
                  name: leader.athlete.displayName || 'Unknown Player',
                  team: teamAbbr,
                  rushingYards: parseInt(match[2], 10),
                  rushingTDs: parseInt(match[3] || 0, 10),
                  rushingAttempts: parseInt(match[1], 10),
                  game: `${awayTeam.team.abbreviation} @ ${homeTeam.team.abbreviation}`,
                  league: 'NFL',
                  isLive: false,
                  gameId: event.id
                };
              }
            } else if (category.name === 'receivingYards') {
              const match = leader.displayValue.match(/(\d+)\s*REC,\s*(\d+)\s*YDS(?:,\s*(\d+)\s*TD)?/);
              if (match) {
                stats = {
                  name: leader.athlete.displayName || 'Unknown Player',
                  team: teamAbbr,
                  receivingYards: parseInt(match[2], 10),
                  receivingTDs: parseInt(match[3] || 0, 10),
                  receivingCatches: parseInt(match[1], 10),
                  game: `${awayTeam.team.abbreviation} @ ${homeTeam.team.abbreviation}`,
                  league: 'NFL',
                  isLive: false,
                  gameId: event.id
                };
              }
            }

            if (Object.keys(stats).length > 0) {
              topPerformers.push(stats);
            }
          }
        }

        topPerformers.sort((a, b) => {
          const aYards = a.passingYards || a.rushingYards || a.receivingYards || 0;
          const bYards = b.passingYards || b.rushingYards || b.receivingYards || 0;
          return bYards - aYards;
        });
        return topPerformers.slice(0, 4);
      })
    );

    detailedGameStats.forEach((stats) => playerStats.push(...stats));
  }

  return {
    success: true,
    data: playerStats,
    source: 'espn',
    hasLiveGames: false
  };
}

// NBA player stats endpoint
app.get('/api/nba-stats', async (req, res) => {
  try {
    const cached = getCachedValue('nba-stats');
    if (cached) return res.json(cached);

    const response = await getNbaStatsData();
    setCachedValue('nba-stats', response);
    res.json(response);
  } catch (error) {
    console.error('NBA stats error:', error.message);
    res.json({
      success: false,
      error: error.message,
      data: []
    });
  }
});

// NFL player stats endpoint
app.get('/api/nfl-stats', async (req, res) => {
  try {
    const cached = getCachedValue('nfl-stats');
    if (cached) return res.json(cached);

    const response = await getNflStatsData();
    setCachedValue('nfl-stats', response);
    res.json(response);
  } catch (error) {
    console.error('NFL stats error:', error.message);
    res.json({
      success: false,
      error: error.message,
      data: []
    });
  }
});

// Combined player stats endpoint
app.get('/api/player-stats', async (req, res) => {
  try {
    console.log('Fetching combined player stats...');

    const cached = getCachedValue('player-stats');
    if (cached) return res.json(cached);

    const [nbaData, nflData] = await Promise.all([
      getCachedValue('nba-stats') || getNbaStatsData(),
      getCachedValue('nfl-stats') || getNflStatsData()
    ]);

    setCachedValue('nba-stats', nbaData);
    setCachedValue('nfl-stats', nflData);

    const response = {
      success: true,
      data: [...(nbaData.data || []), ...(nflData.data || [])],
      nba: nbaData,
      nfl: nflData
    };

    setCachedValue('player-stats', response);
    res.json(response);
  } catch (error) {
    console.error('Combined stats error:', error.message);
    res.json({
      success: false,
      error: error.message,
      data: []
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Dashboard available at http://localhost:3000/index.html');
});
