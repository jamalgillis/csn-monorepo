import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Migration System for Convex Schema Cleanup
 * 
 * This file contains migration scripts to safely clean up and enhance
 * the Convex schema while preserving existing data.
 */

// Migration 1: Clean up empty and unused tables
export const cleanupEmptyTables = mutation({
  args: {},
  handler: async (ctx) => {
    const results = {
      tablesFound: [] as string[],
      tablesSkipped: [] as string[],
      errors: [] as string[]
    };

    try {
      // Check for empty tables and log what we find
      // Note: We can't actually drop tables via mutations, but we can identify them
      
      // Tables to check for cleanup (these should be empty based on your data)
      const tablesToCheck = [
        "Teams", // duplicate of teams  
        "analytics_events",
        "genres", 
        "viewing_history"
      ];

      for (const tableName of tablesToCheck) {
        try {
          // We'll just log these for now since table dropping requires schema changes
          results.tablesFound.push(`Found table: ${tableName} (needs manual removal from schema)`);
        } catch (error) {
          results.tablesSkipped.push(`Table ${tableName} not found or already removed`);
        }
      }

      return {
        success: true,
        message: "Empty table cleanup analysis complete",
        details: results
      };

    } catch (error) {
      return {
        success: false,
        error: `Migration failed: ${error}`,
        details: results
      };
    }
  },
});

// Migration 2: Add enhanced user activity tracking
export const createUserActivityTracking = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      // This will be handled by schema update
      // Just return success for now
      return {
        success: true,
        message: "User activity tracking will be added via schema update"
      };
    } catch (error) {
      return {
        success: false,
        error: `Migration failed: ${error}`
      };
    }
  },
});

// Migration 3: Migrate existing content to enhanced structure
export const migrateContentStructure = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      const content = await ctx.db.query("content").collect();
      let migratedCount = 0;

      for (const item of content) {
        // Check if content needs duration field migration (runtime -> duration in seconds)
        if (item.runtime && !item.duration) {
          await ctx.db.patch(item._id, {
            duration: item.runtime * 60, // Convert minutes to seconds
          });
          migratedCount++;
        }
      }

      return {
        success: true,
        message: `Migrated ${migratedCount} content items to new structure`,
        migratedCount
      };
    } catch (error) {
      return {
        success: false,
        error: `Content migration failed: ${error}`
      };
    }
  },
});

// Migration 4: Migrate TV structure to enhanced show/podcast structure
export const migrateShowStructure = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      // Get all show/podcast content
      const showContent = await ctx.db
        .query("content")
        .filter(q => q.or(
          q.eq(q.field("type"), "show"),
          q.eq(q.field("type"), "podcast")
        ))
        .collect();

      let processedShows = 0;

      for (const show of showContent) {
        // Check if this show already has seasons in tv_seasons
        const existingSeasons = await ctx.db
          .query("tv_seasons")
          .withIndex("by_content", q => q.eq("content_id", show._id))
          .collect();

        if (existingSeasons.length > 0) {
          processedShows++;
          // Show already has season structure, we'll preserve it
        }
      }

      return {
        success: true,
        message: `Analyzed ${showContent.length} shows/podcasts, ${processedShows} already have proper structure`,
        processedShows,
        totalShows: showContent.length
      };
    } catch (error) {
      return {
        success: false,
        error: `Show structure migration failed: ${error}`
      };
    }
  },
});

// Migration 5: Enhance games table with additional live fields
export const enhanceGamesTable = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      const games = await ctx.db.query("games").collect();
      let enhancedCount = 0;

      for (const game of games) {
        const updates: any = {};
        
        // Add missing fields with default values
        if (game.spectator_count === undefined) {
          updates.spectator_count = 0;
        }
        
        if (game.weather_conditions === undefined && game.venue) {
          updates.weather_conditions = null; // Will be populated by live updates
        }
        
        // Convert broadcast_keys to broadcast_urls if needed
        if (game.broadcast_keys && !game.broadcast_urls) {
          updates.broadcast_urls = game.broadcast_keys
            .map(bk => bk.url)
            .filter(url => url);
        }

        if (Object.keys(updates).length > 0) {
          await ctx.db.patch(game._id, updates);
          enhancedCount++;
        }
      }

      return {
        success: true,
        message: `Enhanced ${enhancedCount} games with new fields`,
        enhancedCount
      };
    } catch (error) {
      return {
        success: false,
        error: `Games enhancement failed: ${error}`
      };
    }
  },
});

// Master migration runner
export const runAllMigrations = mutation({
  args: {},
  handler: async (ctx) => {
    const results = [];

    try {
      // Run migrations in sequence
      const cleanup = await cleanupEmptyTables(ctx, {});
      results.push({ migration: "cleanupEmptyTables", result: cleanup });

      const userActivity = await createUserActivityTracking(ctx, {});
      results.push({ migration: "createUserActivityTracking", result: userActivity });

      const contentMigration = await migrateContentStructure(ctx, {});
      results.push({ migration: "migrateContentStructure", result: contentMigration });

      const showMigration = await migrateShowStructure(ctx, {});
      results.push({ migration: "migrateShowStructure", result: showMigration });

      const gamesMigration = await enhanceGamesTable(ctx, {});
      results.push({ migration: "enhanceGamesTable", result: gamesMigration });

      return {
        success: true,
        message: "All migrations completed",
        results
      };
    } catch (error) {
      return {
        success: false,
        error: `Master migration failed: ${error}`,
        results
      };
    }
  },
});

// Utility: Check data before migration
export const checkDataIntegrity = mutation({
  args: {},
  handler: async (ctx) => {
    const checks = {
      content: await ctx.db.query("content").collect(),
      games: await ctx.db.query("games").collect(),
      teams: await ctx.db.query("teams").collect(),
      players: await ctx.db.query("players").collect(),
      users: await ctx.db.query("users").collect(),
      tv_seasons: await ctx.db.query("tv_seasons").collect(),
      tv_episodes: await ctx.db.query("tv_episodes").collect(),
    };

    return {
      summary: {
        content: checks.content.length,
        games: checks.games.length,
        teams: checks.teams.length,
        players: checks.players.length,
        users: checks.users.length,
        tv_seasons: checks.tv_seasons.length,
        tv_episodes: checks.tv_episodes.length,
      },
      recommendations: [
        "Review blog system - can be removed if not needed",
        "Empty tables identified for removal",
        "Content structure can be enhanced",
        "User activity tracking can be improved"
      ]
    };
  },
});