import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// CURRENTLY USED FUNCTIONS

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
      quarter: game.quarter,
      timeLeft: game.time_left,
      venue: game.venue,
      game_date: game.game_date,
      video_url: game.video_url,
      gameState: gameState ? {
        quarter: gameState.period_display,
        timeLeft: gameState.time_left || "0:00",
        detailedScore: gameState.detailed_score
      } : null
    };
  }
});

// Get all games with team details
export const getAllGames = query({
  args: {},
  handler: async (ctx) => {
    const games = await ctx.db.query("games").collect();

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
          venue: game.venue,
          gameState: gameState ? {
            quarter: gameState.period_display,
            timeLeft: gameState.time_left || "0:00"
          } : null
        };
      })
    );

    // Sort by game date, most recent first
    return gamesWithDetails.sort((a, b) => 
      new Date(b.game_date).getTime() - new Date(a.game_date).getTime()
    );
  }
});

// Get live games for today's live sports section
export const getLiveGames = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const startOfDayISO = startOfDay.toISOString();
    const endOfDayISO = endOfDay.toISOString();

    // Get live games OR scheduled games for today
    const games = await ctx.db
      .query("games")
      .filter((q) => 
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
          venue: game.venue,
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

// Get sports shows from content
export const getSportsShows = query({
  args: {},
  handler: async (ctx) => {
    const shows = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "published"),
          q.or(
            q.eq(q.field("type"), "show"),
            q.eq(q.field("type"), "podcast")
          )
        )
      )
      .take(12);
    
    return shows;
  }
});

// Get all shows
export const getAllShows = query({
  args: {},
  handler: async (ctx) => {
    const shows = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "published"),
          q.or(
            q.eq(q.field("type"), "show"),
            q.eq(q.field("type"), "podcast")
          )
        )
      )
      .collect();
    
    return shows;
  }
});

// Get show details by ID
export const getShowDetails = query({
  args: { showId: v.id("content") },
  handler: async (ctx, { showId }) => {
    const show = await ctx.db.get(showId);
    
    if (!show || show.status !== "published") {
      return null;
    }
    
    return show;
  }
});

// Update content video URL
export const updateContentVideoUrl = mutation({
  args: {
    contentId: v.id("content"),
    videoUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.contentId, {
      video_url: args.videoUrl
    });
    return { updated: true };
  },
});

// Get hero content (featured content for homepage)
export const getHeroContent = query({
  args: {},
  handler: async (ctx) => {
    // First, check for live games
    const liveGames = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("status"), "in_progress"))
      .order("desc")
      .first();

    if (liveGames) {
      // Get team and sport details for live game
      const [homeTeam, awayTeam, sport] = await Promise.all([
        ctx.db.get(liveGames.home_team_id),
        ctx.db.get(liveGames.away_team_id), 
        ctx.db.get(liveGames.sport_id)
      ]);

      if (homeTeam && awayTeam && sport) {
        return {
          id: liveGames._id,
          type: "live_game" as const,
          title: `${awayTeam.name} @ ${homeTeam.name}`,
          subtitle: `${sport.name} - Live`,
          thumbnail: homeTeam.logo_url || "/placeholder-game.jpg",
          isLive: true,
          navigationUrl: `/games/${liveGames._id}`,
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
          homeScore: liveGames.home_score || 0,
          awayScore: liveGames.away_score || 0,
          sport: sport.name,
          quarter: liveGames.quarter ? `Set ${liveGames.quarter}` : "Live",
          timeLeft: liveGames.time_left || "Live",
          venue: liveGames.venue,
          videoUrl: liveGames.video_url
        };
      }
    }

    // Then check for live shows (Centex Primetime)
    const liveShow = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "published"),
          q.eq(q.field("type"), "show"),
          q.eq(q.field("featured"), true),
          q.or(
            q.eq(q.field("title"), "Centex Primetime"),
            q.eq(q.field("title"), "Friday Night Flex w/ Jalen Gillis")
          )
        )
      )
      .first();

    if (liveShow) {
      return {
        id: liveShow._id,
        type: "live_show" as const,
        title: liveShow.title,
        subtitle: "Live Show",
        thumbnail: liveShow.backdrop_url,
        isLive: true,
        navigationUrl: `/shows/${liveShow._id}`,
        showTitle: liveShow.title,
        host: liveShow.cast[0] || "Jalen Gillis",
        description: liveShow.description,
        videoUrl: liveShow.video_url
      };
    }

    // Finally, check for upcoming scheduled games
    const upcomingGame = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("status"), "scheduled"))
      .order("asc")
      .first();

    if (upcomingGame) {
      // Get team and sport details for scheduled game
      const [homeTeam, awayTeam, sport] = await Promise.all([
        ctx.db.get(upcomingGame.home_team_id),
        ctx.db.get(upcomingGame.away_team_id),
        ctx.db.get(upcomingGame.sport_id)
      ]);

      if (homeTeam && awayTeam && sport) {
        const gameDate = new Date(upcomingGame.game_date);
        const gameTime = gameDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });

        return {
          id: upcomingGame._id,
          type: "scheduled_game" as const,
          title: `${awayTeam.name} @ ${homeTeam.name}`,
          subtitle: `${sport.name} - Upcoming`,
          thumbnail: homeTeam.logo_url || "/placeholder-game.jpg",
          isLive: false,
          navigationUrl: `/games/${upcomingGame._id}`,
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
          sport: sport.name,
          gameTime: gameTime,
          venue: upcomingGame.venue,
          videoUrl: upcomingGame.video_url
        };
      }
    }

    // Default fallback
    return {
      id: "default",
      type: "live_show" as const,
      title: "CSN Sports Network",
      subtitle: "Your Home for Central Texas Sports",
      thumbnail: "/placeholder-game.jpg",
      isLive: false,
      navigationUrl: "/",
      showTitle: "CSN Sports",
      host: "Central Texas Sports",
      description: "The premier destination for Central Texas sports coverage"
    };
  }
});;

