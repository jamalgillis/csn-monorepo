import { query } from "./_generated/server";

// Get all content for debugging purposes
export const getAllContent = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db.query("content").collect();
    return content;
  },
});