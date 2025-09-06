import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get other games (live or same day scheduled) for sidebar
export const getOtherGames = query({
  args: { currentGameId: v.id("games") },
  handler: async (ctx, { currentGameId }) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    // Get live games OR scheduled games for today, excluding current game
    const games = await ctx.db
      .query("games")
      .filter((q) => 
        q.and(
          q.neq(q.field("_id"), currentGameId),
          q.or(
            // Live games (any date)
            q.eq(q.field("status"), "in_progress"),
            // Scheduled games for today only
            q.and(
              q.eq(q.field("status"), "scheduled"),
              q.gte(q.field("game_date"), startOfDayISO),
              q.lt(q.field("game_date"), endOfDayISO)
            )
          )
        )
      )
      .collect();

    const gamesWithDetails = await Promise.all(
      games.map(async (game) => {
        const homeTeam = await ctx.db.get(game.home_team_id);
        const awayTeam = await ctx.db.get(game.away_team_id);
        const sport = await ctx.db.get(game.sport_id);

        // Get game state for live games
        let gameState = null;
        if (game.status === "in_progress") {
          gameState = await ctx.db
            .query("game_states")
            .withIndex("by_game", (q) => q.eq("game_id", game._id))
            .first();
        }

        return {
          id: game._id,
          homeTeam: {
            name: homeTeam?.name || "Unknown",
            abbreviation: homeTeam?.name?.substring(0, 3).toUpperCase() || "UNK"
          },
          awayTeam: {
            name: awayTeam?.name || "Unknown", 
            abbreviation: awayTeam?.name?.substring(0, 3).toUpperCase() || "UNK"
          },
          sport: sport?.name || "Unknown",
          status: game.status,
          homeScore: game.home_score || 0,
          awayScore: game.away_score || 0,
          game_date: game.game_date,
          gameState: gameState ? {
            quarter: gameState.period_display,
            timeLeft: gameState.time_left || "0:00"
          } : null
        };
      })
    );

    return gamesWithDetails;
  }
});

// Get game by ID
export const getGameById = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, { gameId }) => {
    const game = await ctx.db.get(gameId);
    if (!game) {
      return null;
    }

    const homeTeam = await ctx.db.get(game.home_team_id);
    const awayTeam = await ctx.db.get(game.away_team_id);
    const sport = await ctx.db.get(game.sport_id);

    // Get game state for live games
    let gameState = null;
    if (game.status === "in_progress") {
      gameState = await ctx.db
        .query("game_states")
        .withIndex("by_game", (q) => q.eq("game_id", gameId))
        .first();
    }

    return {
      id: game._id,
      homeTeam: {
        name: homeTeam?.name || "Unknown",
        logo_url: homeTeam?.logo_url,
        abbreviation: homeTeam?.name?.substring(0, 3).toUpperCase() || "UNK"
      },
      awayTeam: {
        name: awayTeam?.name || "Unknown",
        logo_url: awayTeam?.logo_url,
        abbreviation: awayTeam?.name?.substring(0, 3).toUpperCase() || "UNK"
      },
      sport: {
        name: sport?.name || "Unknown"
      },
      status: game.status,
      homeScore: game.home_score || 0,
      awayScore: game.away_score || 0,
      game_date: game.game_date,
      venue: game.venue || "TBD",
      video_url: (game as any).video_url,
      gameState: gameState ? {
        quarter: gameState.period_display,
        timeLeft: gameState.time_left || "0:00"
      } : null
    };
  }
});

// Get all games for the games page
export const getAllGames = query({
  args: {},
  handler: async (ctx) => {
    const games = await ctx.db.query("games").collect();
    
    const gamesWithDetails = await Promise.all(
      games.map(async (game) => {
        const homeTeam = await ctx.db.get(game.home_team_id);
        const awayTeam = await ctx.db.get(game.away_team_id);
        const sport = await ctx.db.get(game.sport_id);
        
        return {
          id: game._id,
          homeTeam: {
            name: homeTeam?.name || "Unknown",
            logo_url: homeTeam?.logo_url
          },
          awayTeam: {
            name: awayTeam?.name || "Unknown", 
            logo_url: awayTeam?.logo_url
          },
          sport: {
            name: sport?.name || "Unknown"
          },
          status: game.status,
          homeScore: game.home_score,
          awayScore: game.away_score,
          game_date: game.game_date,
          venue: game.venue
        };
      })
    );
    
    return gamesWithDetails;
  }
});