// Update game state (used in admin)
export const updateGameState = mutation({
  args: {
    gameId: v.id("games"),
    eventType: v.string(),
    description: v.string(),
    scoreInfo: v.optional(v.object({
      home_score: v.number(),
      away_score: v.number(),
      details: v.optional(v.any())
    })),
    periodInfo: v.optional(v.object({
      period_number: v.number(),
      time_remaining: v.optional(v.string()),
      is_overtime: v.optional(v.boolean())
    })),
    teamId: v.optional(v.id("teams")),
    playerId: v.optional(v.id("players")),
    metadata: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) {
      throw new Error("Game not found");
    }

    // Create game event
    await ctx.db.insert("game_events", {
      game_id: args.gameId,
      event_type: args.eventType as any,
      description: args.description,
      score_info: args.scoreInfo,
      period_info: args.periodInfo,
      team_id: args.teamId,
      player_id: args.playerId,
      creation_time: Date.now(),
      metadata: args.metadata
    });

    // Update game scores if provided
    if (args.scoreInfo) {
      await ctx.db.patch(args.gameId, {
        home_score: args.scoreInfo.home_score,
        away_score: args.scoreInfo.away_score
      });

      // Update or create game state
      const existingGameState = await ctx.db
        .query("game_states")
        .withIndex("by_game", (q) => q.eq("game_id", args.gameId))
        .first();

      if (existingGameState) {
        await ctx.db.patch(existingGameState._id, {
          home_score: args.scoreInfo.home_score,
          away_score: args.scoreInfo.away_score,
          detailed_score: args.scoreInfo.details,
          last_updated: Date.now()
        });
      } else if (args.periodInfo) {
        await ctx.db.insert("game_states", {
          game_id: args.gameId,
          current_period: args.periodInfo.period_number,
          period_type: "set", // Default for volleyball
          period_display: `Set ${args.periodInfo.period_number}`,
          time_left: args.periodInfo.time_remaining,
          home_score: args.scoreInfo.home_score,
          away_score: args.scoreInfo.away_score,
          detailed_score: args.scoreInfo.details,
          is_overtime: args.periodInfo.is_overtime || false,
          last_updated: Date.now()
        });
      }
    }

    return { success: true };
  }
});

// ADMIN/MAINTENANCE FUNCTIONS

// Get all teams
export const getTeams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teams").collect();
  }
});

// Get all sports
export const getSports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sports").collect();
  }
});

// Add team
export const addTeam = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    city: v.string(),
    state: v.string(),
    league: v.string(),
  },
  handler: async (ctx, args) => {
    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      slug: args.slug,
      city: args.city,
      state: args.state,
      league: args.league,
    });
    
    return { success: true, teamId };
  }
});

// Add sport
export const addSport = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sportId = await ctx.db.insert("sports", {
      name: args.name,
      slug: args.slug,
      description: args.description,
    });
    
    return { success: true, sportId };
  }
});

// Bulk add games
export const bulkAddGames = mutation({
  args: {
    games: v.array(v.object({
      homeTeam: v.string(),
      awayTeam: v.string(), 
      sportName: v.string(),
      gameDate: v.string(),
      venue: v.optional(v.string()),
      status: v.optional(v.union(
        v.literal("scheduled"), 
        v.literal("in_progress"), 
        v.literal("final"), 
        v.literal("postponed")
      )),
      homeScore: v.optional(v.number()),
      awayScore: v.optional(v.number())
    }))
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const gameData of args.games) {
      // Find home team
      const homeTeam = await ctx.db
        .query("teams")
        .filter((q) => q.eq(q.field("name"), gameData.homeTeam))
        .first();
      
      // Find away team  
      const awayTeam = await ctx.db
        .query("teams")
        .filter((q) => q.eq(q.field("name"), gameData.awayTeam))
        .first();
      
      // Find sport
      const sport = await ctx.db
        .query("sports")
        .filter((q) => q.eq(q.field("name"), gameData.sportName))
        .first();
      
      if (!homeTeam || !awayTeam || !sport) {
        results.push({
          error: `Could not find teams or sport for: ${gameData.homeTeam} vs ${gameData.awayTeam} (${gameData.sportName})`
        });
        continue;
      }
      
      // Create game
      const gameId = await ctx.db.insert("games", {
        home_team_id: homeTeam._id,
        away_team_id: awayTeam._id,
        sport_id: sport._id,
        game_date: gameData.gameDate,
        venue: gameData.venue,
        status: gameData.status || "scheduled",
        home_score: gameData.homeScore,
        away_score: gameData.awayScore
      });
      
      results.push({
        success: true,
        gameId,
        matchup: `${gameData.homeTeam} vs ${gameData.awayTeam}`
      });
    }
    
    return { results };
  }
});

