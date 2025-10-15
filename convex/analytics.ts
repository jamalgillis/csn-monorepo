"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { PostHog } from 'posthog-node';

// Lazy-load PostHog client to avoid initialization errors
let posthog: PostHog | null = null;

function getPostHog(): PostHog {
  if (!posthog) {
    const apiKey = process.env.POSTHOG_API_KEY;
    if (!apiKey) {
      throw new Error("POSTHOG_API_KEY environment variable is not set");
    }

    posthog = new PostHog(apiKey, {
      host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
      flushAt: 20,      // Send batch after 20 events
      flushInterval: 10000, // or every 10 seconds
    });

    // Ensure events are sent before shutdown
    process.on('SIGTERM', async () => {
      if (posthog) {
        await posthog.shutdown();
      }
    });
  }
  return posthog;
}

// ============================================================================
// VIDEO PLAYBACK EVENTS
// ============================================================================

export const trackVideoPlay = action({
  args: {
    videoId: v.id("content"),
    position: v.number(),  // Starting position in seconds
  },
  handler: async (ctx, args) => {
    try {
      // Get user identity (may be null for anonymous)
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        // Skip tracking for anonymous users
        return;
      }

      // Fetch video metadata from Convex
      const video = await ctx.runQuery(api.content.getContentById, {
        id: args.videoId
      });

      if (!video) {
        console.error(`Video not found: ${args.videoId}`);
        return;
      }

      // Send enriched event to PostHog
      getPostHog().capture({
        distinctId: identity.subject,  // User ID
        event: 'video_play',
        properties: {
          // Video details
          video_id: args.videoId,
          video_title: video.title,
          video_type: video.type,
          video_year: video.year,
          video_runtime_minutes: video.runtime,

          // Playback details
          position_seconds: args.position,
          is_resume: args.position > 0,

          // Metadata
          tags: video.tag_names,
          is_premium: !!video.video_url,
          is_featured: video.featured,

          // User context
          user_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      // Log error but don't throw (don't block user action)
      console.error('Failed to track video_play:', error);
    }
  }
});

export const trackVideoPause = action({
  args: {
    videoId: v.id("content"),
    position: v.number(),
    watchDuration: v.number(), // How long they watched in seconds
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const video = await ctx.runQuery(api.content.getContentById, {
        id: args.videoId
      });

      if (!video) {
        console.error(`Video not found: ${args.videoId}`);
        return;
      }

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'video_pause',
        properties: {
          video_id: args.videoId,
          video_title: video.title,
          position_seconds: args.position,
          watch_duration_seconds: args.watchDuration,
          user_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track video_pause:', error);
    }
  }
});

export const trackVideoComplete = action({
  args: {
    videoId: v.id("content"),
    watchDuration: v.number(),
    completionPercentage: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const video = await ctx.runQuery(api.content.getContentById, {
        id: args.videoId
      });

      if (!video) {
        console.error(`Video not found: ${args.videoId}`);
        return;
      }

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'video_complete',
        properties: {
          video_id: args.videoId,
          video_title: video.title,
          watch_duration_seconds: args.watchDuration,
          completion_percentage: args.completionPercentage,
          user_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track video_complete:', error);
    }
  }
});

export const trackVideoSeek = action({
  args: {
    videoId: v.id("content"),
    fromPosition: v.number(),
    toPosition: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const video = await ctx.runQuery(api.content.getContentById, {
        id: args.videoId
      });

      if (!video) {
        console.error(`Video not found: ${args.videoId}`);
        return;
      }

      const seekDirection = args.toPosition > args.fromPosition ? 'forward' : 'backward';

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'video_seek',
        properties: {
          video_id: args.videoId,
          video_title: video.title,
          from_position_seconds: args.fromPosition,
          to_position_seconds: args.toPosition,
          seek_direction: seekDirection,
          user_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track video_seek:', error);
    }
  }
});

// ============================================================================
// CONTENT ENGAGEMENT EVENTS
// ============================================================================

export const trackContentAdded = action({
  args: {
    contentId: v.id("content"),
    addedTo: v.union(v.literal("watchlist"), v.literal("favorites")),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const content = await ctx.runQuery(api.content.getContentById, {
        id: args.contentId
      });

      if (!content) {
        console.error(`Content not found: ${args.contentId}`);
        return;
      }

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'content_added',
        properties: {
          content_id: args.contentId,
          content_title: content.title,
          content_type: content.type,
          added_to: args.addedTo,
          tags: content.tag_names,
          user_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track content_added:', error);
    }
  }
});

export const trackContentRemoved = action({
  args: {
    contentId: v.id("content"),
    removedFrom: v.union(v.literal("watchlist"), v.literal("favorites")),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const content = await ctx.runQuery(api.content.getContentById, {
        id: args.contentId
      });

      if (!content) {
        console.error(`Content not found: ${args.contentId}`);
        return;
      }

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'content_removed',
        properties: {
          content_id: args.contentId,
          content_title: content.title,
          content_type: content.type,
          removed_from: args.removedFrom,
          user_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track content_removed:', error);
    }
  }
});

export const trackContentRate = action({
  args: {
    contentId: v.id("content"),
    rating: v.union(v.literal("up"), v.literal("down")),
    previousRating: v.optional(v.union(v.literal("up"), v.literal("down"))),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const content = await ctx.runQuery(api.content.getContentById, {
        id: args.contentId
      });

      if (!content) {
        console.error(`Content not found: ${args.contentId}`);
        return;
      }

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'content_rated',
        properties: {
          content_id: args.contentId,
          content_title: content.title,
          rating: args.rating,
          previous_rating: args.previousRating || null,
          user_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track content_rated:', error);
    }
  }
});

export const trackContentShare = action({
  args: {
    contentId: v.id("content"),
    shareMethod: v.union(v.literal("copy_link"), v.literal("social")),
    platform: v.optional(v.string()), // "twitter", "facebook", etc.
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const content = await ctx.runQuery(api.content.getContentById, {
        id: args.contentId
      });

      if (!content) {
        console.error(`Content not found: ${args.contentId}`);
        return;
      }

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'content_shared',
        properties: {
          content_id: args.contentId,
          content_title: content.title,
          share_method: args.shareMethod,
          platform: args.platform || null,
          user_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track content_shared:', error);
    }
  }
});

// ============================================================================
// ADMIN OPERATION EVENTS
// ============================================================================

export const trackAdminContentCreate = action({
  args: {
    contentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const content = await ctx.runQuery(api.content.getContentById, {
        id: args.contentId
      });

      if (!content) {
        console.error(`Content not found: ${args.contentId}`);
        return;
      }

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'admin_content_create',
        properties: {
          content_id: args.contentId,
          content_title: content.title,
          content_type: content.type,
          admin_user_id: identity.subject,
          admin_email: identity.email,
          workflow_status: 'draft',
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track admin_content_create:', error);
    }
  }
});

export const trackAdminContentPublish = action({
  args: {
    contentId: v.id("content"),
    timeToPublishHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      const content = await ctx.runQuery(api.content.getContentById, {
        id: args.contentId
      });

      if (!content) {
        console.error(`Content not found: ${args.contentId}`);
        return;
      }

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'admin_content_publish',
        properties: {
          content_id: args.contentId,
          content_title: content.title,
          content_type: content.type,
          admin_user_id: identity.subject,
          admin_email: identity.email,
          time_to_publish_hours: args.timeToPublishHours || null,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track admin_content_publish:', error);
    }
  }
});

export const trackAdminMediaUpload = action({
  args: {
    mediaId: v.id("media_assets"),
    fileType: v.string(),
    fileSizeMb: v.number(),
    durationSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'admin_media_upload',
        properties: {
          media_id: args.mediaId,
          file_type: args.fileType,
          file_size_mb: args.fileSizeMb,
          duration_seconds: args.durationSeconds || null,
          admin_user_id: identity.subject,
          admin_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track admin_media_upload:', error);
    }
  }
});

export const trackAdminGameSchedule = action({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return;

      getPostHog().capture({
        distinctId: identity.subject,
        event: 'admin_game_schedule',
        properties: {
          game_id: args.gameId,
          admin_user_id: identity.subject,
          admin_email: identity.email,
          timestamp: Date.now(),
        }
      });
    } catch (error) {
      console.error('Failed to track admin_game_schedule:', error);
    }
  }
});
