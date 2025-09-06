import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const migrateContentAddField = mutation({
  args: {
    fieldName: v.string(),
    defaultValue: v.any(),
  },
  handler: async (ctx, args) => {
    // Query all existing content documents
    const contents = await ctx.db.query("content").collect();

    // Track successful and failed updates
    const updates = {
      total: contents.length,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Iterate through documents and add field if not exists
    for (const content of contents) {
      try {
        // Check if the field already exists
        if (!(args.fieldName in content)) {
          // Update the document with the new field
          await ctx.db.patch(content._id, {
            [args.fieldName]: args.defaultValue
          });
          updates.updated++;
        }
      } catch (error) {
        updates.failed++;
        updates.errors.push(`Failed to update document ${content._id}: ${error}`);
      }
    }

    return updates;
  }
});

// Example usage for adding a new field with a default value
export const migrateAddComingSoonField = mutation({
  args: {},
  handler: async (ctx) => {
    // Query all existing content documents
    const contents = await ctx.db.query("content").collect();

    // Track successful and failed updates
    const updates = {
      total: contents.length,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Iterate through documents and add field if not exists
    for (const content of contents) {
      try {
        // Check if the field already exists
        if (!('coming_soon' in content)) {
          // Update the document with the new field
          await ctx.db.patch(content._id, {
            coming_soon: false
          });
          updates.updated++;
        }
      } catch (error) {
        updates.failed++;
        updates.errors.push(`Failed to update document ${content._id}: ${error}`);
      }
    }

    return updates;
  }
});

export const updateContentTypesToNewSchema = mutation({
  args: {},
  handler: async (ctx) => {
    // Query all existing content documents
    const contents = await ctx.db.query("content").collect();

    // Track successful and failed updates
    const updates = {
      total: contents.length,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Iterate through documents and update content types
    for (const content of contents) {
      try {
        let newType = content.type;
        
        // Map old types to new types
        const oldType = content.type as any;
        if (oldType === "tv_show") {
          newType = "show";
        } else if (oldType === "movie") {
          newType = "show"; // Convert movies to shows for sports content
        }
        
        // Update if type needs to change
        if (newType !== content.type) {
          await ctx.db.patch(content._id, {
            type: newType
          });
          updates.updated++;
        }
      } catch (error) {
        updates.failed++;
        updates.errors.push(`Failed to update document ${content._id}: ${error}`);
      }
    }

    return updates;
  }
});

export const clearAllContentData = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all content
    const allContent = await ctx.db.query("content").collect();
    
    let deletedCount = 0;
    
    // Delete all content
    for (const content of allContent) {
      await ctx.db.delete(content._id);
      deletedCount++;
    }
    
    return {
      message: `Cleared ${deletedCount} content items`,
      cleared: deletedCount
    };
  },
});

export const migrateContentToTags = mutation({
  handler: async (ctx) => {
    // 1. Get all documents from the 'content' table.
    const allContent = await ctx.db.query("content").collect();

    let updatedCount = 0;

    // 2. Loop through each document.
    for (const doc of allContent) {
      // Check if the document is missing the new fields.
      if (doc.tags === undefined || doc.tag_names === undefined) {

        // This is the old document from your error message.
        // It has a `genres` field we can try to migrate.
        const oldGenres = (doc as any).genres;

        // 3. Update the document to match the new schema.
        await ctx.db.patch(doc._id, {
          // Set the new fields to an empty array by default.
          tags: [], 
          tag_names: Array.isArray(oldGenres) ? oldGenres : [], // Use old genres data if it exists!
        });
        updatedCount++;
      }
    }
    return `Migration complete. Updated ${updatedCount} documents.`;
  },
});

export const clearTeamsAndGames = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all teams
    const allTeams = await ctx.db.query("teams").collect();
    for (const team of allTeams) {
      await ctx.db.delete(team._id);
    }

    // Delete all games
    const allGames = await ctx.db.query("games").collect();
    for (const game of allGames) {
      await ctx.db.delete(game._id);
    }

    // Delete all sports
    const allSports = await ctx.db.query("sports").collect();
    for (const sport of allSports) {
      await ctx.db.delete(sport._id);
    }

    console.log("Cleared teams, games, and sports");

    return {
      message: "Teams, games, and sports cleared successfully",
      clearedTeams: allTeams.length,
      clearedGames: allGames.length,
      clearedSports: allSports.length
    };
  },
});

export const seedCommunityColleges = mutation({
  args: {},
  handler: async (ctx) => {
    // Create community college teams
    const teams = [
      { name: "Blinn College", slug: "blinn-college", city: "Brenham", state: "TX", league: "NJCAA" },
      { name: "Cisco College", slug: "cisco-college", city: "Cisco", state: "TX", league: "NJCAA" },
      { name: "Dallas College Mountain View", slug: "dallas-college-mountain-view", city: "Dallas", state: "TX", league: "NJCAA" },
      { name: "Weatherford College", slug: "weatherford-college", city: "Weatherford", state: "TX", league: "NJCAA" },
      { name: "Collin College", slug: "collin-college", city: "Plano", state: "TX", league: "NJCAA" },
      { name: "Lee College", slug: "lee-college", city: "Baytown", state: "TX", league: "NJCAA" },
    ];

    // Insert teams
    const teamIds: Record<string, any> = {};
    for (const team of teams) {
      const id = await ctx.db.insert("teams", team);
      teamIds[team.slug] = id;
    }

    console.log("Seeded community college teams");

    // Create basketball sport
    const basketballSport = await ctx.db.insert("sports", {
      name: "Basketball",
      slug: "basketball",
      description: "College basketball games"
    });

    // Create sample live games between colleges
    const sampleGames = [
      {
        home_team_id: teamIds["blinn-college"],
        away_team_id: teamIds["cisco-college"], 
        sport_id: basketballSport,
        game_date: new Date().toISOString(),
        status: "in_progress" as const,
        home_score: 67,
        away_score: 71,
        quarter: 2,
        time_left: "8:45",
        venue: "Blinn College Gymnasium"
      },
      {
        home_team_id: teamIds["collin-college"],
        away_team_id: teamIds["weatherford-college"],
        sport_id: basketballSport, 
        game_date: new Date().toISOString(),
        status: "in_progress" as const,
        home_score: 89,
        away_score: 82,
        quarter: 4,
        time_left: "3:22",
        venue: "Collin College Sports Complex"
      },
      {
        home_team_id: teamIds["lee-college"],
        away_team_id: teamIds["dallas-college-mountain-view"],
        sport_id: basketballSport,
        game_date: new Date().toISOString(),
        status: "in_progress" as const,
        home_score: 58,
        away_score: 61,
        quarter: 3,
        time_left: "12:15",
        venue: "Lee College Arena"
      }
    ];

    for (const game of sampleGames) {
      await ctx.db.insert("games", game);
    }

    console.log("Seeded live games between community colleges");

    return {
      message: "Community colleges seeded successfully",
      teams: teams.length,
      games: sampleGames.length,
      sports: 1
    };
  },
});