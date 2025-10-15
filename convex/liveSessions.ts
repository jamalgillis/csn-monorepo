import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// LIVE STREAM SESSIONS CRUD FUNCTIONS
// ============================================================================

/**
 * Create or join a live stream session
 */
export const joinLiveStream = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.optional(v.id("users")),
    sessionId: v.string(), // UUID from client
    deviceType: v.string(),
    quality: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if session already exists
    const existing = await ctx.db
      .query("live_stream_sessions")
      .withIndex("by_session", (q) => q.eq("session_id", args.sessionId))
      .first();

    const now = Date.now();

    if (existing) {
      // Reactivate existing session
      await ctx.db.patch(existing._id, {
        active: true,
        last_heartbeat: now,
        quality: args.quality,
      });
      return existing._id;
    }

    // Create new session
    const sessionId = await ctx.db.insert("live_stream_sessions", {
      game_id: args.gameId,
      user_id: args.userId,
      session_id: args.sessionId,
      joined_at: now,
      last_heartbeat: now,
      active: true,
      device_type: args.deviceType,
      quality: args.quality,
    });

    return sessionId;
  },
});

/**
 * Update session heartbeat (called every 30 seconds)
 */
export const updateHeartbeat = mutation({
  args: {
    sessionId: v.string(),
    quality: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("live_stream_sessions")
      .withIndex("by_session", (q) => q.eq("session_id", args.sessionId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(session._id, {
      last_heartbeat: Date.now(),
      active: true,
      quality: args.quality || session.quality,
    });

    return session._id;
  },
});

/**
 * Leave live stream (mark session as inactive)
 */
export const leaveLiveStream = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("live_stream_sessions")
      .withIndex("by_session", (q) => q.eq("session_id", args.sessionId))
      .first();

    if (session) {
      await ctx.db.patch(session._id, {
        active: false,
      });
      return true;
    }

    return false;
  },
});

/**
 * Get active viewer count for a game
 */
export const getActiveViewerCount = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const activeSessions = await ctx.db
      .query("live_stream_sessions")
      .withIndex("by_game_active", (q) =>
        q.eq("game_id", args.gameId).eq("active", true)
      )
      .collect();

    return activeSessions.length;
  },
});

/**
 * Get all active sessions for a game (with details)
 */
export const getActiveSessions = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("live_stream_sessions")
      .withIndex("by_game_active", (q) =>
        q.eq("game_id", args.gameId).eq("active", true)
      )
      .collect();

    // Enrich with user details if available
    const enriched = await Promise.all(
      sessions.map(async (session) => {
        let user = null;
        if (session.user_id) {
          user = await ctx.db.get(session.user_id);
        }
        return {
          ...session,
          user: user ? { name: user.name, avatar_url: user.avatar_url } : null,
        };
      })
    );

    return enriched;
  },
});

/**
 * Cleanup stale sessions (called periodically - every minute)
 * Marks sessions as inactive if no heartbeat for 2 minutes
 */
export const cleanupStaleSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;

    // Find all stale sessions
    const staleSessions = await ctx.db
      .query("live_stream_sessions")
      .withIndex("by_heartbeat")
      .filter((q) =>
        q.and(
          q.lt(q.field("last_heartbeat"), twoMinutesAgo),
          q.eq(q.field("active"), true)
        )
      )
      .collect();

    // Mark as inactive
    await Promise.all(
      staleSessions.map((session) =>
        ctx.db.patch(session._id, { active: false })
      )
    );

    return staleSessions.length;
  },
});

/**
 * Get viewer analytics for a game
 */
export const getViewerAnalytics = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const allSessions = await ctx.db
      .query("live_stream_sessions")
      .withIndex("by_game_active", (q) => q.eq("game_id", args.gameId))
      .collect();

    const activeSessions = allSessions.filter((s) => s.active);

    // Calculate stats
    const totalViewers = allSessions.length;
    const activeViewers = activeSessions.length;

    const deviceBreakdown = activeSessions.reduce((acc, session) => {
      acc[session.device_type] = (acc[session.device_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const qualityBreakdown = activeSessions.reduce((acc, session) => {
      if (session.quality) {
        acc[session.quality] = (acc[session.quality] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const authenticatedViewers = activeSessions.filter((s) => s.user_id).length;
    const anonymousViewers = activeSessions.filter((s) => !s.user_id).length;

    return {
      totalViewers,
      activeViewers,
      authenticatedViewers,
      anonymousViewers,
      deviceBreakdown,
      qualityBreakdown,
    };
  },
});

/**
 * Get session by session ID
 */
export const getSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("live_stream_sessions")
      .withIndex("by_session", (q) => q.eq("session_id", args.sessionId))
      .first();
  },
});