// Get live games
export const getLiveGames = query({
  args: {},
  handler: async (ctx) => {
    // Get today's date in ISO format for comparison
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    // Get games that should be displayed:
    // 1. Live games (regardless of date)
    // 2. All scheduled games (past and future)
    // 3. Final games ONLY from today
    const relevantGames = await ctx.db
      .query("games")
      .filter((q) => 
        q.or(
          // Live games (regardless of date)
          q.eq(q.field("status"), "in_progress"),
          // All scheduled games (past and future)
          q.eq(q.field("status"), "scheduled"),
          // Final games ONLY for today
          q.and(
            q.eq(q.field("status"), "final"),
            q.gte(q.field("game_date"), startOfDayISO),
            q.lt(q.field("game_date"), endOfDayISO)
          )
        )
      )
      .collect();
    
    // Get detailed information for each game
    const gamesWithDetails = await Promise.all(
      relevantGames.map(async (game) => {
        const homeTeam = await ctx.db.get(game.home_team_id);
        const awayTeam = await ctx.db.get(game.away_team_id);
        const sport = await ctx.db.get(game.sport_id);
        
        // Get current game state for live games
        let gameState = null;
        let periodDisplay = "1st Quarter";
        let timeLeft = "15:00";
        let currentHomeScore = game.home_score || 0;
        let currentAwayScore = game.away_score || 0;
        
        if (game.status === "in_progress") {
          gameState = await ctx.db
            .query("game_states")
            .withIndex("by_game", (q) => q.eq("game_id", game._id))
            .first();
            
          if (gameState) {
            periodDisplay = gameState.period_display;
            timeLeft = gameState.time_left || "15:00";
            currentHomeScore = gameState.home_score;
            currentAwayScore = gameState.away_score;
          }
        } else if (game.status === "final") {
          // For final games, get the final state
          gameState = await ctx.db
            .query("game_states")
            .withIndex("by_game", (q) => q.eq("game_id", game._id))
            .first();
            
          if (gameState) {
            periodDisplay = "Final";
            currentHomeScore = gameState.home_score;
            currentAwayScore = gameState.away_score;
          }
        }
        
        // Format game time for display
        const gameDate = new Date(game.game_date);
        const gameTime = gameDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        
        return {
          id: game._id,
          homeTeam: homeTeam?.name || "Unknown",
          awayTeam: awayTeam?.name || "Unknown",
          homeScore: currentHomeScore,
          awayScore: currentAwayScore,
          quarter: periodDisplay,
          timeLeft: timeLeft,
          isLive: game.status === "in_progress",
          isScheduled: game.status === "scheduled",
          isFinal: game.status === "final",
          status: game.status,
          gameTime: gameTime,
          gameDate: game.game_date,
          venue: game.venue || "TBD",
          viewers: Math.floor(Math.random() * 100000) + 10000, // Placeholder for viewer count
          thumbnail: `/placeholder-${Math.random().toString(36).substring(7)}.png`,
          sport: sport?.name || "Unknown",
          gameState: gameState ? {
            periodType: gameState.period_type,
            currentPeriod: gameState.current_period,
            detailedScore: gameState.detailed_score,
            isOvertime: gameState.is_overtime
          } : null
        };
      })
    );
    
    // Sort by status priority and date/time
    const sortedGames = gamesWithDetails.sort((a, b) => {
      // Priority: live > final (today only) > scheduled
      const statusPriority = { 
        'in_progress': 0, 
        'final': 1, 
        'scheduled': 2 
      };
      const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 3;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 3;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // If same status, sort by game date/time
      return new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime();
    });
    
    return sortedGames;
  },
});