// INTERNAL FUNCTIONS (used by system)

// Update game stats (internal)
export const updateGameStats = internalMutation({
  args: {
    gameId: v.id("games"),
    homeScore: v.optional(v.number()),
    awayScore: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("scheduled"), 
      v.literal("in_progress"), 
      v.literal("final"), 
      v.literal("postponed")
    )),
    period: v.optional(v.number()),
    timeLeft: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    isOvertime: v.optional(v.boolean()),
    spectatorCount: v.optional(v.number()),
    detailedScore: v.optional(v.object({
      volleyball_sets: v.optional(v.array(v.object({
        home: v.number(),
        away: v.number()
      })))
    }))
  },
  handler: async (ctx, args) => {
    const updates: any = {};
    
    if (args.homeScore !== undefined) updates.home_score = args.homeScore;
    if (args.awayScore !== undefined) updates.away_score = args.awayScore;
    if (args.status !== undefined) updates.status = args.status;
    if (args.period !== undefined) updates.quarter = args.period;
    if (args.timeLeft !== undefined) updates.time_left = args.timeLeft;
    if (args.videoUrl !== undefined) updates.video_url = args.videoUrl;
    
    await ctx.db.patch(args.gameId, updates);
    
    // Update game state if applicable
    if (args.status === "in_progress" || args.homeScore !== undefined || args.awayScore !== undefined) {
      const existingGameState = await ctx.db
        .query("game_states")
        .withIndex("by_game", (q) => q.eq("game_id", args.gameId))
        .first();
        
      if (existingGameState) {
        await ctx.db.patch(existingGameState._id, {
          home_score: args.homeScore ?? existingGameState.home_score,
          away_score: args.awayScore ?? existingGameState.away_score,
          current_period: args.period ?? existingGameState.current_period,
          time_left: args.timeLeft ?? existingGameState.time_left,
          is_overtime: args.isOvertime ?? existingGameState.is_overtime,
          detailed_score: args.detailedScore ?? existingGameState.detailed_score,
          last_updated: Date.now()
        });
      } else if (args.status === "in_progress") {
        await ctx.db.insert("game_states", {
          game_id: args.gameId,
          current_period: args.period ?? 1,
          period_type: "set",
          period_display: `Set ${args.period ?? 1}`,
          time_left: args.timeLeft ?? "",
          home_score: args.homeScore ?? 0,
          away_score: args.awayScore ?? 0,
          detailed_score: args.detailedScore,
          is_overtime: args.isOvertime ?? false,
          last_updated: Date.now()
        });
      }
    }
    
    return { success: true };
  }
});

// Start live game (internal)
export const startLiveGame = internalMutation({
  args: {
    gameId: v.id("games"),
    homeScore: v.optional(v.number()),
    awayScore: v.optional(v.number()),
    period: v.optional(v.number()),
    timeLeft: v.optional(v.string()),
    videoUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // Update game status to in_progress
    await ctx.db.patch(args.gameId, {
      status: "in_progress",
      home_score: args.homeScore ?? 0,
      away_score: args.awayScore ?? 0,
      quarter: args.period ?? 1,
      time_left: args.timeLeft,
      video_url: args.videoUrl
    });
    
    // Create game state
    await ctx.db.insert("game_states", {
      game_id: args.gameId,
      current_period: args.period ?? 1,
      period_type: "set",
      period_display: `Set ${args.period ?? 1}`,
      time_left: args.timeLeft ?? "",
      home_score: args.homeScore ?? 0,
      away_score: args.awayScore ?? 0,
      is_overtime: false,
      last_updated: Date.now()
    });
    
    return { success: true };
  }
});

// End game (internal)
export const endGame = internalMutation({
  args: {
    gameId: v.id("games"),
    finalHomeScore: v.number(),
    finalAwayScore: v.number()
  },
  handler: async (ctx, args) => {
    // Update game to final status
    await ctx.db.patch(args.gameId, {
      status: "final",
      home_score: args.finalHomeScore,
      away_score: args.finalAwayScore
    });
    
    return { success: true };
  }
});