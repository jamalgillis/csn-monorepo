import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Enhanced Convex Schema for Sports Content Platform
 * 
 * This schema focuses on your core requirements:
 * - Game data tracking
 * - Player & team data  
 * - Video & picture content
 * - Shows/podcasts with seasons and episodes
 * - User activity tracking
 * 
 * Removed unused tables and optimized for performance.
 */

export default defineSchema({
  // ===== CORE SPORTS TABLES =====
  
  // Enhanced sports table
  sports: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon_url: v.optional(v.string()),
    // New fields for better organization
    is_active: v.optional(v.boolean()),
    season_format: v.optional(v.string()), // "quarters", "sets", "periods", etc.
    default_game_duration: v.optional(v.number()), // minutes
  }).index("by_slug", ["slug"])
    .index("by_active", ["is_active"]),

  // Enhanced teams table
  teams: defineTable({
    name: v.string(),
    slug: v.string(),
    league: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    // New fields
    conference: v.optional(v.string()),
    division: v.optional(v.string()),
    founded_year: v.optional(v.number()),
    colors: v.optional(v.object({
      primary: v.string(),
      secondary: v.optional(v.string()),
    })),
    social_links: v.optional(v.object({
      website: v.optional(v.string()),
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
    })),
    is_active: v.optional(v.boolean()),
  }).index("by_slug", ["slug"])
    .index("by_league", ["league"])
    .index("by_active", ["is_active"]),

  // Enhanced players table
  players: defineTable({
    full_name: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    team_id: v.id("teams"),
    photo_url: v.optional(v.string()),
    status: v.union(
      v.literal("active"), 
      v.literal("inactive"), 
      v.literal("injured"),
      v.literal("suspended"),
      v.literal("retired")
    ),
    // Enhanced career stats
    career_stats: v.optional(v.object({
      points: v.number(),
      rebounds: v.number(),
      assists: v.number(),
      championships: v.number(),
      games_played: v.optional(v.number()),
      years_pro: v.optional(v.number()),
    })),
    // New fields
    jersey_number: v.optional(v.number()),
    position: v.optional(v.string()),
    height: v.optional(v.string()),
    weight: v.optional(v.string()),
    birthdate: v.optional(v.string()),
    hometown: v.optional(v.string()),
    bio: v.optional(v.string()),
  }).index("by_team", ["team_id"])
    .index("by_status", ["status"])
    .searchIndex("search_players", { 
      searchField: "full_name", 
      filterFields: ["status", "position"] 
    }),

  // Enhanced games table with live update capabilities
  games: defineTable({
    home_team_id: v.id("teams"),
    away_team_id: v.id("teams"),
    sport_id: v.id("sports"),
    game_date: v.string(), // ISO string
    scheduled_start_time: v.optional(v.string()),
    actual_start_time: v.optional(v.string()),
    status: v.union(
      v.literal("scheduled"), 
      v.literal("in_progress"), 
      v.literal("final"), 
      v.literal("postponed"),
      v.literal("cancelled"),
      v.literal("suspended")
    ),
    
    // Live scoring
    home_score: v.optional(v.number()),
    away_score: v.optional(v.number()),
    current_period: v.optional(v.number()),
    period_type: v.optional(v.string()), // "quarter", "set", "inning", "half"
    time_left: v.optional(v.string()),
    is_overtime: v.optional(v.boolean()),
    
    // Enhanced live features
    venue: v.optional(v.string()),
    attendance: v.optional(v.number()),
    weather_conditions: v.optional(v.string()),
    temperature: v.optional(v.number()),
    
    // Media & Broadcasting
    live_stream_url: v.optional(v.string()),
    replay_url: v.optional(v.string()),
    broadcast_urls: v.optional(v.array(v.string())),
    broadcast_info: v.optional(v.array(v.object({
      provider: v.string(),
      channel: v.optional(v.string()),
      url: v.optional(v.string()),
      is_free: v.optional(v.boolean()),
    }))),
    
    // Relationships
    related_content_ids: v.optional(v.array(v.id("content"))),
    home_team_lineup: v.optional(v.array(v.id("players"))),
    away_team_lineup: v.optional(v.array(v.id("players"))),
    
    // Metadata
    season: v.optional(v.string()),
    week: v.optional(v.number()),
    is_playoff: v.optional(v.boolean()),
    importance_level: v.optional(v.union(
      v.literal("regular"),
      v.literal("important"), 
      v.literal("championship")
    )),
    
    // Analytics
    estimated_viewers: v.optional(v.number()),
    peak_concurrent_viewers: v.optional(v.number()),
  }).index("by_sport", ["sport_id"])
    .index("by_date", ["game_date"])
    .index("by_status", ["status"])
    .index("by_teams", ["home_team_id", "away_team_id"])
    .index("by_live", ["status", "game_date"]),

  // ===== CONTENT & MEDIA TABLES =====
  
  // Enhanced content table for all video/picture content
  content: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(
      // Shows & Podcasts
      v.literal("show"), 
      v.literal("podcast"),
      // Sports Content
      v.literal("feature"), 
      v.literal("trailer"), 
      v.literal("hype-video"), 
      v.literal("highlight"), 
      v.literal("clip"), 
      v.literal("moment"),
      v.literal("recap"),
      v.literal("preview"),
      // Live Content
      v.literal("live_stream"),
      v.literal("live_game"),
      // Other
      v.literal("interview"),
      v.literal("documentary")
    ),
    
    // Media URLs
    video_url: v.optional(v.string()),
    audio_url: v.optional(v.string()), // For podcasts
    thumbnail_url: v.string(),
    poster_url: v.string(),
    backdrop_url: v.optional(v.string()),
    preview_url: v.optional(v.string()), // Short preview clip
    
    // Content metadata
    duration: v.number(), // seconds (converted from runtime)
    file_size: v.optional(v.number()), // bytes
    resolution: v.optional(v.string()), // "1080p", "4K", etc.
    format: v.optional(v.string()), // "mp4", "webm", etc.
    
    // Publishing
    status: v.union(
      v.literal("published"),
      v.literal("draft"),
      v.literal("archived"),
      v.literal("processing"), // For uploaded content
      v.literal("scheduled")
    ),
    published_date: v.string(),
    scheduled_publish_date: v.optional(v.string()),
    
    // Content classification
    featured: v.boolean(),
    trending: v.boolean(),
    is_premium: v.optional(v.boolean()),
    age_rating: v.optional(v.union(
      v.literal("G"),
      v.literal("PG"),
      v.literal("PG-13"),
      v.literal("R"),
      v.literal("NR")
    )),
    
    // Relationships
    related_game_ids: v.optional(v.array(v.id("games"))),
    related_team_ids: v.optional(v.array(v.id("teams"))),
    related_player_ids: v.optional(v.array(v.id("players"))),
    tags: v.array(v.id("tags")),
    tag_names: v.array(v.string()),
    
    // Analytics
    view_count: v.optional(v.number()),
    like_count: v.optional(v.number()),
    share_count: v.optional(v.number()),
    average_watch_time: v.optional(v.number()), // seconds
    
    // Legacy fields (for migration compatibility)
    runtime: v.optional(v.number()), // minutes - will be converted to duration
    release_date: v.optional(v.string()), // will be converted to published_date
    cast: v.optional(v.array(v.string())),
    director: v.optional(v.string()),
    year: v.optional(v.number()),
    imdb_rating: v.optional(v.number()),
    language: v.optional(v.string()),
    city: v.optional(v.string()),
    new_release: v.optional(v.boolean()),
    coming_soon: v.optional(v.boolean()),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"])
    .index("by_trending", ["trending"])
    .index("by_published", ["published_date"])
    .index("by_premium", ["is_premium"])
    .searchIndex("search_content", { 
      searchField: "title", 
      filterFields: ["type", "status", "tag_names", "age_rating"] 
    }),

  // Enhanced shows structure (replaces tv_seasons concept)
  shows: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.union(v.literal("show"), v.literal("podcast")),
    
    // Media
    poster_url: v.string(),
    backdrop_url: v.optional(v.string()),
    trailer_url: v.optional(v.string()),
    
    // Show metadata
    status: v.union(
      v.literal("active"), 
      v.literal("ended"), 
      v.literal("hiatus"),
      v.literal("cancelled")
    ),
    premiere_date: v.optional(v.string()),
    end_date: v.optional(v.string()),
    
    // Content organization
    total_seasons: v.optional(v.number()),
    total_episodes: v.optional(v.number()),
    average_episode_duration: v.optional(v.number()), // seconds
    
    // Categorization
    genre: v.optional(v.string()),
    tags: v.array(v.id("tags")),
    
    // Relationships
    host_ids: v.optional(v.array(v.id("users"))), // For podcast hosts
    related_team_ids: v.optional(v.array(v.id("teams"))),
    
    // Analytics
    subscriber_count: v.optional(v.number()),
    total_views: v.optional(v.number()),
    rating: v.optional(v.number()),
    
    // Publishing
    is_featured: v.optional(v.boolean()),
    is_premium: v.optional(v.boolean()),
  }).index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_featured", ["is_featured"])
    .searchIndex("search_shows", { 
      searchField: "title", 
      filterFields: ["type", "status", "genre"] 
    }),

  // Enhanced seasons table
  seasons: defineTable({
    show_id: v.id("shows"),
    season_number: v.number(),
    title: v.string(),
    description: v.optional(v.string()),
    
    // Media
    poster_url: v.optional(v.string()),
    trailer_url: v.optional(v.string()),
    
    // Season metadata
    episode_count: v.number(),
    premiere_date: v.optional(v.string()),
    finale_date: v.optional(v.string()),
    
    // Analytics
    total_views: v.optional(v.number()),
    average_rating: v.optional(v.number()),
  }).index("by_show", ["show_id"])
    .index("by_show_season", ["show_id", "season_number"]),

  // Enhanced episodes table  
  episodes: defineTable({
    season_id: v.id("seasons"),
    show_id: v.id("shows"), // Denormalized for easier querying
    episode_number: v.number(),
    title: v.string(),
    description: v.string(),
    
    // Media
    video_url: v.optional(v.string()),
    audio_url: v.optional(v.string()), // For podcasts
    thumbnail_url: v.string(),
    
    // Episode metadata
    duration: v.number(), // seconds
    air_date: v.optional(v.string()),
    
    // Episode status
    status: v.union(
      v.literal("published"),
      v.literal("scheduled"),
      v.literal("draft")
    ),
    is_premium: v.optional(v.boolean()),
    
    // Analytics
    view_count: v.optional(v.number()),
    like_count: v.optional(v.number()),
    average_watch_time: v.optional(v.number()),
    
    // Relationships
    guest_ids: v.optional(v.array(v.id("users"))), // Podcast guests
    related_game_ids: v.optional(v.array(v.id("games"))),
  }).index("by_season", ["season_id"])
    .index("by_show", ["show_id"])
    .index("by_season_episode", ["season_id", "episode_number"])
    .index("by_air_date", ["air_date"])
    .index("by_status", ["status"]),

  // ===== USER ACTIVITY & ENGAGEMENT =====
  
  // Enhanced users table
  users: defineTable({
    clerk_id: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatar_url: v.optional(v.string()),
    
    // Subscription & Access
    subscription_status: v.union(
      v.literal("free"), 
      v.literal("active"), 
      v.literal("canceled"), 
      v.literal("expired"),
      v.literal("trial")
    ),
    subscription_tier: v.optional(v.union(
      v.literal("basic"),
      v.literal("premium"), 
      v.literal("vip")
    )),
    
    // Profile fields
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    
    // Social links
    social_links: v.optional(v.object({
      twitter: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    
    // Preferences
    favorite_teams: v.optional(v.array(v.id("teams"))),
    favorite_sports: v.optional(v.array(v.id("sports"))),
    favorite_players: v.optional(v.array(v.id("players"))),
    notification_settings: v.optional(v.object({
      game_starts: v.optional(v.boolean()),
      favorite_team_games: v.optional(v.boolean()),
      new_content: v.optional(v.boolean()),
      newsletters: v.optional(v.boolean()),
    })),
    
    // Analytics
    last_active: v.optional(v.string()),
    total_watch_time: v.optional(v.number()), // seconds
    content_rating: v.optional(v.string()), // User's content preference rating
  }).index("by_clerk_id", ["clerk_id"])
    .index("by_subscription", ["subscription_status"])
    .index("by_last_active", ["last_active"]),

  // NEW: Comprehensive user activity tracking
  user_activity: defineTable({
    user_id: v.id("users"),
    activity_type: v.union(
      // Content activities
      v.literal("content_view"),
      v.literal("content_like"),
      v.literal("content_share"),
      v.literal("content_bookmark"),
      v.literal("episode_complete"),
      v.literal("episode_partial"),
      
      // Game activities  
      v.literal("game_view"),
      v.literal("live_game_join"),
      v.literal("live_game_leave"),
      
      // Social activities
      v.literal("player_follow"),
      v.literal("team_follow"),
      v.literal("show_subscribe"),
      v.literal("comment_post"),
      
      // Platform activities
      v.literal("search"),
      v.literal("filter_use"),
      v.literal("recommendation_click")
    ),
    
    // Flexible references - at least one should be populated
    content_id: v.optional(v.id("content")),
    game_id: v.optional(v.id("games")),
    episode_id: v.optional(v.id("episodes")),
    show_id: v.optional(v.id("shows")),
    player_id: v.optional(v.id("players")),
    team_id: v.optional(v.id("teams")),
    
    // Activity metadata
    duration_seconds: v.optional(v.number()),
    progress_percentage: v.optional(v.number()), // 0-100
    session_id: v.optional(v.string()),
    
    // Technical context
    device_type: v.optional(v.string()), // "mobile", "desktop", "tablet", "tv"
    browser: v.optional(v.string()),
    location: v.optional(v.string()), // City/country
    ip_hash: v.optional(v.string()), // Hashed for privacy
    
    // Search & discovery context
    search_query: v.optional(v.string()),
    recommendation_source: v.optional(v.string()),
    referrer_url: v.optional(v.string()),
    
    // Timestamps
    created_at: v.number(),
    completed_at: v.optional(v.number()),
  }).index("by_user", ["user_id"])
    .index("by_user_type", ["user_id", "activity_type"])
    .index("by_content", ["content_id"])
    .index("by_game", ["game_id"])
    .index("by_episode", ["episode_id"])
    .index("by_created", ["created_at"])
    .index("by_user_created", ["user_id", "created_at"]),

  // Enhanced watchlist
  watchlist: defineTable({
    user_id: v.id("users"),
    content_id: v.optional(v.id("content")),
    show_id: v.optional(v.id("shows")),
    episode_id: v.optional(v.id("episodes")),
    
    // Watch progress
    watch_position: v.optional(v.number()), // seconds
    progress_percentage: v.optional(v.number()), // 0-100
    is_completed: v.optional(v.boolean()),
    
    // Organization
    list_position: v.number(),
    added_at: v.string(),
    last_watched_at: v.optional(v.string()),
    
    // Metadata
    priority: v.optional(v.union(
      v.literal("high"),
      v.literal("normal"), 
      v.literal("low")
    )),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["user_id"])
    .index("by_user_content", ["user_id", "content_id"])
    .index("by_user_show", ["user_id", "show_id"])
    .index("by_added", ["added_at"]),

  // Enhanced content ratings
  content_ratings: defineTable({
    user_id: v.id("users"),
    content_id: v.optional(v.id("content")),
    episode_id: v.optional(v.id("episodes")),
    show_id: v.optional(v.id("shows")),
    
    // Rating types
    rating_type: v.union(
      v.literal("like"), // Simple like/dislike
      v.literal("star"), // 1-5 star rating
      v.literal("thumbs") // thumbs up/down
    ),
    rating_value: v.union(
      v.literal("up"), v.literal("down"), // for thumbs
      v.number() // for star ratings (1-5)
    ),
    
    // Optional review
    review_text: v.optional(v.string()),
    
    // Timestamps
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_user", ["user_id"])
    .index("by_content", ["content_id"])
    .index("by_episode", ["episode_id"])
    .index("by_show", ["show_id"])
    .index("by_user_content", ["user_id", "content_id"]),

  // ===== GAME-SPECIFIC TABLES =====
  
  // Keep existing game events (enhanced)
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
      v.literal("injury"),
      v.literal("technical"),
      v.literal("ejection")
    ),
    
    // Enhanced period info
    period_info: v.optional(v.object({
      period_number: v.number(),
      period_type: v.string(),
      time_remaining: v.optional(v.string()),
      is_overtime: v.optional(v.boolean()),
      clock_running: v.optional(v.boolean()),
    })),
    
    // Enhanced scoring
    score_info: v.optional(v.object({
      home_score: v.number(),
      away_score: v.number(),
      scoring_team: v.optional(v.union(v.literal("home"), v.literal("away"))),
      points_scored: v.optional(v.number()),
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
    
    // Participants
    player_id: v.optional(v.id("players")),
    team_id: v.optional(v.id("teams")),
    
    // Event details
    description: v.string(),
    timestamp_in_game: v.optional(v.string()),
    creation_time: v.number(),
    
    // Enhanced metadata
    metadata: v.optional(v.any()),
    severity: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"), 
      v.literal("high"),
      v.literal("critical")
    )),
    is_highlight: v.optional(v.boolean()),
  }).index("by_game", ["game_id"])
    .index("by_game_time", ["game_id", "creation_time"])
    .index("by_highlights", ["is_highlight"]),

  // Keep existing game states (enhanced)  
  game_states: defineTable({
    game_id: v.id("games"),
    current_period: v.number(),
    period_type: v.string(),
    period_display: v.string(),
    time_left: v.optional(v.string()),
    
    // Scoring
    home_score: v.number(),
    away_score: v.number(),
    detailed_score: v.optional(v.any()),
    
    // Game flow
    is_overtime: v.optional(v.boolean()),
    clock_running: v.optional(v.boolean()),
    game_phase: v.optional(v.union(
      v.literal("pregame"),
      v.literal("active"),
      v.literal("halftime"),
      v.literal("timeout"),
      v.literal("final")
    )),
    
    // Enhanced live data
    momentum: v.optional(v.union(
      v.literal("home"),
      v.literal("away"), 
      v.literal("neutral")
    )),
    lead_changes: v.optional(v.number()),
    largest_lead: v.optional(v.object({
      team: v.union(v.literal("home"), v.literal("away")),
      points: v.number(),
    })),
    
    // Timestamps
    last_updated: v.number(),
    last_event_time: v.optional(v.number()),
  }).index("by_game", ["game_id"])
    .index("by_updated", ["last_updated"]),

  // ===== REFERENCE TABLES =====
  
  // Enhanced tags
  tags: defineTable({
    name: v.string(),
    slug: v.string(),
    group: v.union(
      v.literal("Sport"), 
      v.literal("Format"), 
      v.literal("Level"),
      v.literal("Genre"),
      v.literal("Topic"),
      v.literal("Content-Type")
    ),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    usage_count: v.optional(v.number()),
    is_featured: v.optional(v.boolean()),
  }).index("by_slug", ["slug"])
    .index("by_group", ["group"])
    .index("by_usage", ["usage_count"]),

  // Keep existing join tables
  team_sports: defineTable({
    team_id: v.id("teams"),
    sport_id: v.id("sports"),
    is_primary: v.optional(v.boolean()), // Main sport for this team
    season_active: v.optional(v.string()),
  })
    .index("by_team", ["team_id"])
    .index("by_sport", ["sport_id"])
    .index("by_team_sport", ["team_id", "sport_id"]),
  
  player_sports: defineTable({
    player_id: v.id("players"),
    sport_id: v.id("sports"),
    sport_specific_key: v.string(),
    position: v.optional(v.string()),
    jersey_number: v.optional(v.number()),
    is_active: v.optional(v.boolean()),
    season: v.optional(v.string()),
  }).index("by_player_sport", ["player_id", "sport_id"]),

  // Keep existing stats tables
  player_season_stats: defineTable({
    player_id: v.id("players"),
    sport_id: v.optional(v.id("sports")), // Added for multi-sport players
    season: v.string(),
    team_id: v.optional(v.id("teams")), // Track if player changed teams
    
    // Universal stats
    games_played: v.number(),
    games_started: v.optional(v.number()),
    
    // Sport-specific stats (flexible structure)
    stats: v.optional(v.any()), // Flexible for different sports
    
    // Common stats
    points_per_game: v.optional(v.number()),
    rebounds_per_game: v.optional(v.number()),
    assists_per_game: v.optional(v.number()),
    field_goal_percentage: v.optional(v.number()),
    
    // Analytics
    efficiency_rating: v.optional(v.number()),
  }).index("by_player", ["player_id"])
    .index("by_season", ["season"])
    .index("by_player_season", ["player_id", "season"]),

  player_milestones: defineTable({
    player_id: v.id("players"),
    year: v.number(),
    date: v.optional(v.string()), // Specific date if known
    title: v.string(),
    description: v.string(),
    badge_text: v.optional(v.string()),
    milestone_type: v.optional(v.union(
      v.literal("achievement"),
      v.literal("record"),
      v.literal("award"),
      v.literal("career")
    )),
    importance: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
  }).index("by_player", ["player_id"])
    .index("by_year", ["year"])
    .index("by_type", ["milestone_type"]),

  // ===== BLOG SYSTEM (Optional - can be removed if not needed) =====
  
  // Keep blog tables for now but mark as optional for removal
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

  blog_comments: defineTable({
    post_id: v.id("blog_posts"),
    author_id: v.id("users"),
    content: v.string(),
    parent_id: v.optional(v.id("blog_comments")),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("spam")),
    created_at: v.string(),
  }).index("by_post", ["post_id"]),

  blog_subscribers: defineTable({
    email: v.string(),
    status: v.union(v.literal("active"), v.literal("unsubscribed")),
    subscribed_at: v.string(),
  }).index("by_email", ["email"]),
});

// Note: Tables removed from original schema:
// - Teams (duplicate of teams)
// - analytics_events (empty)
// - genres (empty)  
// - viewing_history (empty)