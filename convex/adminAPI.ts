/**
 * Admin API - Comprehensive CRUD operations for admin dashboard
 * All queries and mutations for managing teams, players, games, content, users, and media
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ============================================================================
// TEAMS MANAGEMENT
// ============================================================================

export const getAllTeams = query({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();

    // Get team sports for each team
    const teamsWithSports = await Promise.all(
      teams.map(async (team) => {
        const teamSports = await ctx.db
          .query("team_sports")
          .withIndex("by_team", (q) => q.eq("team_id", team._id))
          .collect();

        const sports = await Promise.all(
          teamSports.map(async (ts) => {
            const sport = await ctx.db.get(ts.sport_id);
            return sport?.name || "Unknown";
          })
        );

        // Get player count
        const players = await ctx.db
          .query("players")
          .withIndex("by_team", (q) => q.eq("team_id", team._id))
          .collect();

        return {
          ...team,
          sports,
          playerCount: players.length
        };
      })
    );

    return teamsWithSports;
  }
});

export const createTeam = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    league: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    sportIds: v.optional(v.array(v.id("sports")))
  },
  handler: async (ctx, args) => {
    const { sportIds, ...teamData } = args;

    // Create team
    const teamId = await ctx.db.insert("teams", teamData);

    // Associate with sports if provided
    if (sportIds && sportIds.length > 0) {
      await Promise.all(
        sportIds.map((sportId) =>
          ctx.db.insert("team_sports", {
            team_id: teamId,
            sport_id: sportId
          })
        )
      );
    }

    return { teamId };
  }
});

export const updateTeam = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    league: v.optional(v.string()),
    logo_url: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { teamId, ...updates } = args;

    await ctx.db.patch(teamId, updates);

    return { success: true };
  }
});

export const deleteTeam = mutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    // Delete team-sport associations
    const teamSports = await ctx.db
      .query("team_sports")
      .withIndex("by_team", (q) => q.eq("team_id", teamId))
      .collect();

    await Promise.all(
      teamSports.map((ts) => ctx.db.delete(ts._id))
    );

    // Delete the team
    await ctx.db.delete(teamId);

    return { success: true };
  }
});

// ============================================================================
// PLAYERS MANAGEMENT
// ============================================================================

export const getAllPlayers = query({
  args: {},
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();

    const playersWithDetails = await Promise.all(
      players.map(async (player) => {
        const team = await ctx.db.get(player.team_id);

        return {
          ...player,
          teamName: team?.name || "Unknown"
        };
      })
    );

    return playersWithDetails;
  }
});

export const getPlayersByTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, { teamId }) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_team", (q) => q.eq("team_id", teamId))
      .collect();

    return players;
  }
});

export const createPlayer = mutation({
  args: {
    full_name: v.string(),
    team_id: v.id("teams"),
    photo_url: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("injured")),
    career_stats: v.optional(v.object({
      points: v.number(),
      rebounds: v.number(),
      assists: v.number(),
      championships: v.number()
    }))
  },
  handler: async (ctx, args) => {
    const playerId = await ctx.db.insert("players", args);
    return { playerId };
  }
});

export const updatePlayer = mutation({
  args: {
    playerId: v.id("players"),
    full_name: v.optional(v.string()),
    team_id: v.optional(v.id("teams")),
    photo_url: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("injured"))),
    career_stats: v.optional(v.object({
      points: v.number(),
      rebounds: v.number(),
      assists: v.number(),
      championships: v.number()
    }))
  },
  handler: async (ctx, args) => {
    const { playerId, ...updates } = args;
    await ctx.db.patch(playerId, updates);
    return { success: true };
  }
});

export const deletePlayer = mutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, { playerId }) => {
    await ctx.db.delete(playerId);
    return { success: true };
  }
});

// ============================================================================
// GAMES MANAGEMENT
// ============================================================================

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
            id: homeTeam?._id,
            name: homeTeam?.name || "Unknown",
            abbreviation: homeTeam?.name?.substring(0, 3).toUpperCase() || "UNK"
          },
          awayTeam: {
            id: awayTeam?._id,
            name: awayTeam?.name || "Unknown",
            abbreviation: awayTeam?.name?.substring(0, 3).toUpperCase() || "UNK"
          },
          sport: sport?.name || "Unknown",
          sportId: game.sport_id,
          status: game.status,
          homeScore: game.home_score || 0,
          awayScore: game.away_score || 0,
          game_date: game.game_date,
          venue: game.venue || "TBD",
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

export const createGame = mutation({
  args: {
    home_team_id: v.id("teams"),
    away_team_id: v.id("teams"),
    sport_id: v.id("sports"),
    game_date: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("final"),
      v.literal("postponed")
    ),
    venue: v.optional(v.string()),
    home_score: v.optional(v.number()),
    away_score: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const gameId = await ctx.db.insert("games", args);
    return { gameId };
  }
});

export const updateGame = mutation({
  args: {
    gameId: v.id("games"),
    home_team_id: v.optional(v.id("teams")),
    away_team_id: v.optional(v.id("teams")),
    sport_id: v.optional(v.id("sports")),
    game_date: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("final"),
      v.literal("postponed")
    )),
    venue: v.optional(v.string()),
    home_score: v.optional(v.number()),
    away_score: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { gameId, ...updates } = args;
    await ctx.db.patch(gameId, updates);
    return { success: true };
  }
});

export const deleteGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, { gameId }) => {
    // Delete related game events
    const gameEvents = await ctx.db
      .query("game_events")
      .withIndex("by_game", (q) => q.eq("game_id", gameId))
      .collect();

    await Promise.all(
      gameEvents.map((event) => ctx.db.delete(event._id))
    );

    // Delete game state if exists
    const gameState = await ctx.db
      .query("game_states")
      .withIndex("by_game", (q) => q.eq("game_id", gameId))
      .first();

    if (gameState) {
      await ctx.db.delete(gameState._id);
    }

    // Delete the game
    await ctx.db.delete(gameId);

    return { success: true };
  }
});

// ============================================================================
// SPORTS MANAGEMENT
// ============================================================================

export const getAllSports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sports").collect();
  }
});

export const createSport = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon_url: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const sportId = await ctx.db.insert("sports", args);
    return { sportId };
  }
});

export const updateSport = mutation({
  args: {
    sportId: v.id("sports"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    icon_url: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { sportId, ...updates } = args;
    await ctx.db.patch(sportId, updates);
    return { success: true };
  }
});

// ============================================================================
// CONTENT MANAGEMENT
// ============================================================================

export const getAllContent = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db.query("content").collect();

    const contentWithDetails = await Promise.all(
      content.map(async (item) => {
        // Get associated teams if any
        const teamNames = item.related_team_ids
          ? await Promise.all(
              item.related_team_ids.map(async (teamId) => {
                const team = await ctx.db.get(teamId);
                return team?.name || "Unknown";
              })
            )
          : [];

        return {
          ...item,
          teamNames
        };
      })
    );

    return contentWithDetails;
  }
});

export const createContent = mutation({
  args: {
    type: v.union(
      v.literal("show"),
      v.literal("podcast"),
      v.literal("feature"),
      v.literal("trailer"),
      v.literal("hype-video"),
      v.literal("highlight"),
      v.literal("clip"),
      v.literal("moment")
    ),
    title: v.string(),
    description: v.string(),
    release_date: v.string(),
    runtime: v.number(),
    rating: v.union(
      v.literal("G"),
      v.literal("PG"),
      v.literal("PG-13"),
      v.literal("R"),
      v.literal("NC-17"),
      v.literal("NR")
    ),
    tags: v.array(v.id("tags")),
    tag_names: v.array(v.string()),
    cast: v.array(v.string()),
    director: v.optional(v.string()),
    poster_url: v.string(),
    backdrop_url: v.string(),
    trailer_url: v.optional(v.string()),
    video_url: v.optional(v.string()),
    featured: v.boolean(),
    trending: v.boolean(),
    new_release: v.boolean(),
    status: v.union(v.literal("published"), v.literal("draft"), v.literal("archived")),
    year: v.number()
  },
  handler: async (ctx, args) => {
    const contentId = await ctx.db.insert("content", args);
    return { contentId };
  }
});

export const updateContent = mutation({
  args: {
    contentId: v.id("content"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("published"), v.literal("draft"), v.literal("archived"))),
    featured: v.optional(v.boolean()),
    trending: v.optional(v.boolean()),
    new_release: v.optional(v.boolean()),
    video_url: v.optional(v.string()),
    trailer_url: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { contentId, ...updates } = args;
    await ctx.db.patch(contentId, updates);
    return { success: true };
  }
});

export const deleteContent = mutation({
  args: { contentId: v.id("content") },
  handler: async (ctx, { contentId }) => {
    await ctx.db.delete(contentId);
    return { success: true };
  }
});

// ============================================================================
// USERS MANAGEMENT
// ============================================================================

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  }
});

export const updateUserSubscription = mutation({
  args: {
    userId: v.id("users"),
    subscription_status: v.union(
      v.literal("free"),
      v.literal("active"),
      v.literal("canceled"),
      v.literal("expired")
    )
  },
  handler: async (ctx, { userId, subscription_status }) => {
    await ctx.db.patch(userId, { subscription_status });
    return { success: true };
  }
});

// ============================================================================
// MEDIA MANAGEMENT
// ============================================================================

export const getAllMedia = query({
  args: {},
  handler: async (ctx) => {
    const mediaFiles = await ctx.db.query("media_files").collect();

    const mediaWithDetails = await Promise.all(
      mediaFiles.map(async (file) => {
        const uploader = await ctx.db.get(file.uploaded_by);

        return {
          ...file,
          uploaderName: uploader?.name || uploader?.email || "Unknown"
        };
      })
    );

    return mediaWithDetails;
  }
});

export const updateMediaStatus = mutation({
  args: {
    mediaId: v.id("media_files"),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("failed"),
      v.literal("archived")
    )
  },
  handler: async (ctx, { mediaId, status }) => {
    await ctx.db.patch(mediaId, { status });
    return { success: true };
  }
});

// ============================================================================
// ANALYTICS DATA
// ============================================================================

export const getAnalyticsOverview = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Get analytics events
    const allEvents = await ctx.db.query("analytics_events").collect();
    const recentEvents = allEvents.filter(event => event.created_at > oneWeekAgo);
    const todayEvents = allEvents.filter(event => event.created_at > oneDayAgo);

    // Get user sessions
    const allSessions = await ctx.db.query("user_sessions").collect();
    const recentSessions = allSessions.filter(session => session.created_at > oneWeekAgo);

    // Calculate metrics
    const totalPageViews = recentEvents.filter(e => e.event_type === "page_view").length;
    const totalVideoPlays = recentEvents.filter(e => e.event_type === "video_play").length;
    const avgSessionDuration = recentSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / (recentSessions.length || 1);

    return {
      totalEvents: recentEvents.length,
      todayEvents: todayEvents.length,
      totalPageViews,
      totalVideoPlays,
      totalSessions: recentSessions.length,
      avgSessionDuration: Math.round(avgSessionDuration),
      topPages: [] // TODO: Aggregate top pages
    };
  }
});

// ============================================================================
// LIVE GAME CONTROLS
// ============================================================================

export const getLiveGameControls = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, { gameId }) => {
    const control = await ctx.db
      .query("live_game_controls")
      .withIndex("by_game", (q) => q.eq("game_id", gameId))
      .first();

    return control;
  }
});

export const updateLiveGameControl = mutation({
  args: {
    controlId: v.id("live_game_controls"),
    stream_status: v.optional(v.union(
      v.literal("offline"),
      v.literal("starting"),
      v.literal("live"),
      v.literal("paused"),
      v.literal("ended")
    )),
    clock_running: v.optional(v.boolean()),
    current_period: v.optional(v.number()),
    home_score: v.optional(v.number()),
    away_score: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { controlId, ...updates } = args;

    await ctx.db.patch(controlId, {
      ...updates,
      updated_at: Date.now()
    });

    return { success: true };
  }
});
