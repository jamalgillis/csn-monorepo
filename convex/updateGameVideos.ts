import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateGameVideoUrl = mutation({
  args: {
    gameId: v.id("games"),
    videoUrl: v.string(),
  },
  handler: async (ctx, { gameId, videoUrl }) => {
    await ctx.db.patch(gameId, { video_url: videoUrl });
    return { success: true };
  },
});

export const bulkUpdateGameVideoUrls = mutation({
  args: {
    gameIds: v.array(v.id("games")),
    videoUrl: v.string(),
  },
  handler: async (ctx, { gameIds, videoUrl }) => {
    for (const gameId of gameIds) {
      await ctx.db.patch(gameId, { video_url: videoUrl });
    }
    return { success: true, count: gameIds.length };
  },
});
