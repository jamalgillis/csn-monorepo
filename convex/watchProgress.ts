import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// USER WATCH PROGRESS CRUD FUNCTIONS
// ============================================================================

/**
 * Update or create watch progress (upsert pattern)
 */
export const updateWatchProgress = mutation({
  args: {
    userId: v.id("users"),
    contentId: v.id("content"),
    positionSeconds: v.number(),
    durationSeconds: v.number(),
    deviceType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if progress already exists
    const existing = await ctx.db
      .query("user_watch_progress")
      .withIndex("by_user_content", (q) =>
        q.eq("user_id", args.userId).eq("content_id", args.contentId)
      )
      .first();

    const completionPercentage = (args.positionSeconds / args.durationSeconds) * 100;
    const completed = completionPercentage >= 90;

    const progressData = {
      position_seconds: args.positionSeconds,
      duration_seconds: args.durationSeconds,
      completion_percentage: completionPercentage,
      last_watched_at: Date.now(),
      device_type: args.deviceType,
      completed,
    };

    if (existing) {
      // Update existing progress
      await ctx.db.patch(existing._id, progressData);
      return existing._id;
    } else {
      // Create new progress
      const progressId = await ctx.db.insert("user_watch_progress", {
        user_id: args.userId,
        content_id: args.contentId,
        ...progressData,
      });
      return progressId;
    }
  },
});

/**
 * Get watch progress for specific content
 */
export const getWatchProgress = query({
  args: {
    userId: v.id("users"),
    contentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_watch_progress")
      .withIndex("by_user_content", (q) =>
        q.eq("user_id", args.userId).eq("content_id", args.contentId)
      )
      .first();
  },
});

/**
 * Get Continue Watching list (most recent unfinished content)
 */
export const getContinueWatching = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    const progressList = await ctx.db
      .query("user_watch_progress")
      .withIndex("by_last_watched", (q) => q.eq("user_id", args.userId))
      .order("desc")
      .filter((q) => q.eq(q.field("completed"), false))
      .take(limit);

    // Enrich with content details
    const enriched = await Promise.all(
      progressList.map(async (progress) => {
        const content = await ctx.db.get(progress.content_id);
        return {
          ...progress,
          content,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get all watch progress for a user
 */
export const getUserWatchProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_watch_progress")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .collect();
  },
});

/**
 * Mark content as completed
 */
export const markAsCompleted = mutation({
  args: {
    userId: v.id("users"),
    contentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("user_watch_progress")
      .withIndex("by_user_content", (q) =>
        q.eq("user_id", args.userId).eq("content_id", args.contentId)
      )
      .first();

    if (progress) {
      await ctx.db.patch(progress._id, {
        completed: true,
        completion_percentage: 100,
        last_watched_at: Date.now(),
      });
      return progress._id;
    }

    // Create new completed progress if doesn't exist
    const progressId = await ctx.db.insert("user_watch_progress", {
      user_id: args.userId,
      content_id: args.contentId,
      position_seconds: 0,
      duration_seconds: 0,
      completion_percentage: 100,
      last_watched_at: Date.now(),
      completed: true,
    });

    return progressId;
  },
});

/**
 * Delete watch progress
 */
export const deleteWatchProgress = mutation({
  args: {
    userId: v.id("users"),
    contentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("user_watch_progress")
      .withIndex("by_user_content", (q) =>
        q.eq("user_id", args.userId).eq("content_id", args.contentId)
      )
      .first();

    if (progress) {
      await ctx.db.delete(progress._id);
      return true;
    }

    return false;
  },
});