// Get sports shows (content with type "show")
export const getSportsShows = query({
  args: {},
  handler: async (ctx) => {
    const showsAndPodcasts = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.or(
            q.eq(q.field("type"), "show"),
            q.eq(q.field("type"), "podcast")
          ),
          q.eq(q.field("status"), "published")
        )
      )
      .take(15); // Increased limit to show more content
    
    return showsAndPodcasts.map(item => ({
      id: item._id,
      title: item.title,
      description: item.description,
      duration: `${item.runtime} min`,
      isLive: item.featured, // Use featured as live indicator
      thumbnail: item.poster_url,
      category: item.tag_names[0] || "Sports",
      type: item.type, // Include the content type (show or podcast)
      badge: item.type === "podcast" ? "Podcast" : (item.featured ? "Live Now" : "Available")
    }));
  },
});

// Get all shows from database (shows only, no podcasts)
export const getAllShows = query({
  args: {},
  handler: async (ctx) => {
    const shows = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "show"),
          q.eq(q.field("status"), "published")
        )
      )
      .collect();
    
    return shows.map(show => ({
      id: show._id,
      title: show.title,
      category: show.tag_names[0] || "Sports Show",
      description: show.description,
      thumbnail: show.poster_url,
      rating: 4.5, // Default rating since not in schema
      episodes: Math.floor(Math.random() * 1000) + 50, // Generated count
      duration: `${show.runtime} min`,
      status: show.featured ? "live" : "available",
      viewers: `${Math.floor(Math.random() * 2000) + 500}K`, // Generated viewer count
      tags: show.tag_names || ["Sports"],
      type: "show"
    }));
  },
});

// Get game highlights (content with type "highlight")
export const getGameHighlights = query({
  args: {},
  handler: async (ctx) => {
    const highlights = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "highlight"),
          q.eq(q.field("status"), "published")
        )
      )
      .take(20);
    
    return highlights.map(highlight => ({
      id: highlight._id,
      title: highlight.title,
      description: highlight.description,
      duration: `${Math.floor(highlight.runtime)}:${(highlight.runtime % 1 * 60).toFixed(0).padStart(2, '0')}`,
      views: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
      thumbnail: highlight.poster_url,
      sport: highlight.tag_names.find(tag => ["NBA", "NFL", "MLB", "Soccer"].includes(tag)) || "Sports",
    }));
  },
});

// Get news articles (from blog_posts)
export const getNewsArticles = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("blog_posts")
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc")
      .take(20);
    
    // Get author details for each article
    const articlesWithAuthors = await Promise.all(
      articles.map(async (article) => {
        const author = await ctx.db.get(article.author_id);
        
        return {
          id: article._id,
          title: article.title,
          excerpt: article.excerpt || article.content.substring(0, 150) + "...",
          category: article.category_name || "News",
          timestamp: article.published_at ? getTimeAgo(article.published_at) : "Recently",
          author: author?.name || "CSN Staff",
          thumbnail: article.featured_image || "/placeholder-news.jpg",
          size: article.featured ? "large" : "medium",
        };
      })
    );
    
    return articlesWithAuthors;
  },
});

// Get MVP candidates (top players with career stats)
export const getMVPCandidates = query({
  args: {},
  handler: async (ctx) => {
    const players = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    
    // Filter players with career stats and sort by points
    const playersWithStats = players
      .filter(player => player.career_stats && player.career_stats.points > 1000)
      .sort((a, b) => (b.career_stats?.points || 0) - (a.career_stats?.points || 0))
      .slice(0, 4);
    
    const mvpCandidates = await Promise.all(
      playersWithStats.map(async (player, index) => {
        const team = await ctx.db.get(player.team_id);
        const seasonStats = await ctx.db
          .query("player_season_stats")
          .withIndex("by_player", (q) => q.eq("player_id", player._id))
          .filter((q) => q.eq(q.field("season"), "2024-25"))
          .first();
        
        const odds = ["+150", "+200", "+300", "+500"][index] || "+1000";
        
        return {
          id: player._id,
          name: player.full_name,
          team: team?.name || "Unknown",
          stats: seasonStats 
            ? `${seasonStats.points_per_game.toFixed(1)} PPG, ${seasonStats.rebounds_per_game.toFixed(1)} RPG, ${seasonStats.assists_per_game.toFixed(1)} APG`
            : `${player.career_stats?.points || 0} career points`,
          odds,
          position: index + 1,
        };
      })
    );
    
    return mvpCandidates;
  },
});

