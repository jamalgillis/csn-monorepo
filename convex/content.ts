import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get content by ID
export const getContentById = query({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.id);
    
    if (!content || content.status !== "published") {
      return null;
    }
    
    // If it's a show, also get seasons and episodes
    if (content.type === "show") {
      const seasons = await ctx.db
        .query("tv_seasons")
        .withIndex("by_content", (q) => q.eq("content_id", args.id))
        .collect();
      
      const seasonsWithEpisodes = await Promise.all(
        seasons.map(async (season) => {
          const episodes = await ctx.db
            .query("tv_episodes")
            .withIndex("by_season", (q) => q.eq("season_id", season._id))
            .collect();
          
          return {
            ...season,
            episodes: episodes.sort((a, b) => a.episode_number - b.episode_number),
          };
        })
      );
      
      return {
        ...content,
        seasons: seasonsWithEpisodes.sort((a, b) => a.season_number - b.season_number),
      };
    }
    
    return content;
  },
});

// Get content ratings summary (thumbs up percentage and total ratings)
export const getContentRatings = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("content_ratings")
      .withIndex("by_content", (q) => q.eq("content_id", args.contentId))
      .collect();
    
    const upRatings = ratings.filter(r => r.rating === "up").length;
    const downRatings = ratings.filter(r => r.rating === "down").length;
    const totalRatings = ratings.length;
    
    const thumbsUpPercentage = totalRatings > 0 ? Math.round((upRatings / totalRatings) * 100) : 0;
    
    return {
      thumbsUpPercentage,
      totalRatings,
      upRatings,
      downRatings,
    };
  },
});

// Get user's rating for specific content
export const getUserRating = query({
  args: { 
    contentId: v.id("content"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const rating = await ctx.db
      .query("content_ratings")
      .withIndex("by_user_content", (q) => 
        q.eq("user_id", args.userId).eq("content_id", args.contentId)
      )
      .first();
    
    return rating;
  },
});

// Rate content (thumbs up or down)
export const rateContent = mutation({
  args: {
    contentId: v.id("content"),
    userId: v.id("users"),
    rating: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    // Check if content exists
    const content = await ctx.db.get(args.contentId);
    if (!content) {
      throw new ConvexError("Content not found");
    }
    
    // Check if user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError("User not found");
    }
    
    // Check if user has already rated this content
    const existingRating = await ctx.db
      .query("content_ratings")
      .withIndex("by_user_content", (q) => 
        q.eq("user_id", args.userId).eq("content_id", args.contentId)
      )
      .first();
    
    const now = new Date().toISOString();
    
    if (existingRating) {
      // Update existing rating
      await ctx.db.patch(existingRating._id, {
        rating: args.rating,
        updated_at: now,
      });
      return { updated: true, rating: args.rating };
    } else {
      // Create new rating
      const ratingId = await ctx.db.insert("content_ratings", {
        user_id: args.userId,
        content_id: args.contentId,
        rating: args.rating,
        created_at: now,
        updated_at: now,
      });
      return { created: true, rating: args.rating, id: ratingId };
    }
  },
});

// Remove user's rating for content
export const removeRating = mutation({
  args: {
    contentId: v.id("content"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingRating = await ctx.db
      .query("content_ratings")
      .withIndex("by_user_content", (q) =>
        q.eq("user_id", args.userId).eq("content_id", args.contentId)
      )
      .first();

    if (existingRating) {
      await ctx.db.delete(existingRating._id);
      return { removed: true };
    }

    return { removed: false, message: "No rating found to remove" };
  },
});

// ============================================================================
// ADMIN CONTENT MANAGEMENT (Story 1.3 - Enhanced with Authorship)
// ============================================================================

/**
 * Create content with authorship tracking (Admin only)
 */
export const createContentWithAuthorship = mutation({
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
    year: v.number(),
    language: v.optional(v.union(v.literal("English"), v.literal("Spanish"))),
    city: v.optional(v.string()),
    related_team_ids: v.optional(v.array(v.id("teams"))),
    related_player_ids: v.optional(v.array(v.id("players"))),
    media_asset_ids: v.optional(v.array(v.id("media_assets"))),
    workflow_status: v.optional(v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("published"),
      v.literal("archived")
    )),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
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

    const now = Date.now();

    // Create content with authorship
    const contentId = await ctx.db.insert("content", {
      type: args.type,
      title: args.title,
      description: args.description,
      release_date: args.release_date,
      runtime: args.runtime,
      rating: args.rating,
      tags: args.tags,
      tag_names: args.tag_names,
      cast: args.cast,
      director: args.director,
      poster_url: args.poster_url,
      backdrop_url: args.backdrop_url,
      trailer_url: args.trailer_url,
      video_url: args.video_url,
      featured: false,
      trending: false,
      new_release: false,
      status: "draft",
      year: args.year,
      language: args.language,
      city: args.city,
      related_team_ids: args.related_team_ids,
      related_player_ids: args.related_player_ids,
      // Authorship tracking
      created_by: user._id,
      created_at: now,
      updated_by: user._id,
      updated_at: now,
      workflow_status: args.workflow_status || "draft",
      media_asset_ids: args.media_asset_ids,
    });

    return contentId;
  },
});

/**
 * Update content with authorship tracking (Admin only)
 */
export const updateContentWithAuthorship = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    release_date: v.optional(v.string()),
    runtime: v.optional(v.number()),
    rating: v.optional(v.union(
      v.literal("G"),
      v.literal("PG"),
      v.literal("PG-13"),
      v.literal("R"),
      v.literal("NC-17"),
      v.literal("NR")
    )),
    tags: v.optional(v.array(v.id("tags"))),
    tag_names: v.optional(v.array(v.string())),
    cast: v.optional(v.array(v.string())),
    director: v.optional(v.string()),
    poster_url: v.optional(v.string()),
    backdrop_url: v.optional(v.string()),
    trailer_url: v.optional(v.string()),
    video_url: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    trending: v.optional(v.boolean()),
    new_release: v.optional(v.boolean()),
    status: v.optional(v.union(
      v.literal("published"),
      v.literal("draft"),
      v.literal("archived")
    )),
    workflow_status: v.optional(v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("published"),
      v.literal("archived")
    )),
    media_asset_ids: v.optional(v.array(v.id("media_assets"))),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
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

    const { id, ...updates } = args;

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    // Add authorship tracking
    cleanUpdates.updated_by = user._id;
    cleanUpdates.updated_at = Date.now();

    await ctx.db.patch(id, cleanUpdates);

    return id;
  },
});

/**
 * Get content by creator
 */
export const getContentByCreator = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    return await ctx.db
      .query("content")
      .withIndex("by_created_by", (q) => q.eq("created_by", args.userId))
      .order("desc")
      .take(limit);
  },
});

/**
 * Get content by workflow status
 */
export const getContentByWorkflowStatus = query({
  args: {
    workflowStatus: v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("published"),
      v.literal("archived")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    return await ctx.db
      .query("content")
      .withIndex("by_workflow_status", (q) => q.eq("workflow_status", args.workflowStatus))
      .order("desc")
      .take(limit);
  },
});