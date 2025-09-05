import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query to get published blog posts with pagination
export const getBlogPosts = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { limit = 10, category, featured }) => {
    let query = ctx.db
      .query("blog_posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc");

    if (featured !== undefined) {
      query = query.filter((q) => q.eq(q.field("featured"), featured));
    }

    if (category) {
      const categoryDoc = await ctx.db
        .query("blog_categories")
        .withIndex("by_slug", (q) => q.eq("slug", category))
        .first();
      
      if (categoryDoc) {
        query = query.filter((q) => q.eq(q.field("category_id"), categoryDoc._id));
      }
    }

    const posts = await query.take(limit);

    // Get author information and category for each post
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.author_id);
        const category = post.category_id ? await ctx.db.get(post.category_id) : null;
        const tags = await Promise.all(
          post.tags.map(tagId => ctx.db.get(tagId))
        );

        return {
          ...post,
          author: author ? {
            id: author._id,
            name: author.name,
            avatar_url: author.avatar_url,
          } : null,
          category: category ? {
            id: category._id,
            name: category.name,
            slug: category.slug,
            color: category.color,
          } : null,
          tags: tags.filter(tag => tag !== null).map(tag => ({
            id: tag!._id,
            name: tag!.name,
            slug: tag!.slug,
          })),
        };
      })
    );

    return postsWithDetails;
  },
});

// Query to get a single blog post by slug
export const getBlogPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("blog_posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!post || post.status !== "published") {
      return null;
    }

    // Get author information and category
    const author = await ctx.db.get(post.author_id);
    const category = post.category_id ? await ctx.db.get(post.category_id) : null;
    const tags = await Promise.all(
      post.tags.map(tagId => ctx.db.get(tagId))
    );

    // View count increment moved to a separate mutation

    return {
      ...post,
      author: author ? {
        id: author._id,
        name: author.name,
        avatar_url: author.avatar_url,
      } : null,
      category: category ? {
        id: category._id,
        name: category.name,
        slug: category.slug,
        color: category.color,
      } : null,
      tags: tags.filter(tag => tag !== null).map(tag => ({
        id: tag!._id,
        name: tag!.name,
        slug: tag!.slug,
      })),
    };
  },
});

// Query to search blog posts
export const searchBlogPosts = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { searchTerm, limit = 10 }) => {
    const results = await ctx.db
      .query("blog_posts")
      .withSearchIndex("search_blog_posts", (q) =>
        q.search("title", searchTerm).eq("status", "published")
      )
      .take(limit);

    // Get author information for each post
    const postsWithDetails = await Promise.all(
      results.map(async (post) => {
        const author = await ctx.db.get(post.author_id);
        const category = post.category_id ? await ctx.db.get(post.category_id) : null;
        const tags = await Promise.all(
          post.tags.map(tagId => ctx.db.get(tagId))
        );

        return {
          ...post,
          author: author ? {
            id: author._id,
            name: author.name,
            avatar_url: author.avatar_url,
          } : null,
          category: category ? {
            id: category._id,
            name: category.name,
            slug: category.slug,
          } : null,
          tags: tags.filter(tag => tag !== null).map(tag => ({
            id: tag!._id,
            name: tag!.name,
            slug: tag!.slug,
          })),
        };
      })
    );

    return postsWithDetails;
  },
});

// Query to get blog categories
export const getBlogCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blog_categories")
      .withIndex("by_post_count")
      .order("desc")
      .collect();
  },
});

// Query to get blog tags
export const getBlogTags = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    return await ctx.db
      .query("blog_tags")
      .withIndex("by_post_count")
      .order("desc")
      .take(limit);
  },
});

// Mutation to create a new blog post (admin only)
export const createBlogPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    featured_image: v.optional(v.string()),
    category_id: v.optional(v.id("blog_categories")),
    tags: v.array(v.id("blog_tags")),
    status: v.union(v.literal("draft"), v.literal("published")),
    featured: v.optional(v.boolean()),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    read_time: v.number(),
  },
  handler: async (ctx, args) => {
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

    // Check if user is admin (for now, just check if user exists)
    // TODO: Add proper role-based access control

    const now = new Date().toISOString();

    return await ctx.db.insert("blog_posts", {
      ...args,
      author_id: user._id,
      featured: args.featured ?? false,
      view_count: 0,
      published_at: args.status === "published" ? now : undefined,
      created_at: now,
      updated_at: now,
    });
  },
});

// Mutation to update a blog post
export const updateBlogPost = mutation({
  args: {
    id: v.id("blog_posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    featured_image: v.optional(v.string()),
    category_id: v.optional(v.id("blog_categories")),
    tags: v.optional(v.array(v.id("blog_tags"))),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
    featured: v.optional(v.boolean()),
    meta_title: v.optional(v.string()),
    meta_description: v.optional(v.string()),
    read_time: v.optional(v.number()),
    published_at: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingPost = await ctx.db.get(id);
    if (!existingPost) {
      throw new Error("Blog post not found");
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerk_id", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is the author or admin
    if (existingPost.author_id !== user._id) {
      throw new Error("Not authorized to edit this post");
    }

    const now = new Date().toISOString();
    const updateData = {
      ...updates,
      updated_at: now,
    };

    // If status is changing to published and it wasn't published before
    if (updates.status === "published" && existingPost.status !== "published") {
      updateData.published_at = now;
    }

    return await ctx.db.patch(id, updateData);
  },
});

// Mutation to create or update a blog category
export const upsertBlogCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if category with this slug already exists
    const existingCategory = await ctx.db
      .query("blog_categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingCategory) {
      // Update existing category
      return await ctx.db.patch(existingCategory._id, args);
    } else {
      // Create new category
      return await ctx.db.insert("blog_categories", {
        ...args,
        post_count: 0,
      });
    }
  },
});

// Mutation to create or update a blog tag
export const upsertBlogTag = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if tag with this slug already exists
    const existingTag = await ctx.db
      .query("blog_tags")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingTag) {
      // Update existing tag
      return await ctx.db.patch(existingTag._id, args);
    } else {
      // Create new tag
      return await ctx.db.insert("blog_tags", {
        ...args,
        post_count: 0,
      });
    }
  },
});

// Mutation to increment blog post view count
export const incrementBlogPostViewCount = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("blog_posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!post) {
      throw new Error("Blog post not found");
    }

    await ctx.db.patch(post._id, {
      view_count: (post.view_count || 0) + 1,
    });

    return { success: true };
  },
});