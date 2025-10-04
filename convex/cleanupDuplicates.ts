import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const removeDuplicateGames = mutation({
  args: {},
  handler: async (ctx) => {
    const allGames = await ctx.db.query("games").collect();

    // Group games by unique key: home_team + away_team + game_date + sport
    const gameMap = new Map<string, any[]>();

    for (const game of allGames) {
      const key = `${game.home_team_id}-${game.away_team_id}-${game.game_date}-${game.sport_id}`;
      if (!gameMap.has(key)) {
        gameMap.set(key, []);
      }
      gameMap.get(key)!.push(game);
    }

    // Find duplicates and delete all but the most recent (by _creationTime)
    let deletedCount = 0;
    const duplicateGroups = [];

    for (const [key, games] of gameMap.entries()) {
      if (games.length > 1) {
        // Sort by creation time, keep the newest
        const sortedGames = games.sort((a, b) => b._creationTime - a._creationTime);
        const toKeep = sortedGames[0];
        const toDelete = sortedGames.slice(1);

        duplicateGroups.push({
          key,
          kept: toKeep._id,
          deleted: toDelete.map(g => g._id),
          count: toDelete.length
        });

        // Delete the older duplicates
        for (const game of toDelete) {
          await ctx.db.delete(game._id);
          deletedCount++;
        }
      }
    }

    return {
      success: true,
      deletedCount,
      duplicateGroups,
      totalGames: allGames.length,
      remainingGames: allGames.length - deletedCount
    };
  },
});
