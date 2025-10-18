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

    // Authorship fields (Story 1.3 - added for VOD admin tracking)
    created_by: v.optional(v.id("users")), // Admin who created
    updated_by: v.optional(v.id("users")), // Last admin who edited
    created_at: v.optional(v.number()),
    updated_at: v.optional(v.number()),

    // Enhanced workflow
    workflow_status: v.optional(v.union(
      v.literal("draft"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("published"),
      v.literal("archived")
    )),
    reviewed_by: v.optional(v.id("users")),
    reviewed_at: v.optional(v.number()),

    // Link to media assets
    media_asset_ids: v.optional(v.array(v.id("media_assets"))),
  })
    .index("by_featured", ["featured"])
    .index("by_trending", ["trending"])
    .index("by_new_release", ["new_release"])
    .index("by_created_by", ["created_by"])
    .index("by_workflow_status", ["workflow_status"])
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
    event_type: v.union(
      v.literal("period_start"),
      v.literal("period_end"),
      v.literal("score"),
      v.literal("timeout"),
      v.literal("substitution"),
      v.literal("penalty"),
      v.literal("turnover"),
      v.literal("rebound"),
      v.literal("foul"),
      v.literal("status_change")
    ),
    period_info: v.optional(v.object({
      period_number: v.number(),
      period_type: v.string(), // "quarter", "set", "inning", "half"
      time_remaining: v.optional(v.string()),
      is_overtime: v.optional(v.boolean())
    })),
    score_info: v.optional(v.object({
      home_score: v.number(),
      away_score: v.number(),
      // Sport-specific scoring details
      details: v.optional(v.object({
        volleyball_sets: v.optional(v.array(v.object({
          home: v.number(), 
          away: v.number()
        }))),
        baseball_inning_scores: v.optional(v.array(v.object({
          inning: v.number(), 
          home: v.number(), 
          away: v.number()
        })))
      }))
    })),
    player_id: v.optional(v.id("players")),
    team_id: v.optional(v.id("teams")),
    description: v.string(),
    timestamp_in_game: v.optional(v.string()), // Keep for backward compatibility
    creation_time: v.number(),
    metadata: v.optional(v.any()) // Flexible for sport-specific data
  }).index("by_game", ["game_id"]),
  // Current live game states for fast queries
  game_states: defineTable({
    game_id: v.id("games"),
    current_period: v.number(),
    period_type: v.string(), // "quarter", "set", "inning", "half"
    period_display: v.string(), // "1st Quarter", "Set 2", "Top 3rd", etc.
    time_left: v.optional(v.string()),
    home_score: v.number(),
    away_score: v.number(),
    detailed_score: v.optional(v.any()), // Sport-specific current scoring
    is_overtime: v.optional(v.boolean()),
    last_updated: v.number()
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
    video_url: v.optional(v.string()),
    hero_image_url: v.optional(v.string()), // Hero carousel background image
    related_content_ids: v.optional(v.array(v.id("content"))),
    broadcast_keys: v.optional(v.array(v.object({ provider: v.string(), key: v.string(), url: v.optional(v.string()) }))),
    quarter: v.optional(v.number()),
    time_left: v.optional(v.string()),
    home_team_lineup: v.optional(v.array(v.id("players"))),
    away_team_lineup: v.optional(v.array(v.id("players"))),
  })
    .index("by_sport", ["sport_id"])
    .index("by_game_date", ["game_date"])
    .index("by_status_and_date", ["status", "game_date"]),

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

  // Media Assets table for VOD upload management
  media_assets: defineTable({
    // Basic info
    title: v.string(),
    description: v.optional(v.string()),

    // File details
    file_type: v.union(v.literal("video"), v.literal("image"), v.literal("audio")),

    // UploadThing integration
    uploadthing_key: v.string(),
    uploadthing_url: v.string(),

    // Video metadata (for videos only)
    duration_seconds: v.optional(v.number()),
    video_width: v.optional(v.number()),
    video_height: v.optional(v.number()),

    // Optional HLS streaming (future)
    hls_playlist_url: v.optional(v.string()),

    // Organization
    folder_path: v.optional(v.string()), // Simple path string: "sports/volleyball/highlights"
    tags: v.array(v.string()),

    // Access control
    status: v.union(
      v.literal("uploading"),
      v.literal("ready"),
      v.literal("failed"),
      v.literal("archived")
    ),

    // Authorship
    uploaded_by: v.id("users"),
    created_at: v.number(),

    // Simple analytics
    view_count: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_uploader", ["uploaded_by"])
    .index("by_type", ["file_type"])
    .searchIndex("search_media", {
      searchField: "title",
      filterFields: ["status", "file_type", "tags"]
    }),

  // Content Audit Log table for change tracking
  content_audit_log: defineTable({
    // What was changed
    entity_type: v.union(v.literal("content"), v.literal("media_asset")),
    entity_id: v.string(), // Use string to support both types

    // Action performed
    action: v.union(
      v.literal("created"),
      v.literal("updated"),
      v.literal("published"),
      v.literal("archived"),
      v.literal("deleted")
    ),

    // Who did it
    user_id: v.id("users"),
    user_email: v.string(),
    user_role: v.string(),

    // What changed (simple JSON)
    changes: v.optional(v.any()), // Store before/after diffs

    // When
    timestamp: v.number(),
  })
    .index("by_entity", ["entity_type", "entity_id"])
    .index("by_user", ["user_id"])
    .index("by_timestamp", ["timestamp"]),

  // User Watch Progress table for Continue Watching feature (Story 1.4)
  user_watch_progress: defineTable({
    user_id: v.id("users"),
    content_id: v.id("content"),

    // Playback state
    position_seconds: v.number(),
    duration_seconds: v.number(),
    completion_percentage: v.number(), // 0-100

    // Real-time updates
    last_watched_at: v.number(),
    device_type: v.optional(v.string()), // "desktop", "mobile", "tablet"

    // Status
    completed: v.boolean(), // true if completion_percentage >= 90
  })
    .index("by_user", ["user_id"])
    .index("by_user_content", ["user_id", "content_id"])
    .index("by_last_watched", ["user_id", "last_watched_at"]),

  // Live Stream Sessions table for real-time viewer tracking (Story 1.4)
  live_stream_sessions: defineTable({
    game_id: v.id("games"),
    user_id: v.optional(v.id("users")), // Anonymous viewers allowed
    session_id: v.string(), // UUID for tracking

    // Real-time presence
    joined_at: v.number(),
    last_heartbeat: v.number(), // Updated every 30s
    active: v.boolean(),

    // Device info
    device_type: v.string(), // "desktop", "mobile", "tablet"
    quality: v.optional(v.string()), // "720p", "1080p"
  })
    .index("by_game_active", ["game_id", "active"])
    .index("by_session", ["session_id"])
    .index("by_heartbeat", ["last_heartbeat"]),

  // Live Chat Messages table for real-time game chat (Story 1.4)
  live_chat_messages: defineTable({
    game_id: v.id("games"),
    user_id: v.id("users"),

    // Message
    message: v.string(),

    // User info (denormalized for speed)
    user_name: v.string(),
    user_avatar: v.optional(v.string()),

    // Moderation
    status: v.union(
      v.literal("active"),
      v.literal("hidden"),
      v.literal("deleted")
    ),

    // Timestamp
    created_at: v.number(),
  })
    .index("by_game", ["game_id", "created_at"])
    .index("by_user", ["user_id"]),

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