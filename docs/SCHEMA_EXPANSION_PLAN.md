# CSN Database Schema Expansion Plan

> **Status**: IMPLEMENTATION READY
> **Date**: 2025-01-10
> **Version**: 2.0
> **Priority**: HIGH - All Areas

This document outlines the complete schema expansion to support all admin panel functionality with sport-specific features, advanced media handling, and real-time capabilities.

---

## Table of Contents

1. [Volleyball-Specific Stats Schema](#1-volleyball-specific-stats-schema)
2. [Media Library Schema (HLS/M3U8 + UploadThing)](#2-media-library-schema)
3. [Analytics & Tracking Schema](#3-analytics--tracking-schema)
4. [Live Game Controls Schema](#4-live-game-controls-schema)
5. [AI Chat System Schema](#5-ai-chat-system-schema)
6. [Implementation Order](#6-implementation-order)
7. [Migration Strategy](#7-migration-strategy)

---

## 1. Volleyball-Specific Stats Schema

### Problem
Current stats are basketball-focused (PPG, rebounds, assists). Need volleyball-specific metrics.

### Solution

#### Table: `volleyball_player_stats`
**Purpose**: Track individual volleyball player statistics per season/match

```typescript
{
  player_id: Id<"players">,
  team_id: Id<"teams">,
  season: string,              // "2024-2025"
  season_stats: {
    matches_played: number,
    sets_played: number,

    // Offensive stats
    kills: number,
    kill_attempts: number,
    kill_percentage: number,    // kills / attempts
    aces: number,
    service_attempts: number,

    // Defensive stats
    digs: number,
    blocks: number,
    block_assists: number,
    reception_attempts: number,
    reception_errors: number,

    // Setting stats (for setters)
    assists: number,
    assist_attempts: number,

    // Errors
    attack_errors: number,
    service_errors: number,
    ball_handling_errors: number,

    // Advanced metrics
    hitting_percentage: number, // (kills - errors) / attempts
    points_scored: number,
  },
  game_stats: Array<{
    game_id: Id<"games">,
    date: string,
    opponent_id: Id<"teams">,
    sets_played: number,
    kills: number,
    aces: number,
    digs: number,
    blocks: number,
    assists: number,
    errors: number,
  }>,
  updated_at: number,
}
```

#### Table: `volleyball_team_stats`
**Purpose**: Track team-level volleyball statistics

```typescript
{
  team_id: Id<"teams">,
  season: string,

  // Record
  matches_won: number,
  matches_lost: number,
  sets_won: number,
  sets_lost: number,
  win_percentage: number,

  // Conference/league standing
  conference_wins: number,
  conference_losses: number,
  conference_rank: number,

  // Team averages per match
  avg_kills: number,
  avg_aces: number,
  avg_digs: number,
  avg_blocks: number,
  avg_assists: number,

  // Streaks
  current_streak: {
    type: "win" | "loss",
    count: number,
  },
  longest_win_streak: number,

  updated_at: number,
}
```

#### Table: `volleyball_match_details`
**Purpose**: Store detailed match/set information

```typescript
{
  game_id: Id<"games">,
  sport_id: Id<"sports">,      // Must be volleyball

  sets: Array<{
    set_number: number,         // 1, 2, 3, 4, 5
    home_score: number,
    away_score: number,
    duration_minutes: number,

    // Detailed stats per set
    home_stats: {
      kills: number,
      aces: number,
      blocks: number,
      errors: number,
    },
    away_stats: {
      kills: number,
      aces: number,
      blocks: number,
      errors: number,
    },
  }>,

  // Match summary
  winner_id: Id<"teams">,
  sets_won_home: number,
  sets_won_away: number,
  total_duration_minutes: number,

  // Officials
  officials: Array<{
    name: string,
    role: "referee" | "line_judge" | "scorer",
  }>,

  attendance: number,
  venue_notes?: string,
}
```

---

## 2. Media Library Schema

### Problem
No centralized media management. Need support for HLS/M3U8 streaming + MP4/MOV files from UploadThing.

### Solution

#### Table: `media_files`
**Purpose**: Centralized media asset management with multi-format support

```typescript
{
  // Basic info
  title: string,
  description?: string,

  // File metadata
  file_type: "video" | "image" | "audio" | "document",
  mime_type: string,            // "video/mp4", "application/x-mpegURL", etc.

  // UploadThing integration
  uploadthing_key?: string,     // UploadThing file key
  uploadthing_url?: string,     // Direct file URL

  // Original source file
  source_file: {
    url: string,                // Original MP4/MOV from UploadThing
    size_bytes: number,
    format: "mp4" | "mov" | "avi" | "webm",
    duration_seconds?: number,  // For videos
    dimensions?: {
      width: number,
      height: number,
    },
  },

  // HLS/Streaming support
  streaming_urls?: {
    hls_master_playlist: string,    // .m3u8 master playlist
    hls_variants: Array<{
      quality: "240p" | "360p" | "480p" | "720p" | "1080p" | "4K",
      bitrate_kbps: number,
      playlist_url: string,           // Variant .m3u8 URL
      resolution: string,             // "1920x1080"
    }>,
    dash_manifest?: string,           // Optional: DASH for wider compatibility
  },

  // Thumbnail/Poster
  thumbnail_url?: string,
  poster_url?: string,               // Video poster frame

  // Processing status
  processing_status: "uploading" | "processing" | "ready" | "failed",
  processing_progress?: number,      // 0-100
  processing_error?: string,

  // Transcoding info (for admin tracking)
  transcoding_job_id?: string,
  transcoded_at?: number,

  // Organization
  folder_id?: Id<"media_folders">,
  tags: Array<string>,

  // Related entities
  related_to?: {
    type: "game" | "team" | "player" | "content" | "blog_post",
    id: Id<any>,
  },

  // Access control
  visibility: "public" | "private" | "unlisted",
  access_level: "free" | "subscriber_only" | "premium",

  // Analytics
  view_count: number,
  download_count: number,

  // Metadata
  uploaded_by: Id<"users">,
  created_at: number,
  updated_at: number,
}
```

#### Table: `media_folders`
**Purpose**: Organize media into hierarchical folders

```typescript
{
  name: string,
  description?: string,
  parent_folder_id?: Id<"media_folders">,  // For nested folders

  // Display
  color?: string,
  icon?: string,

  // Metadata
  created_by: Id<"users">,
  created_at: number,
  updated_at: number,
}
```

#### Table: `media_processing_jobs`
**Purpose**: Track video transcoding/processing jobs

```typescript
{
  media_file_id: Id<"media_files">,

  job_type: "transcode_hls" | "transcode_dash" | "thumbnail_generation" | "compression",
  status: "queued" | "processing" | "completed" | "failed",

  // Job configuration
  config: {
    output_formats: Array<"hls" | "dash" | "mp4">,
    quality_levels: Array<"240p" | "360p" | "480p" | "720p" | "1080p">,
    generate_thumbnails: boolean,
  },

  // Progress
  progress_percentage: number,
  current_step?: string,

  // Results
  output_urls?: {
    hls_master?: string,
    thumbnails?: Array<string>,
  },

  // Error handling
  error_message?: string,
  retry_count: number,
  max_retries: number,

  // Timing
  started_at?: number,
  completed_at?: number,
  created_at: number,
}
```

#### Table: `media_playlists`
**Purpose**: Create curated media playlists (highlights reels, season recaps, etc.)

```typescript
{
  title: string,
  description?: string,

  // Playlist items
  items: Array<{
    media_file_id: Id<"media_files">,
    order: number,
    start_time?: number,          // Optional: start at specific timestamp
    end_time?: number,            // Optional: end at specific timestamp
    title_override?: string,
  }>,

  // Organization
  type: "highlight_reel" | "season_recap" | "top_plays" | "custom",
  sport_id?: Id<"sports">,
  team_id?: Id<"teams">,
  season?: string,

  // Publishing
  visibility: "public" | "private" | "unlisted",
  published: boolean,
  published_at?: number,

  // Metadata
  created_by: Id<"users">,
  created_at: number,
  updated_at: number,
}
```

---

## 3. Analytics & Tracking Schema

### Problem
`analytics_events` and `viewing_history` tables are unused. Need proper event tracking.

### Solution

#### Table: `analytics_events` (Enhanced)
**Purpose**: Track all user interactions across the platform

```typescript
{
  // User info
  user_id?: Id<"users">,           // Optional: anonymous users allowed
  session_id: string,              // Browser session tracking

  // Event details
  event_type:
    | "page_view"
    | "video_play"
    | "video_pause"
    | "video_complete"
    | "video_seek"
    | "content_click"
    | "search"
    | "share"
    | "download"
    | "rating"
    | "comment"
    | "game_view"
    | "player_view"
    | "team_view",

  // Event data
  event_data: {
    // For page views
    page_url?: string,
    page_title?: string,
    referrer?: string,

    // For video events
    video_id?: Id<"media_files"> | Id<"content">,
    video_position_seconds?: number,
    video_duration_seconds?: number,
    quality_level?: string,

    // For content interactions
    content_id?: Id<"content">,
    content_type?: string,

    // For searches
    search_query?: string,
    search_results_count?: number,

    // For games/teams/players
    game_id?: Id<"games">,
    team_id?: Id<"teams">,
    player_id?: Id<"players">,
  },

  // Context
  device_type: "desktop" | "mobile" | "tablet",
  browser?: string,
  os?: string,
  location?: {
    country?: string,
    region?: string,
    city?: string,
  },

  // Timestamp
  timestamp: number,
}
```

#### Table: `viewing_history` (Enhanced)
**Purpose**: Detailed video/content viewing history

```typescript
{
  user_id: Id<"users">,

  // Content reference
  content_type: "media_file" | "content" | "live_game",
  content_id: Id<"media_files"> | Id<"content"> | Id<"games">,

  // Viewing session
  session_id: string,

  // Progress tracking
  watch_duration_seconds: number,
  total_duration_seconds: number,
  completion_percentage: number,      // 0-100

  // Playback details
  last_position_seconds: number,      // Resume point
  quality_watched: string,            // "720p", "1080p", etc.

  // Engagement
  paused_count: number,
  seeked_count: number,
  buffering_events: number,

  // Device
  device_type: "desktop" | "mobile" | "tablet",

  // Timestamps
  started_at: number,
  last_watched_at: number,
  completed: boolean,
  completed_at?: number,
}
```

#### Table: `analytics_aggregations`
**Purpose**: Pre-computed analytics for dashboard performance

```typescript
{
  // Time period
  period_type: "hourly" | "daily" | "weekly" | "monthly",
  period_start: number,
  period_end: number,

  // Metrics
  metrics: {
    // Traffic
    total_page_views: number,
    unique_visitors: number,

    // Video
    total_video_plays: number,
    total_watch_time_hours: number,
    avg_completion_rate: number,

    // Content
    top_content: Array<{
      content_id: Id<"content">,
      views: number,
      watch_time_hours: number,
    }>,

    // Games
    total_game_views: number,
    live_game_viewers_peak: number,

    // Engagement
    total_shares: number,
    total_ratings: number,
    total_comments: number,
  },

  computed_at: number,
}
```

---

## 4. Live Game Controls Schema

### Problem
No schema for managing live game broadcasts and real-time updates.

### Solution

#### Table: `live_game_controls`
**Purpose**: Admin controls for managing live game broadcasts

```typescript
{
  game_id: Id<"games">,

  // Broadcast status
  broadcast_status: "not_started" | "live" | "paused" | "halftime" | "ended",

  // Streaming
  stream_config: {
    primary_stream_url?: string,         // HLS master playlist
    backup_stream_url?: string,
    stream_key?: string,                 // For RTMP ingest
    stream_provider: "uploadthing" | "mux" | "cloudflare" | "custom",
  },

  // Live controls
  current_period: number,
  period_type: string,                   // "Set", "Quarter", "Half", "Inning"
  time_remaining?: string,
  is_overtime: boolean,

  // Score tracking
  home_score: number,
  away_score: number,
  detailed_score?: any,                  // Sport-specific score details

  // Officials
  active_officials: Array<{
    user_id?: Id<"users">,
    name: string,
    role: "scorekeeper" | "play_by_play" | "camera_operator" | "producer",
    status: "active" | "break" | "offline",
  }>,

  // Viewer analytics
  current_viewers: number,
  peak_viewers: number,
  total_unique_viewers: number,

  // Chat/Comments
  live_chat_enabled: boolean,
  live_chat_moderated: boolean,

  // Recording
  is_recording: boolean,
  recording_started_at?: number,

  // Metadata
  started_by: Id<"users">,
  started_at?: number,
  ended_at?: number,
  last_updated: number,
}
```

#### Table: `broadcast_sessions`
**Purpose**: Track historical broadcast sessions

```typescript
{
  game_id: Id<"games">,

  // Session info
  session_start: number,
  session_end?: number,
  duration_minutes?: number,

  // Quality metrics
  avg_bitrate_kbps: number,
  buffering_events: number,
  stream_interruptions: number,

  // Viewer stats
  peak_concurrent_viewers: number,
  total_unique_viewers: number,
  avg_watch_duration_minutes: number,

  // Recording
  recording_url?: string,
  recording_duration_minutes?: number,

  // Engagement
  total_chat_messages: number,
  total_reactions: number,

  // Issues/Notes
  technical_issues?: Array<{
    timestamp: number,
    issue_type: string,
    description: string,
    resolved: boolean,
  }>,

  producer_notes?: string,
}
```

#### Table: `live_reactions`
**Purpose**: Real-time emoji/reaction tracking during live games

```typescript
{
  game_id: Id<"games">,
  user_id?: Id<"users">,           // Optional: anonymous allowed
  session_id: string,

  // Reaction
  reaction_type: "🔥" | "👏" | "😮" | "❤️" | "😂" | "👎",

  // Context
  game_timestamp?: string,         // What moment in the game
  related_event_id?: Id<"game_events">,

  // Timing
  timestamp: number,
}
```

---

## 5. AI Chat System Schema

### Problem
No schema for AI chat assistant in admin panel.

### Solution

#### Table: `chat_conversations`
**Purpose**: Track AI assistant conversations

```typescript
{
  // User
  user_id: Id<"users">,

  // Conversation metadata
  title: string,                   // Auto-generated from first message
  status: "active" | "archived",

  // Context
  context_type?: "game" | "team" | "player" | "content" | "analytics",
  context_id?: Id<any>,            // Related entity

  // Message count
  message_count: number,

  // Timestamps
  created_at: number,
  last_message_at: number,
  archived_at?: number,
}
```

#### Table: `chat_messages`
**Purpose**: Individual chat messages

```typescript
{
  conversation_id: Id<"chat_conversations">,

  // Message
  role: "user" | "assistant" | "system",
  content: string,

  // AI metadata (for assistant messages)
  model_used?: string,             // "gpt-4", "claude-3", etc.
  tokens_used?: number,
  confidence_score?: number,

  // Actions taken by AI
  actions_performed?: Array<{
    type: "query_database" | "create_entity" | "update_entity" | "search",
    description: string,
    success: boolean,
  }>,

  // User feedback
  helpful?: boolean,
  feedback_text?: string,

  // Timestamp
  created_at: number,
}
```

#### Table: `chat_context`
**Purpose**: Persistent context/memory for AI assistant

```typescript
{
  user_id: Id<"users">,

  // User preferences learned over time
  preferences: {
    preferred_stats_view?: "detailed" | "summary",
    default_sport?: Id<"sports">,
    favorite_teams?: Array<Id<"teams">>,
    common_tasks?: Array<string>,
  },

  // Recent context
  recent_entities_viewed: Array<{
    type: "game" | "team" | "player" | "content",
    id: Id<any>,
    timestamp: number,
  }>,

  // Conversation history summary
  conversation_summaries: Array<{
    summary: string,
    topics: Array<string>,
    timestamp: number,
  }>,

  // Updated
  last_updated: number,
}
```

---

## 6. Implementation Order

### Phase 1: Core Stats & Media (Week 1-2)
**Priority**: CRITICAL - Enables core admin functionality

1. ✅ `volleyball_player_stats`
2. ✅ `volleyball_team_stats`
3. ✅ `volleyball_match_details`
4. ✅ `media_files`
5. ✅ `media_folders`
6. ✅ `media_processing_jobs`

### Phase 2: Analytics & Tracking (Week 2-3)
**Priority**: HIGH - Required for metrics/dashboard

7. ✅ `analytics_events` (enhanced)
8. ✅ `viewing_history` (enhanced)
9. ✅ `analytics_aggregations`

### Phase 3: Live Game Features (Week 3-4)
**Priority**: HIGH - Core differentiator

10. ✅ `live_game_controls`
11. ✅ `broadcast_sessions`
12. ✅ `live_reactions`
13. ✅ `media_playlists`

### Phase 4: AI Chat System (Week 4-5)
**Priority**: MEDIUM - Nice to have, not blocking

14. ✅ `chat_conversations`
15. ✅ `chat_messages`
16. ✅ `chat_context`

---

## 7. Migration Strategy

### Step 1: Schema Definition
- Create all new table schemas in `convex/schema.ts`
- Add proper indexes for performance
- Define relationships and foreign keys

### Step 2: Backwards Compatibility
- Keep existing schemas intact
- Add migration helpers
- Gradual data migration

### Step 3: Admin UI Updates
- Update admin pages to use new schemas
- Add new functionality as schemas become available
- Progressive enhancement approach

### Step 4: Data Migration Scripts
- Create scripts to migrate existing data
- Handle edge cases and data validation
- Rollback capability

### Example Migration Flow:
```typescript
// 1. Deploy new schemas (read-only first)
// 2. Write data to both old and new schemas (dual-write)
// 3. Migrate historical data in background
// 4. Verify data integrity
// 5. Switch reads to new schema
// 6. Remove old schema writes
// 7. Archive old schemas
```

---

## 8. Technical Considerations

### UploadThing Integration
- Use UploadThing for initial file upload (MP4/MOV)
- Store `uploadthing_key` and `uploadthing_url` in `media_files`
- Trigger transcoding job after upload complete
- Generate HLS playlists and store in CDN

### HLS/M3U8 Processing
```
Upload Flow:
1. User uploads MP4 → UploadThing
2. UploadThing webhook → Convex action
3. Create media_file record with processing_status="uploading"
4. Trigger transcoding job (FFmpeg or service like Mux)
5. Generate HLS variants (240p, 480p, 720p, 1080p)
6. Store .m3u8 playlists in CDN
7. Update media_file with streaming_urls
8. Set processing_status="ready"
```

### Real-time Features
- Use Convex subscriptions for live game updates
- Optimistic updates for scorekeeping
- Conflict resolution for multiple scorekeepers

### Performance
- Index all foreign keys
- Aggregate analytics data hourly/daily
- Cache frequently accessed data
- Use Convex search indexes where appropriate

---

## 9. Success Metrics

### Schema Completeness
- ✅ All admin pages have full schema support
- ✅ No missing foreign key relationships
- ✅ All sport-specific stats covered

### Performance
- ✅ Page load < 500ms with new schemas
- ✅ Real-time updates < 100ms latency
- ✅ Video playback start < 2s

### Admin Functionality
- ✅ All CRUD operations work seamlessly
- ✅ Real-time scorekeeping functional
- ✅ Media library fully operational
- ✅ Analytics dashboard live

---

## Next Steps

1. **Review & Approve** this schema expansion plan
2. **Implement Phase 1** schemas in Convex
3. **Create migration scripts** for existing data
4. **Update admin pages** to use new schemas
5. **Test thoroughly** before production deploy

---

**END OF SCHEMA EXPANSION PLAN**
