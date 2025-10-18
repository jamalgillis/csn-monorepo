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

// Search content and games by title
export const searchContent = query({
  args: { searchText: v.string() },
  handler: async (ctx, args) => {
    if (args.searchText.length < 2) {
      return [];
    }

    // Search published content (shows, podcasts, etc.)
    const contentResults = await ctx.db
      .query("content")
      .withSearchIndex("search_content", (q) =>
        q.search("title", args.searchText)
      )
      .filter((q) => q.eq(q.field("status"), "published"))
      .take(5);

    // Search games by team names
    const allGames = await ctx.db
      .query("games")
      .collect();

    const searchLower = args.searchText.toLowerCase();
    const gameResults = [];

    for (const game of allGames) {
      const homeTeam = await ctx.db.get(game.home_team_id);
      const awayTeam = await ctx.db.get(game.away_team_id);
      const sport = await ctx.db.get(game.sport_id);

      if (homeTeam && awayTeam && sport) {
        const homeTeamName = homeTeam.name.toLowerCase();
        const awayTeamName = awayTeam.name.toLowerCase();
        const sportName = sport.name.toLowerCase();

        if (
          homeTeamName.includes(searchLower) ||
          awayTeamName.includes(searchLower) ||
          sportName.includes(searchLower)
        ) {
          gameResults.push({
            _id: game._id,
            _creationTime: game._creationTime,
            type: "game" as const,
            title: `${awayTeam.name} @ ${homeTeam.name}`,
            description: `${sport.name} - ${game.status}`,
            game_date: game.game_date,
            status: game.status,
            sport: sport.name,
            home_score: game.home_score,
            away_score: game.away_score,
            venue: game.venue,
            poster_url: homeTeam.logo_url || null,
          });

          if (gameResults.length >= 5) break;
        }
      }
    }

    // Combine results (content first, then games)
    return [...contentResults, ...gameResults];
  },
});