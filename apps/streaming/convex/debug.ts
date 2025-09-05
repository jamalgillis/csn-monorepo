import { query } from "./_generated/server";

export const getAllContent = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db.query("content").collect();
    console.log("All content in database:", content.length, "items");
    content.forEach(item => {
      console.log(`- ${item.title} (${item.type})`);
    });
    return content;
  },
});

export const getTVShows = query({
  args: {},
  handler: async (ctx) => {
    const tvShows = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("type"), "tv_show"))
      .collect();
    console.log("TV Shows in database:", tvShows.length);
    tvShows.forEach(show => {
      console.log(`- ${show.title} (status: ${show.status})`);
    });
    return tvShows;
  },
});