// Get team standings
export const getStandings = query({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db
      .query("teams")
      .collect();
    
    // Get games for each team to calculate win-loss record
    const standings = await Promise.all(
      teams.slice(0, 5).map(async (team) => {
        const homeGames = await ctx.db
          .query("games")
          .filter((q) => 
            q.and(
              q.eq(q.field("home_team_id"), team._id),
              q.eq(q.field("status"), "final")
            )
          )
          .collect();
        
        const awayGames = await ctx.db
          .query("games")
          .filter((q) => 
            q.and(
              q.eq(q.field("away_team_id"), team._id),
              q.eq(q.field("status"), "final")
            )
          )
          .collect();
        
        const homeWins = homeGames.filter(game => 
          (game.home_score || 0) > (game.away_score || 0)
        ).length;
        const awayWins = awayGames.filter(game => 
          (game.away_score || 0) > (game.home_score || 0)
        ).length;
        
        const wins = homeWins + awayWins;
        const losses = (homeGames.length + awayGames.length) - wins;
        const totalGames = wins + losses;
        const pct = totalGames > 0 ? (wins / totalGames).toFixed(3) : ".000";
        
        return {
          team: team.name,
          wins,
          losses,
          pct,
        };
      })
    );
    
    // Sort by winning percentage
    return standings.sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct));
  },
});

// Get all teams
export const getTeams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teams").collect();
  },
});

// Get all sports
export const getSports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sports").collect();
  },
});

// Get players by team
export const getPlayersByTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("players")
      .withIndex("by_team", (q) => q.eq("team_id", args.teamId))
      .collect();
  },
});


// Add a new team
export const addTeam = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    city: v.string(),
    state: v.string(),
    league: v.string()
  },
  handler: async (ctx, args) => {
    // Check if team already exists
    const existingTeam = await ctx.db
      .query("teams")
      .filter(q => q.eq(q.field("slug"), args.slug))
      .first();
    
    if (existingTeam) {
      return { 
        message: `Team with slug "${args.slug}" already exists`,
        existing: true,
        teamId: existingTeam._id
      };
    }

    // Add the team
    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      slug: args.slug,
      city: args.city,
      state: args.state,
      league: args.league
    });

    return {
      message: `${args.name} added successfully`,
      teamId,
      existing: false
    };
  },
});
export const addSport = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if sport already exists
    const existingSport = await ctx.db
      .query("sports")
      .filter(q => q.eq(q.field("slug"), args.slug))
      .first();
    
    if (existingSport) {
      return { 
        message: `Sport with slug "${args.slug}" already exists`,
        existing: true,
        sportId: existingSport._id
      };
    }

    // Add the sport
    const sportId = await ctx.db.insert("sports", {
      name: args.name,
      slug: args.slug,
      description: args.description
    });

    return {
      message: `${args.name} added successfully`,
      sportId,
      existing: false
    };
  },
});

