import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper function to get or create user
async function getOrCreateUser(ctx: any, clerkId: string) {
  let user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q: any) => q.eq("clerk_id", clerkId))
    .first();

  if (!user) {
    // Create user if doesn't exist
    const identity = await ctx.auth.getUserIdentity();
    user = await ctx.db.insert("users", {
      clerk_id: clerkId,
      email: identity?.email || "",
      name: identity?.name || null,
      avatar_url: identity?.pictureUrl || null,
      subscription_status: "free",
      subscription_plan: null,
      subscription_start: null,
      subscription_end: null,
      preferences: null,
    });
    
    // Return the inserted user
    return await ctx.db.get(user);
  }

  return user;
}

// Add content to user's watchlist
export const addToWatchlist = mutation({
  args: { 
    contentId: v.id("content") 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    // Get or create user
    const user = await getOrCreateUser(ctx, identity.subject);
    if (!user) {
      throw new Error("Unable to create user");
    }

    // Check if content exists
    const content = await ctx.db.get(args.contentId);
    if (!content) {
      throw new Error("This content is no longer available");
    }

    // Check if already in watchlist (prevent duplicates)
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_content", (q: any) => 
        q.eq("user_id", user._id).eq("content_id", args.contentId)
      )
      .first();

    if (existing) {
      // Already in watchlist, return success
      return { success: true, message: "Already in watchlist" };
    }

    // Get current max position for ordering (use timestamp-like approach)
    const maxPosition = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q: any) => q.eq("user_id", user._id))
      .collect()
      .then(items => 
        items.length > 0 ? Math.max(...items.map(item => item.position)) : 0
      );

    // Add to watchlist with incremented position
    await ctx.db.insert("watchlist", {
      user_id: user._id,
      content_id: args.contentId,
      position: maxPosition + 1, // Higher position = more recent
    });

    return { success: true, message: "Added to watchlist" };
  },
});

// Remove content from user's watchlist
export const removeFromWatchlist = mutation({
  args: { 
    contentId: v.id("content") 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerk_id", identity.subject))
      .first();

    if (!user) {
      // User doesn't exist, nothing to remove
      return { success: true, message: "Removed from watchlist" };
    }

    // Find watchlist item
    const watchlistItem = await ctx.db
      .query("watchlist")
      .withIndex("by_user_content", (q: any) => 
        q.eq("user_id", user._id).eq("content_id", args.contentId)
      )
      .first();

    if (watchlistItem) {
      await ctx.db.delete(watchlistItem._id);
    }

    // Always return success (graceful handling of non-existent items)
    return { success: true, message: "Removed from watchlist" };
  },
});

// Get user's complete watchlist with content details
export const getUserWatchlist = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return []; // Return empty array for unauthenticated users
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerk_id", identity.subject))
      .first();

    if (!user) {
      return []; // Return empty array if user doesn't exist
    }

    // Get watchlist items ordered by position (most recent first)
    const watchlistItems = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q: any) => q.eq("user_id", user._id))
      .collect();

    // Sort by position descending (most recent first)
    watchlistItems.sort((a, b) => b.position - a.position);

    // Get content details for each item
    const watchlistWithContent = await Promise.all(
      watchlistItems.map(async (item) => {
        const content = await ctx.db.get(item.content_id);
        return {
          watchlistId: item._id,
          position: item.position,
          content: content,
          addedAt: item.position, // Using position as timestamp proxy
        };
      })
    );

    // Filter out any items where content was deleted
    return watchlistWithContent.filter(item => item.content !== null);
  },
});

// Check if specific content is in user's watchlist
export const isInWatchlist = query({
  args: { 
    contentId: v.id("content") 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false; // Return false for unauthenticated users
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerk_id", identity.subject))
      .first();

    if (!user) {
      return false; // Return false if user doesn't exist
    }

    // Check if item exists in watchlist
    const watchlistItem = await ctx.db
      .query("watchlist")
      .withIndex("by_user_content", (q: any) => 
        q.eq("user_id", user._id).eq("content_id", args.contentId)
      )
      .first();

    return watchlistItem !== null;
  },
});

// Get watchlist status for multiple content items (for efficient batch checking)
export const getWatchlistStatuses = query({
  args: {
    contentIds: v.array(v.id("content"))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // Return all false for unauthenticated users
      return args.contentIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q: any) => q.eq("clerk_id", identity.subject))
      .first();

    if (!user) {
      // Return all false if user doesn't exist
      return args.contentIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
    }

    // Get all watchlist items for this user
    const watchlistItems = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q: any) => q.eq("user_id", user._id))
      .collect();

    // Create a set of content IDs in watchlist for fast lookup
    const watchlistContentIds = new Set(watchlistItems.map(item => item.content_id));

    // Return status for each requested content ID
    return args.contentIds.reduce((acc, contentId) => ({
      ...acc,
      [contentId]: watchlistContentIds.has(contentId)
    }), {});
  },
});