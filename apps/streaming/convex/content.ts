import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get featured content for homepage hero
export const getFeaturedContent = query({
  args: {},
  handler: async (ctx) => {
    const featured = await ctx.db
      .query("content")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("status"), "published"))
      .take(5);
    
    return featured;
  },
});

// Get trending content
export const getTrendingContent = query({
  args: {},
  handler: async (ctx) => {
    const trending = await ctx.db
      .query("content")
      .withIndex("by_trending", (q) => q.eq("trending", true))
      .filter((q) => q.eq(q.field("status"), "published"))
      .take(20);
    
    return trending;
  },
});

// Get new releases
export const getNewReleases = query({
  args: {},
  handler: async (ctx) => {
    const newReleases = await ctx.db
      .query("content")
      .withIndex("by_new_release", (q) => q.eq("new_release", true))
      .filter((q) => q.eq(q.field("status"), "published"))
      .take(20);
    
    return newReleases;
  },
});

// Get content by genre
export const getContentByGenre = query({
  args: { genre: v.string() },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    
    // Filter by genre in JavaScript since we can't use array contains in Convex query
    const filteredContent = content.filter(item => 
      item.tag_names.includes(args.genre)
    );
    
    return filteredContent.slice(0, 20);
  },
});

// Get all content with pagination
export const getContent = query({
  args: { 
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("show"), 
      v.literal("podcast"), 
      v.literal("feature"), 
      v.literal("trailer"), 
      v.literal("hype-video"), 
      v.literal("highlight"), 
      v.literal("clip"), 
      v.literal("moment")
    )),
    genre: v.optional(v.string()),
    year: v.optional(v.number()),
    rating: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all content first for filtering
    let allContent = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    
    // Apply filters in JavaScript
    if (args.type) {
      allContent = allContent.filter(item => item.type === args.type);
    }
    
    if (args.genre) {
      allContent = allContent.filter(item => item.tag_names.includes(args.genre!));
    }
    
    if (args.year) {
      allContent = allContent.filter(item => item.year === args.year);
    }
    
    if (args.rating) {
      allContent = allContent.filter(item => item.rating === args.rating);
    }
    
    // Apply pagination
    const limit = args.limit || 24;
    const offset = args.offset || 0;
    const paginatedContent = allContent.slice(offset, offset + limit);
    
    return {
      content: paginatedContent,
      totalCount: allContent.length,
      hasMore: offset + limit < allContent.length,
    };
  },
});

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

// Search content
export const searchContent = query({
  args: { 
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("content")
      .withSearchIndex("search_content", (q) =>
        q.search("title", args.searchTerm)
          .eq("status", "published")
      )
      .take(args.limit || 20);
    
    return results;
  },
});

// Get similar content (simple implementation based on genres)
export const getSimilarContent = query({
  args: { 
    contentId: v.id("content"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const originalContent = await ctx.db.get(args.contentId);
    
    if (!originalContent) {
      return [];
    }
    
    // Get all content and filter by shared genres
    const allContent = await ctx.db
      .query("content")
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "published"),
          q.neq(q.field("_id"), args.contentId) // exclude the original content
        )
      )
      .collect();
    
    // Calculate similarity based on shared genres
    const contentWithSimilarity = allContent.map(content => {
      const sharedGenres = content.tag_names.filter(genre => 
        originalContent.tag_names.includes(genre)
      );
      
      return {
        ...content,
        similarityScore: sharedGenres.length,
      };
    });
    
    // Sort by similarity and return top results
    const similarContent = contentWithSimilarity
      .filter(content => content.similarityScore > 0)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, args.limit || 10);
    
    return similarContent.map(({ similarityScore, ...content }) => content);
  },
});

// Get all genres
export const getGenres = query({
  args: {},
  handler: async (ctx) => {
    // Get all published content
    const content = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    
    // Extract unique tag names (genres)
    const allGenres = content.flatMap(item => item.tag_names);
    const uniqueGenres = [...new Set(allGenres)];
    
    // Return in format compatible with frontend expectations
    return uniqueGenres.map(name => ({
      _id: name.toLowerCase().replace(/\s+/g, '-'), // Use slug as ID
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    }));
  },
});

// Get unique years from content
export const getContentYears = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    
    const years = [...new Set(content.map(item => item.year))].sort((a, b) => b - a);
    return years;
  },
});

// Get content statistics for analytics
export const getContentStats = query({
  args: {},
  handler: async (ctx) => {
    const allContent = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    
    const shows = allContent.filter(item => item.type === "show");
    const podcasts = allContent.filter(item => item.type === "podcast");
    const highlights = allContent.filter(item => item.type === "highlight");
    const clips = allContent.filter(item => item.type === "clip");
    const featured = allContent.filter(item => item.featured);
    const trending = allContent.filter(item => item.trending);
    
    return {
      total: allContent.length,
      shows: shows.length,
      podcasts: podcasts.length,
      highlights: highlights.length,
      clips: clips.length,
      featured: featured.length,
      trending: trending.length,
    };
  },
});

// Add Centex Primetime content
export const addCentexPrimetime = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if Centex Primetime already exists
    const existing = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("title"), "Centex Primetime"))
      .first();
    
    if (existing) {
      return { message: "Centex Primetime already exists", id: existing._id };
    }
    
    // Add Centex Primetime
    const id = await ctx.db.insert("content", {
      type: "show",
      title: "Centex Primetime",
      description: "A flagship sports talk show from Centex Sports Network featuring in-depth interviews with Central Texas coaches, athletes, and sports personalities. The show provides exclusive access to the stories behind local sports, highlighting the passion and dedication of the Central Texas athletic community. From high school standouts to college programs, Centex Primetime delivers compelling sports content that celebrates the heart of Texas athletics.",
      release_date: "2024-01-01",
      runtime: 60,
      rating: "NR",
      tag_names: ["Sports", "Documentary", "Talk Show"],
      tags: [],
      cast: ["Jalen Gillis", "Central Texas Athletes", "Local Coaches"],
      director: "Centex Sports Network",
      poster_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMuzGjEV9rDRudwjaLskETVQpItPhKzM6UY0Jv",
      backdrop_url: "https://q1u9idchx6.ufs.sh/f/kC4KSKx35wVMuzGjEV9rDRudwjaLskETVQpItPhKzM6UY0Jv",
      trailer_url: "https://c.themediacdn.com/embed/media/Wds3gq/iHcrqDlsARM/iFZxVJsWDMb_5",
      video_url: "https://c.themediacdn.com/embed/media/Wds3gq/iHcrqDlsARM/iFZxVJsWDMb_5",
      featured: true,
      trending: true,
      new_release: true,
      coming_soon: false,
      status: "published",
      imdb_rating: 8.5,
      year: 2024,
      language: "English",
    });
    
    return { message: "Centex Primetime added successfully", id };
  },
});

// Update featured status - make only Centex Primetime featured
export const makeCentexPrimetimeOnlyFeatured = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all content
    const allContent = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    
    let updated = 0;
    
    // Update all content to not featured, except Centex Primetime
    for (const content of allContent) {
      if (content.title === "Centex Primetime") {
        // Ensure Centex Primetime is featured
        if (!content.featured) {
          await ctx.db.patch(content._id, { featured: true });
          updated++;
        }
      } else {
        // Set all other content to not featured
        if (content.featured) {
          await ctx.db.patch(content._id, { featured: false });
          updated++;
        }
      }
    }
    
    return { 
      message: `Updated ${updated} content items. Only Centex Primetime is now featured.`,
      updated 
    };
  },
});

// QW-1: Replace Dual Rating System - Rating Functions

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