import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Content table for sports streaming content
  content: defineTable({
    type: v.union(
      v.literal("show"), 
      v.literal("podcast"), 
      v.literal("feature"), 
      v.literal("trailer"), 
      v.literal("hype-video"), 
      v.literal("highlight"), 
      v.literal("clip"), 
      v.literal("moment")
    ),
    title: v.string(),
    description: v.string(),
    release_date: v.string(), // ISO date string
    runtime: v.number(), // minutes
    rating: v.union(
      v.literal("G"),
      v.literal("PG"),
      v.literal("PG-13"),
      v.literal("R"),
      v.literal("NC-17"),
      v.literal("NR")
    ),
    tags: v.array(v.id("tags")),
    tag_names: v.array(v.string()),
    cast: v.array(v.string()),
    director: v.optional(v.string()),
    poster_url: v.string(),
    backdrop_url: v.string(),
    trailer_url: v.optional(v.string()),
    video_url: v.optional(v.string()), // for premium content
    featured: v.boolean(),
    trending: v.boolean(),
    new_release: v.boolean(),
    coming_soon: v.optional(v.boolean()),
    status: v.union(
      v.literal("published"),
      v.literal("draft"),
      v.literal("archived")
    ),
    imdb_rating: v.optional(v.number()),
    year: v.number(),
    language: v.optional(v.union(v.literal("English"), v.literal("Spanish"))),
    city: v.optional(v.string()),
    related_team_ids: v.optional(v.array(v.id("teams"))),
    related_player_ids: v.optional(v.array(v.id("players"))),
  })
    .index("by_featured", ["featured"])
    .index("by_trending", ["trending"])
    .index("by_new_release", ["new_release"])
    .searchIndex("search_content", { searchField: "title", filterFields: ["type", "status", "tag_names", "year", "rating"] }),
  
  // Tags table with a 'group' for classification.
  tags: defineTable({
    name: v.string(),
    slug: v.string(),
    group: v.union(v.literal("Format"), v.literal("Sport"), v.literal("Level")),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // A dedicated table for sports.
  sports: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon_url: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // A join table to link teams and sports in a many-to-many relationship.
  team_sports: defineTable({
    team_id: v.id("teams"),
    sport_id: v.id("sports"),
  })
    .index("by_team", ["team_id"])
    .index("by_sport", ["sport_id"])
    .index("by_team_sport", ["team_id", "sport_id"]),
  
  // A join table for sport-specific player info.
  player_sports: defineTable({
    player_id: v.id("players"),
    sport_id: v.id("sports"),
    sport_specific_key: v.string(),
    position: v.optional(v.string()),
    jersey_number: v.optional(v.number()),
  })
    .index("by_player_sport", ["player_id", "sport_id"]),

  // For the live game play-by-play timeline.
  game_events: defineTable({
    game_id: v.id("games"),
    player_id: v.optional(v.id("players")),
    team_id: v.id("teams"),
    event_type: v.union(v.literal("score"), v.literal("turnover"), v.literal("rebound"), v.literal("foul"), v.literal("timeout")),
    description: v.string(),
    timestamp_in_game: v.string(),
    creation_time: v.number(),
  }).index("by_game", ["game_id"]),

  // For the player profile statistics dashboard.
  player_season_stats: defineTable({
    player_id: v.id("players"),
    season: v.string(), // e.g., "2023-24"
    games_played: v.number(),
    points_per_game: v.number(),
    rebounds_per_game: v.number(),
    assists_per_game: v.number(),
    field_goal_percentage: v.number(),
  }).index("by_player", ["player_id"]),

  // For the player profile career timeline.
  player_milestones: defineTable({
    player_id: v.id("players"),
    year: v.number(),
    title: v.string(),
    description: v.string(),
    badge_text: v.optional(v.string()),
  }).index("by_player", ["player_id"]),

  // Teams table.
  teams: defineTable({
    name: v.string(),
    slug: v.string(),
    league: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
  }).index("by_slug", ["slug"]),

  // Games table with live state fields.
  games: defineTable({
    home_team_id: v.id("teams"),
    away_team_id: v.id("teams"),
    sport_id: v.id("sports"),
    game_date: v.string(),
    status: v.union(v.literal("scheduled"), v.literal("in_progress"), v.literal("final"), v.literal("postponed")),
    home_score: v.optional(v.number()),
    away_score: v.optional(v.number()),
    venue: v.optional(v.string()),
    related_content_ids: v.optional(v.array(v.id("content"))),
    broadcast_keys: v.optional(v.array(v.object({ provider: v.string(), key: v.string(), url: v.optional(v.string()) }))),
    quarter: v.optional(v.number()),
    time_left: v.optional(v.string()),
    home_team_lineup: v.optional(v.array(v.id("players"))),
    away_team_lineup: v.optional(v.array(v.id("players"))),
  }).index("by_sport", ["sport_id"]),

  // Players table with denormalized career stats.
  players: defineTable({
    full_name: v.string(),
    team_id: v.id("teams"),
    photo_url: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("injured")),
    career_stats: v.optional(v.object({
      points: v.number(),
      rebounds: v.number(),
      assists: v.number(),
      championships: v.number(),
    })),
  }).index("by_team", ["team_id"]),

  // TV Show specific tables
  tv_seasons: defineTable({
    content_id: v.id("content"),
    season_number: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    episode_count: v.number(),
    release_date: v.optional(v.string()),
    poster_url: v.optional(v.string()),
  })
    .index("by_content", ["content_id"])
    .index("by_content_season", ["content_id", "season_number"]),

  tv_episodes: defineTable({
    season_id: v.id("tv_seasons"),
    content_id: v.id("content"), // for easier querying
    episode_number: v.number(),
    title: v.string(),
    description: v.string(),
    runtime: v.number(), // minutes
    air_date: v.optional(v.string()),
    video_url: v.optional(v.string()),
    thumbnail_url: v.optional(v.string()),
    still_url: v.optional(v.string()),
  })
    .index("by_season", ["season_id"])
    .index("by_content", ["content_id"])
    .index("by_season_episode", ["season_id", "episode_number"]),

  // Users table with added bio fields for hosts/authors.
  users: defineTable({
    clerk_id: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    subscription_status: v.union(v.literal("free"), v.literal("active"), v.literal("canceled"), v.literal("expired")),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    social_links: v.optional(v.object({
      twitter: v.optional(v.string()),
      linkedin: v.optional(v.string()),
    })),
  }).index("by_clerk_id", ["clerk_id"]),

  // Blog related tables.
  blog_posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    featured_image: v.optional(v.string()),
    author_id: v.id("users"),
    category_id: v.optional(v.id("blog_categories")),
    tags: v.array(v.id("blog_tags")),
    category_name: v.optional(v.string()),
    tag_names: v.optional(v.array(v.string())),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    featured: v.boolean(),
    read_time: v.number(),
    view_count: v.number(),
    published_at: v.optional(v.string()),
    updated_at: v.string(),
    created_at: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .searchIndex("search_blog_posts", { searchField: "title", filterFields: ["status", "featured"] }),

  blog_categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    post_count: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_post_count", ["post_count"]),
    
  blog_tags: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    post_count: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_post_count", ["post_count"]),

  // ++ MISSING TABLE ADDED: For the comments section.
  blog_comments: defineTable({
    post_id: v.id("blog_posts"),
    author_id: v.id("users"),
    content: v.string(),
    parent_id: v.optional(v.id("blog_comments")), // for threaded replies
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("spam")),
    created_at: v.string(),
  }).index("by_post", ["post_id"]),

  // ++ MISSING TABLE ADDED: For the newsletter signup forms.
  blog_subscribers: defineTable({
    email: v.string(),
    status: v.union(v.literal("active"), v.literal("unsubscribed")),
    subscribed_at: v.string(),
  }).index("by_email", ["email"]),
  
  // User interaction tables.
  watchlist: defineTable({
    user_id: v.id("users"),
    content_id: v.id("content"),
    position: v.number(),
  })
    .index("by_user_content", ["user_id", "content_id"])
    .index("by_user", ["user_id"]),
  
  content_ratings: defineTable({
    user_id: v.id("users"),
    content_id: v.id("content"),
    rating: v.union(v.literal("up"), v.literal("down")),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_user_content", ["user_id", "content_id"])
    .index("by_content", ["content_id"]),
});