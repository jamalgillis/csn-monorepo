import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// CONTENT AUDIT LOG FUNCTIONS
// ============================================================================

/**
 * Create an audit log entry
 */
export const createAuditLog = mutation({
  args: {
    entityType: v.union(v.literal("content"), v.literal("media_asset")),
    entityId: v.string(),
    action: v.union(
      v.literal("created"),
      v.literal("updated"),
      v.literal("published"),
      v.literal("archived"),
      v.literal("deleted")
    ),
    userId: v.id("users"),
    changes: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Get user details
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create audit log entry
    const logId = await ctx.db.insert("content_audit_log", {
      entity_type: args.entityType,
      entity_id: args.entityId,
      action: args.action,
      user_id: args.userId,
      user_email: user.email,
      user_role: "admin", // TODO: Get actual role from user
      changes: args.changes,
      timestamp: Date.now(),
    });

    return logId;
  },
});

/**
 * Get audit log for an entity
 */
export const getAuditLog = query({
  args: {
    entityType: v.union(v.literal("content"), v.literal("media_asset")),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content_audit_log")
      .withIndex("by_entity", (q) =>
        q.eq("entity_type", args.entityType).eq("entity_id", args.entityId)
      )
      .order("desc")
      .collect();
  },
});

/**
 * Get audit log entries by user
 */
export const getAuditLogByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    return await ctx.db
      .query("content_audit_log")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .order("desc")
      .take(limit);
  },
});

/**
 * Get recent audit log entries
 */
export const getRecentAuditLog = query({
  args: {
    limit: v.optional(v.number()),
    action: v.optional(
      v.union(
        v.literal("created"),
        v.literal("updated"),
        v.literal("published"),
        v.literal("archived"),
        v.literal("deleted")
      )
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    let query = ctx.db
      .query("content_audit_log")
      .withIndex("by_timestamp")
      .order("desc");

    if (args.action) {
      query = query.filter((q) => q.eq(q.field("action"), args.action));
    }

    return await query.take(limit);
  },
});

/**
 * Get audit log statistics
 */
export const getAuditLogStats = query({
  args: {
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startTime = args.startTime || Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    const endTime = args.endTime || Date.now();

    const logs = await ctx.db
      .query("content_audit_log")
      .withIndex("by_timestamp")
      .filter((q) =>
        q.and(
          q.gte(q.field("timestamp"), startTime),
          q.lte(q.field("timestamp"), endTime)
        )
      )
      .collect();

    // Calculate stats
    const totalActions = logs.length;

    const actionBreakdown = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const entityTypeBreakdown = logs.reduce((acc, log) => {
      acc[log.entity_type] = (acc[log.entity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueUsers = new Set(logs.map((log) => log.user_id));

    // Top contributors
    const userActivity = logs.reduce((acc, log) => {
      acc[log.user_id] = (acc[log.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topContributors = Object.entries(userActivity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([userId, count]) => ({ userId, count }));

    return {
      totalActions,
      uniqueUsers: uniqueUsers.size,
      actionBreakdown,
      entityTypeBreakdown,
      topContributors,
      timeRange: {
        start: startTime,
        end: endTime,
      },
    };
  },
});

/**
 * Get audit log timeline for entity
 */
export const getEntityTimeline = query({
  args: {
    entityType: v.union(v.literal("content"), v.literal("media_asset")),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("content_audit_log")
      .withIndex("by_entity", (q) =>
        q.eq("entity_type", args.entityType).eq("entity_id", args.entityId)
      )
      .order("desc")
      .collect();

    // Enrich with user details
    const timeline = await Promise.all(
      logs.map(async (log) => {
        const user = await ctx.db.get(log.user_id);
        return {
          ...log,
          user: user
            ? {
                name: user.name,
                avatar_url: user.avatar_url,
                email: user.email,
              }
            : null,
        };
      })
    );

    return timeline;
  },
});

/**
 * Search audit log
 */
export const searchAuditLog = query({
  args: {
    userEmail: v.optional(v.string()),
    entityType: v.optional(v.union(v.literal("content"), v.literal("media_asset"))),
    action: v.optional(
      v.union(
        v.literal("created"),
        v.literal("updated"),
        v.literal("published"),
        v.literal("archived"),
        v.literal("deleted")
      )
    ),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    let query = ctx.db.query("content_audit_log");

    // Apply filters
    const logs = await query.collect();

    let filtered = logs;

    if (args.userEmail) {
      filtered = filtered.filter((log) =>
        log.user_email.toLowerCase().includes(args.userEmail!.toLowerCase())
      );
    }

    if (args.entityType) {
      filtered = filtered.filter((log) => log.entity_type === args.entityType);
    }

    if (args.action) {
      filtered = filtered.filter((log) => log.action === args.action);
    }

    if (args.startTime) {
      filtered = filtered.filter((log) => log.timestamp >= args.startTime!);
    }

    if (args.endTime) {
      filtered = filtered.filter((log) => log.timestamp <= args.endTime!);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    return filtered.slice(0, limit);
  },
});
