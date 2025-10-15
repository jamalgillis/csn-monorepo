import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// MEDIA ASSETS CRUD FUNCTIONS
// ============================================================================

/**
 * Create a new media asset
 */
export const createMediaAsset = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    file_type: v.union(v.literal("video"), v.literal("image"), v.literal("audio")),
    uploadthing_key: v.string(),
    uploadthing_url: v.string(),
    duration_seconds: v.optional(v.number()),
    video_width: v.optional(v.number()),
    video_height: v.optional(v.number()),
    hls_playlist_url: v.optional(v.string()),
    folder_path: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create media asset
    const mediaAssetId = await ctx.db.insert("media_assets", {
      title: args.title,
      description: args.description,
      file_type: args.file_type,
      uploadthing_key: args.uploadthing_key,
      uploadthing_url: args.uploadthing_url,
      duration_seconds: args.duration_seconds,
      video_width: args.video_width,
      video_height: args.video_height,
      hls_playlist_url: args.hls_playlist_url,
      folder_path: args.folder_path,
      tags: args.tags,
      status: "uploading",
      uploaded_by: user._id,
      created_at: Date.now(),
      view_count: 0,
    });

    return mediaAssetId;
  },
});

/**
 * Get media asset by ID
 */
export const getMediaAsset = query({
  args: { id: v.id("media_assets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * List media assets with filtering
 */
export const listMediaAssets = query({
  args: {
    status: v.optional(v.union(
      v.literal("uploading"),
      v.literal("ready"),
      v.literal("failed"),
      v.literal("archived")
    )),
    file_type: v.optional(v.union(v.literal("video"), v.literal("image"), v.literal("audio"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("media_assets");

    if (args.status) {
      query = query.withIndex("by_status", (q) => q.eq("status", args.status));
    }

    const results = await query.collect();

    // Filter by file type if specified
    let filtered = results;
    if (args.file_type) {
      filtered = results.filter(asset => asset.file_type === args.file_type);
    }

    // Apply limit if specified
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

/**
 * Search media assets by title
 */
export const searchMediaAssets = query({
  args: {
    searchTerm: v.string(),
    status: v.optional(v.union(
      v.literal("uploading"),
      v.literal("ready"),
      v.literal("failed"),
      v.literal("archived")
    )),
    file_type: v.optional(v.union(v.literal("video"), v.literal("image"), v.literal("audio"))),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("media_assets")
      .withSearchIndex("search_media", (q) => {
        let search = q.search("title", args.searchTerm);

        if (args.status) {
          search = search.eq("status", args.status);
        }

        if (args.file_type) {
          search = search.eq("file_type", args.file_type);
        }

        return search;
      })
      .collect();

    return results;
  },
});

/**
 * Update media asset
 */
export const updateMediaAsset = mutation({
  args: {
    id: v.id("media_assets"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("uploading"),
      v.literal("ready"),
      v.literal("failed"),
      v.literal("archived")
    )),
    duration_seconds: v.optional(v.number()),
    video_width: v.optional(v.number()),
    video_height: v.optional(v.number()),
    hls_playlist_url: v.optional(v.string()),
    folder_path: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, cleanUpdates);

    return id;
  },
});

/**
 * Archive media asset (soft delete)
 */
export const archiveMediaAsset = mutation({
  args: { id: v.id("media_assets") },
  handler: async (ctx, args) => {
    // Get authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      status: "archived",
    });

    return args.id;
  },
});

/**
 * Increment view count
 */
export const incrementViewCount = mutation({
  args: { id: v.id("media_assets") },
  handler: async (ctx, args) => {
    const asset = await ctx.db.get(args.id);
    if (!asset) {
      throw new Error("Media asset not found");
    }

    await ctx.db.patch(args.id, {
      view_count: asset.view_count + 1,
    });

    return asset.view_count + 1;
  },
});

/**
 * Get media assets by uploader
 */
export const getMediaAssetsByUploader = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("media_assets")
      .withIndex("by_uploader", (q) => q.eq("uploaded_by", args.userId))
      .collect();
  },
});