export const addGame = mutation({
  args: {
    home_team_id: v.id("teams"),
    away_team_id: v.id("teams"),
    sport_id: v.id("sports"),
    game_date: v.string(), // ISO string format
    venue: v.optional(v.string()),
    status: v.optional(v.union(v.literal("scheduled"), v.literal("in_progress"), v.literal("final"), v.literal("postponed")))
  },
  handler: async (ctx, args) => {
    // Verify teams exist
    const homeTeam = await ctx.db.get(args.home_team_id);
    const awayTeam = await ctx.db.get(args.away_team_id);
    const sport = await ctx.db.get(args.sport_id);

    if (!homeTeam) {
      throw new Error("Home team not found");
    }
    if (!awayTeam) {
      throw new Error("Away team not found");
    }
    if (!sport) {
      throw new Error("Sport not found");
    }

    // Add the game
    const gameId = await ctx.db.insert("games", {
      home_team_id: args.home_team_id,
      away_team_id: args.away_team_id,
      sport_id: args.sport_id,
      game_date: args.game_date,
      venue: args.venue,
      status: args.status || "scheduled"
    });

    return {
      message: `Game scheduled: ${awayTeam.name} @ ${homeTeam.name} - ${sport.name}`,
      gameId,
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      sport: sport.name,
      gameDate: args.game_date,
      venue: args.venue
    };
  },
});
// Helper function to format period display based on sport
function formatPeriodDisplay(sportName: string, period: number, isOvertime: boolean = false): string {
  if (isOvertime) {
    switch(sportName.toLowerCase()) {
      case 'basketball':
      case 'football':
        return `OT${period > 4 ? period - 4 : ''}`;
      case 'volleyball':
        return `Set ${period}`;
      case 'baseball':
      case 'softball':
        return `${period % 2 === 1 ? 'Top' : 'Bot'} ${Math.ceil(period/2)}`;
      default:
        return `OT${period > 4 ? period - 4 : ''}`;
    }
  }

  switch(sportName.toLowerCase()) {
    case 'basketball':
    case 'football':
      return `${period}${period === 1 ? 'st' : period === 2 ? 'nd' : period === 3 ? 'rd' : 'th'} Quarter`;
    case 'volleyball':
      return `Set ${period}`;
    case 'baseball':
    case 'softball':
      return `${period % 2 === 1 ? 'Top' : 'Bot'} ${Math.ceil(period/2)}`;
    default:
      return `${period}${period === 1 ? 'st' : period === 2 ? 'nd' : period === 3 ? 'rd' : 'th'}`;
  }
}

// Helper function to get period type based on sport
function getPeriodType(sportName: string): string {
  switch(sportName.toLowerCase()) {
    case 'basketball':
    case 'football':
      return 'quarter';
    case 'volleyball':
      return 'set';
    case 'baseball':
    case 'softball':
      return 'inning';
    case 'soccer':
      return 'half';
    default:
      return 'period';
  }
}

