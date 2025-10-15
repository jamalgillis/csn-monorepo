import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// LIVE CHAT MESSAGES CRUD FUNCTIONS
// ============================================================================

/**
 * Send a chat message
 */
export const sendMessage = mutation({
  args: {
    gameId: v.id("games"),
    userId: v.id("users"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate message length
    if (args.message.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }
    if (args.message.length > 500) {
      throw new Error("Message too long (max 500 characters)");
    }

    // Get user details for denormalization
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create message
    const messageId = await ctx.db.insert("live_chat_messages", {
      game_id: args.gameId,
      user_id: args.userId,
      message: args.message.trim(),
      user_name: user.name || "Anonymous",
      user_avatar: user.avatar_url,
      status: "active",
      created_at: Date.now(),
    });

    return messageId;
  },
});

/**
 * Get chat messages for a game (with pagination)
 */
export const getMessages = query({
  args: {
    gameId: v.id("games"),
    limit: v.optional(v.number()),
    before: v.optional(v.number()), // Timestamp for pagination
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    let query = ctx.db
      .query("live_chat_messages")
      .withIndex("by_game", (q) => q.eq("game_id", args.gameId))
      .order("desc");

    if (args.before) {
      query = query.filter((q) => q.lt(q.field("created_at"), args.before));
    }

    // Only show active messages (not hidden/deleted)
    const messages = await query
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(limit);

    return messages.reverse(); // Return in chronological order
  },
});

/**
 * Get recent messages (real-time subscription)
 */
export const getRecentMessages = query({
  args: {
    gameId: v.id("games"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    const messages = await ctx.db
      .query("live_chat_messages")
      .withIndex("by_game", (q) => q.eq("game_id", args.gameId))
      .order("desc")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(limit);

    return messages.reverse(); // Return in chronological order
  },
});

/**
 * Moderate a message (admin only)
 */
export const moderateMessage = mutation({
  args: {
    messageId: v.id("live_chat_messages"),
    status: v.union(v.literal("hidden"), v.literal("deleted")),
  },
  handler: async (ctx, args) => {
    // TODO: Add admin auth check
    // const identity = await ctx.auth.getUserIdentity();
    // await requireAdminAuth(ctx, "moderate:chat");

    await ctx.db.patch(args.messageId, {
      status: args.status,
    });

    return args.messageId;
  },
});

/**
 * Restore a moderated message (admin only)
 */
export const restoreMessage = mutation({
  args: { messageId: v.id("live_chat_messages") },
  handler: async (ctx, args) => {
    // TODO: Add admin auth check

    await ctx.db.patch(args.messageId, {
      status: "active",
    });

    return args.messageId;
  },
});

/**
 * Delete a message (hard delete)
 */
export const deleteMessage = mutation({
  args: { messageId: v.id("live_chat_messages") },
  handler: async (ctx, args) => {
    // Get message to verify ownership or admin
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user owns the message
    if (message.user_id !== user._id) {
      // TODO: Check if admin
      throw new Error("Not authorized to delete this message");
    }

    // Soft delete by marking as deleted
    await ctx.db.patch(args.messageId, {
      status: "deleted",
    });

    return args.messageId;
  },
});

/**
 * Get messages by user
 */
export const getMessagesByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    return await ctx.db
      .query("live_chat_messages")
      .withIndex("by_user", (q) => q.eq("user_id", args.userId))
      .order("desc")
      .take(limit);
  },
});

/**
 * Get chat statistics for a game
 */
export const getChatStats = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const allMessages = await ctx.db
      .query("live_chat_messages")
      .withIndex("by_game", (q) => q.eq("game_id", args.gameId))
      .collect();

    const totalMessages = allMessages.length;
    const activeMessages = allMessages.filter((m) => m.status === "active").length;
    const hiddenMessages = allMessages.filter((m) => m.status === "hidden").length;
    const deletedMessages = allMessages.filter((m) => m.status === "deleted").length;

    // Get unique users
    const uniqueUsers = new Set(allMessages.map((m) => m.user_id));

    // Calculate messages per minute (last hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentMessages = allMessages.filter((m) => m.created_at > oneHourAgo);
    const messagesPerMinute = recentMessages.length / 60;

    return {
      totalMessages,
      activeMessages,
      hiddenMessages,
      deletedMessages,
      uniqueUsers: uniqueUsers.size,
      messagesPerMinute: Math.round(messagesPerMinute * 10) / 10,
    };
  },
});

/**
 * Bulk moderate messages (admin only)
 */
export const bulkModerateMessages = mutation({
  args: {
    messageIds: v.array(v.id("live_chat_messages")),
    status: v.union(v.literal("hidden"), v.literal("deleted")),
  },
  handler: async (ctx, args) => {
    // TODO: Add admin auth check

    await Promise.all(
      args.messageIds.map((id) =>
        ctx.db.patch(id, {
          status: args.status,
        })
      )
    );

    return args.messageIds.length;
  },
});
