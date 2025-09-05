import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerkId))
      .first();
    
    return user;
  },
});

// Create new user
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerkId))
      .first();
    
    if (existingUser) {
      return existingUser._id;
    }
    
    // Create new user
    const userId = await ctx.db.insert("users", {
      clerk_id: args.clerkId,
      email: args.email,
      name: args.name,
      avatar_url: args.avatarUrl,
      subscription_status: "free",
    });
    
    return userId;
  },
});

// Update user profile
export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", args.clerkId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const updateData: Record<string, any> = {};
    if (args.name !== undefined) updateData.name = args.name;
    if (args.email !== undefined) updateData.email = args.email;
    if (args.avatarUrl !== undefined) updateData.avatar_url = args.avatarUrl;
    
    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(user._id, updateData);
    }
    
    return user._id;
  },
});