export const updateGameState = mutation({
  args: {
    gameId: v.id("games"),
    eventType: v.string(),
    periodInfo: v.optional(v.object({
      period_number: v.number(),
      time_remaining: v.optional(v.string()),
      is_overtime: v.optional(v.boolean())
    })),
    scoreInfo: v.optional(v.object({
      home_score: v.number(),
      away_score: v.number(),
      details: v.optional(v.any()) // Sport-specific scoring details
    })),
    playerId: v.optional(v.id("players")),
    teamId: v.optional(v.id("teams")),
    description: v.string(),
    metadata: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    // Get game and sport info
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");
    
    const sport = await ctx.db.get(game.sport_id);
    if (!sport) throw new Error("Sport not found");

    // 1. Insert event record
    await ctx.db.insert("game_events", {
      game_id: args.gameId,
      event_type: args.eventType as any,
      period_info: args.periodInfo ? {
        period_number: args.periodInfo.period_number,
        period_type: getPeriodType(sport.name),
        time_remaining: args.periodInfo.time_remaining,
        is_overtime: args.periodInfo.is_overtime
      } : undefined,
      score_info: args.scoreInfo,
      player_id: args.playerId,
      team_id: args.teamId,
      description: args.description,
      creation_time: Date.now(),
      metadata: args.metadata
    });

    // 2. Update or create current game state
    const existingState = await ctx.db
      .query("game_states")
      .withIndex("by_game", (q) => q.eq("game_id", args.gameId))
      .first();
      
    const stateData = {
      game_id: args.gameId,
      current_period: args.periodInfo?.period_number || 1,
      period_type: getPeriodType(sport.name),
      period_display: formatPeriodDisplay(
        sport.name, 
        args.periodInfo?.period_number || 1, 
        args.periodInfo?.is_overtime || false
      ),
      time_left: args.periodInfo?.time_remaining || "15:00",
      home_score: args.scoreInfo?.home_score || 0,
      away_score: args.scoreInfo?.away_score || 0,
      detailed_score: args.scoreInfo?.details,
      is_overtime: args.periodInfo?.is_overtime || false,
      last_updated: Date.now()
    };

    if (existingState) {
      await ctx.db.patch(existingState._id, stateData);
    } else {
      await ctx.db.insert("game_states", stateData);
    }

    // 3. Update game status if needed
    if (args.eventType === "period_start" && game.status === "scheduled") {
      await ctx.db.patch(args.gameId, { status: "in_progress" });
    }

    return {
      message: `Game state updated: ${args.description}`,
      gameId: args.gameId,
      eventType: args.eventType,
      currentState: stateData
    };
  },
});
export const bulkAddGames = mutation({
  args: {
    games: v.array(v.object({
      homeTeam: v.string(),
      awayTeam: v.string(),
      gameDate: v.string(), // ISO string format
      venue: v.optional(v.string()),
      status: v.optional(v.union(v.literal("scheduled"), v.literal("in_progress"), v.literal("final"), v.literal("postponed"))),
      homeScore: v.optional(v.number()),
      awayScore: v.optional(v.number()),
      sportName: v.string()
    }))
  },
  handler: async (ctx, args) => {
    // Get volleyball sport ID
    let volleyball = await ctx.db
      .query("sports")
      .filter(q => q.eq(q.field("slug"), "volleyball"))
      .first();
      
    if (!volleyball) {
      throw new Error("Volleyball sport not found. Please add it first.");
    }

    // Get McLennan team ID
    let mclennan = await ctx.db
      .query("teams")
      .filter(q => q.eq(q.field("slug"), "mclennan-community-college"))
      .first();
      
    if (!mclennan) {
      throw new Error("McLennan Community College team not found.");
    }

    const results = [];

    for (const gameData of args.games) {
      // Find or create opponent team
      let opponentTeam = await ctx.db
        .query("teams")
        .filter(q => q.eq(q.field("name"), gameData.awayTeam === "McLennan Community College" ? gameData.homeTeam : gameData.awayTeam))
        .first();

      if (!opponentTeam) {
        // Create opponent team with basic info
        const opponentName = gameData.awayTeam === "McLennan Community College" ? gameData.homeTeam : gameData.awayTeam;
        const opponentSlug = opponentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        
        const opponentId = await ctx.db.insert("teams", {
          name: opponentName,
          slug: opponentSlug,
          league: "NJCAA",
          city: "Unknown",
          state: "TX"
        });
        
        // Fetch the complete team object after insertion
        opponentTeam = await ctx.db.get(opponentId);
        if (!opponentTeam) {
          throw new Error("Failed to create opponent team");
        }
      }

      // Determine home and away team IDs
      const isHome = gameData.homeTeam === "McLennan Community College";
      const homeTeamId = isHome ? mclennan._id : opponentTeam._id;
      const awayTeamId = isHome ? opponentTeam._id : mclennan._id;

      // Create the game
      const gameId = await ctx.db.insert("games", {
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
        sport_id: volleyball._id,
        game_date: gameData.gameDate,
        venue: gameData.venue,
        status: gameData.status || "scheduled",
        home_score: gameData.homeScore,
        away_score: gameData.awayScore
      });

      results.push({
        gameId,
        opponent: opponentTeam.name,
        isHome,
        status: gameData.status || "scheduled",
        date: gameData.gameDate
      });
    }

    return {
      message: `Successfully added ${results.length} games`,
      games: results
    };
  },
});;

