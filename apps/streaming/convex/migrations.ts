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