// Fix incorrect game times based on original schedule
export const fixGameTimes = mutation({
  args: {},
  handler: async (ctx) => {
    // Get McLennan team
    const mclennan = await ctx.db
      .query("teams")
      .filter(q => q.eq(q.field("name"), "McLennan Community College"))
      .first();
      
    if (!mclennan) {
      throw new Error("McLennan Community College team not found");
    }

    // Define correct times mapping (opponent -> correct time)
    const correctTimes = [
      { opponent: "Lee College", date: "2025-01-05", time: "15:00:00.000Z" }, // 3:00 PM CDT
      { opponent: "Vernon College", date: "2025-01-06", time: "13:00:00.000Z" }, // 1:00 PM CDT
      { opponent: "Temple College", date: "2025-01-10", time: "18:00:00.000Z" }, // 6:00 PM CDT
      { opponent: "Cisco College", date: "2025-01-13", time: "13:00:00.000Z" }, // 1:00 PM CDT
      { opponent: "Collin County Community College", date: "2025-01-17", time: "18:00:00.000Z" }, // 6:00 PM CDT
      { opponent: "North Central Texas College", date: "2025-01-20", time: "13:00:00.000Z" }, // 1:00 PM CDT
      { opponent: "Ranger College", date: "2025-01-24", time: "18:00:00.000Z" }, // 6:00 PM CDT
      { opponent: "Hill College", date: "2025-01-27", time: "13:00:00.000Z" }, // 1:00 PM CDT
      { opponent: "Navarro College", date: "2025-01-29", time: "19:00:00.000Z" }, // 7:00 PM CDT (Mon 29, not 30)
    ];

    const results = [];

    for (const correction of correctTimes) {
      // Find the game
      const games = await ctx.db.query("games").collect();
      
      for (const game of games) {
        const homeTeam = await ctx.db.get(game.home_team_id);
        const awayTeam = await ctx.db.get(game.away_team_id);
        
        if (!homeTeam || !awayTeam) continue;
        
        const gameDate = game.game_date.substring(0, 10); // Get YYYY-MM-DD part
        const isCorrectGame = gameDate === correction.date && 
          (homeTeam.name.includes(correction.opponent) || awayTeam.name.includes(correction.opponent));
        
        if (isCorrectGame) {
          // Update the game time
          const correctDateTime = `${correction.date}T${correction.time}`;
          
          await ctx.db.patch(game._id, {
            game_date: correctDateTime
          });
          
          results.push({
            gameId: game._id,
            opponent: correction.opponent,
            oldTime: game.game_date,
            newTime: correctDateTime
          });
          break;
        }
      }
    }

    return {
      message: `Successfully updated ${results.length} game times`,
      updates: results
    };
  },
});

// Fix Navarro College game date and time
export const fixNavarroGame = mutation({
  args: {},
  handler: async (ctx) => {
    // Find the Navarro College game that's currently on Jan 30
    const games = await ctx.db.query("games").collect();
    
    for (const game of games) {
      const homeTeam = await ctx.db.get(game.home_team_id);
      const awayTeam = await ctx.db.get(game.away_team_id);
      
      if (!homeTeam || !awayTeam) continue;
      
      // Check if this is the Navarro game on Jan 30
      const gameDate = game.game_date.substring(0, 10);
      const isNavarroGame = gameDate === "2025-01-30" && 
        (homeTeam.name.includes("Navarro") || awayTeam.name.includes("Navarro"));
      
      if (isNavarroGame) {
        // Update to Jan 29 at 7:00 PM CDT
        await ctx.db.patch(game._id, {
          game_date: "2025-01-29T19:00:00.000Z"
        });
        
        return {
          message: "Successfully updated Navarro College game",
          gameId: game._id,
          oldTime: game.game_date,
          newTime: "2025-01-29T19:00:00.000Z",
          opponent: homeTeam.name.includes("Navarro") ? homeTeam.name : awayTeam.name
        };
      }
    }
    
    return {
      message: "Navarro College game not found"
    };
  },
});

// Get individual show/content details by ID
export const getShowDetails = query({
  args: { showId: v.id("content") },
  handler: async (ctx, { showId }) => {
    const show = await ctx.db.get(showId);
    
    if (!show || show.type !== "show") {
      return null;
    }
    
    // Get related content (similar shows)
    const similarShows = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "show"),
          q.eq(q.field("status"), "published"),
          q.neq(q.field("_id"), showId)
        )
      )
      .take(4);
      
    return {
      ...show,
      similarShows
    };
  }
});

// Get hero content - live games, live shows, or next scheduled game
export const getHeroContent = query({
  args: {},
  handler: async (ctx) => {
    // Priority 1: Check for live games
    const games = await ctx.db.query("games").collect();
    const liveGame = games.find(game => game.status === "in_progress");
    
    if (liveGame) {
      const homeTeam = await ctx.db.get(liveGame.home_team_id);
      const awayTeam = await ctx.db.get(liveGame.away_team_id);
      const sport = await ctx.db.get(liveGame.sport_id);
      
      // Get current game state
      const gameState = await ctx.db
        .query("game_states")
        .withIndex("by_game", (q) => q.eq("game_id", liveGame._id))
        .first();
      
      // Use McLennan team image if McLennan is playing
      const mclennanPlaying = homeTeam?.name === "McLennan Community College" || awayTeam?.name === "McLennan Community College";
      const thumbnail = mclennanPlaying ? "/mclennan-team.jpg" : (homeTeam?.logo_url || awayTeam?.logo_url || "/placeholder-game.jpg");

      // Generate sport-appropriate fallbacks
      const sportName = sport?.name || "Sports";
      const fallbackPeriod = formatPeriodDisplay(sportName, 1, false);
      const fallbackTime = sportName.toLowerCase() === "volleyball" ? "0-0" : "15:00";

      return {
        id: liveGame._id,
        type: "live_game" as const,
        title: `${awayTeam?.name || "Away"} vs ${homeTeam?.name || "Home"}`,
        subtitle: gameState?.period_display || "Live Game",
        thumbnail: thumbnail,
        isLive: true,
        navigationUrl: `/games/${liveGame._id}`,
        homeTeam: homeTeam?.name || "Home",
        awayTeam: awayTeam?.name || "Away", 
        homeScore: liveGame.home_score || 0,
        awayScore: liveGame.away_score || 0,
        sport: sportName,
        quarter: gameState?.period_display || fallbackPeriod,
        timeLeft: gameState?.time_left || fallbackTime,
        venue: liveGame.venue || "TBD",
        videoUrl: (liveGame as any).video_url || null
      };
    }
    
    // Priority 2: Check for featured shows OR podcasts (using featured as live indicator)
    const liveShows = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.or(
            q.eq(q.field("type"), "show"),
            q.eq(q.field("type"), "podcast")
          ),
          q.eq(q.field("status"), "published"),
          q.eq(q.field("featured"), true) // Featured means live
        )
      )
      .first();
    
    if (liveShows) {
      return {
        id: liveShows._id,
        type: "live_show" as const,
        title: liveShows.title,
        subtitle: "Live Show",
        thumbnail: liveShows.poster_url || "/placeholder-show.jpg",
        isLive: true,
        navigationUrl: `/shows/${liveShows._id}`,
        showTitle: liveShows.title,
        host: "CSN Staff", // Default host
        description: liveShows.description,
        videoUrl: liveShows.video_url || null
      };
    }
    
    // Priority 3: Get next scheduled game
    const now = new Date();
    const upcomingGames = games
      .filter(game => {
        const gameDate = new Date(game.game_date);
        return game.status === "scheduled" && gameDate > now;
      })
      .sort((a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime());
    
    if (upcomingGames.length > 0) {
      const nextGame = upcomingGames[0];
      const homeTeam = await ctx.db.get(nextGame.home_team_id);
      const awayTeam = await ctx.db.get(nextGame.away_team_id);
      const sport = await ctx.db.get(nextGame.sport_id);
      
      const gameDate = new Date(nextGame.game_date);
      const gameTime = gameDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      // Use McLennan team image if McLennan is playing
      const mclennanPlaying = homeTeam?.name === "McLennan Community College" || awayTeam?.name === "McLennan Community College";
      const thumbnail = mclennanPlaying ? "/mclennan-team.jpg" : (homeTeam?.logo_url || awayTeam?.logo_url || "/placeholder-game.jpg");
      
      return {
        id: nextGame._id,
        type: "scheduled_game" as const,
        title: `${awayTeam?.name || "Away"} vs ${homeTeam?.name || "Home"}`,
        subtitle: "Upcoming Game",
        thumbnail: thumbnail,
        isLive: false,
        navigationUrl: `/games/${nextGame._id}`,
        homeTeam: homeTeam?.name || "Home",
        awayTeam: awayTeam?.name || "Away",
        sport: sport?.name || "Sports",
        gameTime: gameTime,
        venue: nextGame.venue || "TBD"
      };
    }
    
    // Fallback: No content available
    return {
      id: "fallback",
      type: "scheduled_game" as const,
      title: "CSN Sports",
      subtitle: "Stay tuned for live content",
      thumbnail: "/csn-logo.jpg",
      isLive: false,
      navigationUrl: "/",
      homeTeam: "",
      awayTeam: "",
      sport: "Sports",
      gameTime: "Coming Soon",
      venue: "TBD"
    };
  }
});

// Helper function to get relative time
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return past.toLocaleDateString();
}

