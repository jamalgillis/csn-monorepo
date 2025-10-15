# Convex Architecture: Real-time Backend Strategy

> **Status**: APPROVED
> **Date**: 2025-10-07
> **Version**: 1.0
> **Architecture Pattern**: Convex as Real-time Engine + PostHog as Analytics Layer

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Convex Role & Responsibilities](#convex-role--responsibilities)
3. [PostHog Integration Strategy](#posthog-integration-strategy)
4. [Data Flow Architecture](#data-flow-architecture)
5. [Schema Design Principles](#schema-design-principles)
6. [Implementation Guidelines](#implementation-guidelines)

---

## Architecture Overview

### Philosophy

Convex serves as the **brain and central nervous system** of the CSN sports streaming platform. It is our single source of truth for operational data and provides real-time reactivity for user-facing features.

**Core Principle**: Convex handles what users see and interact with; PostHog handles how we analyze and understand user behavior at scale.

---

## Convex Role & Responsibilities

### ✅ What Convex SHOULD Handle (Real-time Operational Data)

**User Experience Features:**
- User watch history & playback progress
- "Continue Watching" carousel with cross-device sync
- User playlists & "My List" management
- Real-time notifications & updates

**Live Streaming Features:**
- Live stream viewer counts (real-time presence)
- Live chat messages during games
- Game score updates and play-by-play events
- Active session tracking with heartbeat monitoring

**Content Management:**
- Video/show metadata & availability
- Content workflow states (draft → review → published)
- Admin content creation & editing
- Media upload tracking & status

**User State:**
- Authentication & user profiles
- User preferences & settings
- Subscription status
- Watchlist & favorites

### ❌ What Convex Should NOT Handle (Defer to PostHog)

**Analytics & Aggregation:**
- Video view count aggregations across millions of views
- Average watch time calculations
- User behavior funnels & cohorts
- A/B test analysis & statistical significance
- Trend analysis over time periods
- Complex cross-video analytics
- Heatmaps & user journey analysis

**Why?** These are heavy aggregation queries that PostHog is optimized for. Convex excels at low-latency operational queries, not large-scale analytical computations.

---

## PostHog Integration Strategy

### Architecture Pattern: Convex Actions as Analytics Gateway

Instead of sending analytics events directly from the client to PostHog, we route them through Convex actions. This provides:

1. **Security**: PostHog API keys never exposed to frontend
2. **Data Enrichment**: Fetch related metadata from Convex DB before sending
3. **Consistency**: Single source of truth for event structure
4. **Validation**: Server-side validation before analytics transmission

### Example: Video Play Tracking

```typescript
// Client calls Convex action (NOT PostHog directly)
const trackPlay = useMutation(api.analytics.trackVideoPlay);
await trackPlay({ videoId, position: 0 });

// Convex action enriches data and sends to PostHog
export const trackVideoPlay = action({
  args: { videoId: v.id("content"), position: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const video = await ctx.runQuery(api.content.getContentById, {
      id: args.videoId
    });

    // Send enriched event to PostHog
    await posthog.capture({
      distinctId: identity.subject,
      event: 'video_play',
      properties: {
        video_id: args.videoId,
        video_title: video.title,
        video_type: video.type,
        position_seconds: args.position,
        tags: video.tag_names,
      }
    });
  }
});
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   USER DEVICE (Frontend)                        │
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  React Query     │              │  Video Player    │        │
│  │  (Convex         │◄─────────────┤  Component       │        │
│  │  Subscriptions)  │  Real-time   │                  │        │
│  │                  │  Updates     │                  │        │
│  └────────┬─────────┘              └─────────┬────────┘        │
│           │                                   │                 │
│           │ Subscribe to                      │ Call            │
│           │ • watch_progress                  │ • trackVideoPlay│
│           │ • live_viewers                    │ • trackComplete │
│           │ • chat_messages                   │ • trackEngage   │
│           │                                   │                 │
└───────────┼───────────────────────────────────┼─────────────────┘
            │                                   │
            │ useQuery() / useMutation()        │
            │                                   │
            ▼                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONVEX BACKEND                             │
│                                                                 │
│  ┌──────────────────────────┐    ┌──────────────────────────┐  │
│  │  Queries (Real-time)     │    │  Actions (Analytics)     │  │
│  │  ═══════════════════     │    │  ═══════════════════     │  │
│  │                          │    │                          │  │
│  │  • getWatchProgress()    │    │  • trackVideoPlay()      │  │
│  │  • getLiveViewers()      │    │  • trackVideoComplete()  │  │
│  │  • getChatMessages()     │    │  • trackContentAdded()   │  │
│  │  • getContinueWatching() │    │  • trackAdminPublish()   │  │
│  │                          │    │                          │  │
│  │  Returns: Live data      │    │  Returns: Success/Error  │  │
│  │  via subscriptions       │    │                          │  │
│  └──────────┬───────────────┘    └──────────┬───────────────┘  │
│             │                               │                  │
│             │                               │                  │
│  ┌──────────▼───────────────────────────────▼───────────────┐  │
│  │                                                           │  │
│  │            CONVEX DATABASE (Operational)                 │  │
│  │            ════════════════════════════════              │  │
│  │                                                           │  │
│  │  Tables:                                                  │  │
│  │  • users                    • media_assets               │  │
│  │  • content                  • user_watch_progress        │  │
│  │  • games                    • live_stream_sessions       │  │
│  │  • teams                    • live_chat_messages         │  │
│  │  • players                  • content_audit_log          │  │
│  │                                                           │  │
│  │  Purpose: Low-latency operational queries                │  │
│  │  Use Case: Power the application UI                      │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                    │                            │
│                                    │ Enrich with metadata       │
│                                    │ Add user context           │
│                                    │ Validate & format          │
│                                    │                            │
└────────────────────────────────────┼────────────────────────────┘
                                     │
                                     │ Send enriched events
                                     │ via PostHog SDK
                                     │
                                     ▼
                          ┌──────────────────────────────────┐
                          │         POSTHOG                  │
                          │         ═══════                  │
                          │                                  │
                          │  Analytics & Aggregation:        │
                          │  • Event storage & indexing      │
                          │  • Trend analysis over time      │
                          │  • Funnels & conversion rates    │
                          │  • Cohort analysis               │
                          │  • Session recordings            │
                          │  • Heatmaps & click tracking     │
                          │                                  │
                          │  Purpose: Large-scale analytics  │
                          │  Use Case: Business intelligence │
                          │                                  │
                          └──────────────────────────────────┘
```

### Data Flow Explanation

1. **Frontend → Convex Queries**:
   - Components subscribe to real-time data via `useQuery()`
   - Convex automatically pushes updates when data changes
   - Powers "Continue Watching", live viewer counts, chat messages

2. **Frontend → Convex Actions**:
   - User actions (play video, add to list) call Convex actions
   - Actions fetch context from Convex DB
   - Actions send enriched events to PostHog

3. **Convex Database**:
   - Stores operational data for the application
   - Optimized for low-latency reads/writes
   - Powers all user-facing features

4. **PostHog**:
   - Receives enriched events from Convex actions
   - Performs heavy aggregations and analytics
   - Provides dashboards and insights for product decisions

---

## Schema Design Principles

### 1. Optimize for Real-time Queries

**Good Example:**
```typescript
// Index for fast "Continue Watching" queries
user_watch_progress: defineTable({
  user_id: v.id("users"),
  content_id: v.id("content"),
  position_seconds: v.number(),
  last_watched_at: v.number(),
})
  .index("by_user", ["user_id"])
  .index("by_last_watched", ["user_id", "last_watched_at"]),
```

**Why?** Indexed queries are fast. Convex can return results in milliseconds.

### 2. Denormalize for Speed (When Appropriate)

**Good Example:**
```typescript
live_chat_messages: defineTable({
  game_id: v.id("games"),
  user_id: v.id("users"),

  // Denormalized for fast display
  user_name: v.string(),
  user_avatar: v.optional(v.string()),

  message: v.string(),
  created_at: v.number(),
})
```

**Why?** Chat needs to display instantly. Don't join to users table for every message.

### 3. Use Simple Patterns Over Complex Normalization

**Good Example:**
```typescript
media_assets: defineTable({
  folder_path: v.optional(v.string()),  // "sports/volleyball/highlights"
  tags: v.array(v.string()),            // ["volleyball", "2024", "playoffs"]
})
```

**Bad Example:**
```typescript
// Don't do this for MVP:
media_folders: defineTable({
  parent_folder_id: v.optional(v.id("media_folders")),
  // Complex hierarchical traversal
})
```

**Why?** String paths are simpler to query and display. Can evolve to folder table later if needed.

### 4. Add Timestamps for Everything

**Pattern:**
```typescript
created_at: v.number(),
updated_at: v.number(),
last_heartbeat: v.number(),  // For presence tracking
```

**Why?** Enables time-based queries, cleanup jobs, and debugging.

---

## Implementation Guidelines

### Queries: Real-time Data Fetching

```typescript
// convex/watchProgress.ts
export const getContinueWatching = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get recent watch progress
    const progress = await ctx.db
      .query("user_watch_progress")
      .withIndex("by_last_watched", q =>
        q.eq("user_id", args.userId)
      )
      .order("desc")
      .take(10);

    // Fetch associated content
    const contentIds = progress.map(p => p.content_id);
    const content = await Promise.all(
      contentIds.map(id => ctx.db.get(id))
    );

    return progress.map((p, i) => ({
      ...p,
      content: content[i]
    }));
  }
});
```

### Mutations: State Updates

```typescript
// convex/watchProgress.ts
export const updateWatchProgress = mutation({
  args: {
    userId: v.id("users"),
    contentId: v.id("content"),
    positionSeconds: v.number(),
    durationSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    // Find existing progress
    const existing = await ctx.db
      .query("user_watch_progress")
      .withIndex("by_user_content", q =>
        q.eq("user_id", args.userId).eq("content_id", args.contentId)
      )
      .first();

    const completionPercentage =
      (args.positionSeconds / args.durationSeconds) * 100;

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        position_seconds: args.positionSeconds,
        completion_percentage: completionPercentage,
        last_watched_at: Date.now(),
        completed: completionPercentage >= 90,
      });
    } else {
      // Insert new
      await ctx.db.insert("user_watch_progress", {
        user_id: args.userId,
        content_id: args.contentId,
        position_seconds: args.positionSeconds,
        duration_seconds: args.durationSeconds,
        completion_percentage: completionPercentage,
        last_watched_at: Date.now(),
        completed: completionPercentage >= 90,
      });
    }
  }
});
```

### Actions: Analytics Integration

```typescript
// convex/analytics.ts
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { PostHog } from 'posthog-node';

// Initialize PostHog client (use environment variable)
const posthog = new PostHog(
  process.env.POSTHOG_API_KEY!,
  { host: 'https://app.posthog.com' }
);

export const trackVideoPlay = action({
  args: {
    videoId: v.id("content"),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    // 2. Fetch video metadata from Convex
    const video = await ctx.runQuery(api.content.getContentById, {
      id: args.videoId
    });

    if (!video) return;

    // 3. Send enriched event to PostHog
    posthog.capture({
      distinctId: identity.subject,
      event: 'video_play',
      properties: {
        video_id: args.videoId,
        video_title: video.title,
        video_type: video.type,
        video_year: video.year,
        position_seconds: args.position,
        tags: video.tag_names,
        is_premium: !!video.video_url,
      }
    });
  }
});

export const trackVideoComplete = action({
  args: {
    videoId: v.id("content"),
    watchDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const video = await ctx.runQuery(api.content.getContentById, {
      id: args.videoId
    });

    if (!video) return;

    posthog.capture({
      distinctId: identity.subject,
      event: 'video_complete',
      properties: {
        video_id: args.videoId,
        video_title: video.title,
        video_type: video.type,
        watch_duration_seconds: args.watchDuration,
        video_runtime_minutes: video.runtime,
        completion_rate: (args.watchDuration / (video.runtime * 60)) * 100,
      }
    });
  }
});
```

### Real-time Subscriptions (Frontend)

```typescript
// In React component
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function ContinueWatching() {
  const userId = useAuth().userId;

  // Real-time subscription - updates automatically
  const continueWatching = useQuery(
    api.watchProgress.getContinueWatching,
    userId ? { userId } : "skip"
  );

  if (!continueWatching) return <Skeleton />;

  return (
    <div>
      {continueWatching.map(item => (
        <VideoCard
          key={item._id}
          video={item.content}
          progress={item.position_seconds}
        />
      ))}
    </div>
  );
}
```

---

## Best Practices

### ✅ DO:

1. **Use Convex for operational queries** that power the UI
2. **Use PostHog for analytics** that inform business decisions
3. **Route analytics through Convex actions** for security and enrichment
4. **Leverage real-time subscriptions** for live features
5. **Index all foreign keys** for fast queries
6. **Denormalize judiciously** for speed when needed
7. **Use mutations for state changes** and let Convex handle reactivity

### ❌ DON'T:

1. **Don't do heavy aggregations in Convex** (use PostHog)
2. **Don't expose PostHog API keys** to the frontend
3. **Don't skip indexes** on frequently queried fields
4. **Don't over-normalize** for MVP (keep it simple)
5. **Don't send analytics directly from client** (route through Convex)
6. **Don't store analytics data in Convex** (use PostHog)

---

## Migration & Evolution Strategy

### Phase 1: MVP (Current)
- Core operational tables
- Basic real-time features
- PostHog integration via actions

### Phase 2: Scale (Future)
- Add computed views for common queries
- Implement cleanup jobs for old data
- Add more sophisticated real-time features

### Phase 3: Optimize (Future)
- Performance profiling and optimization
- Advanced caching strategies
- Horizontal scaling considerations

---

## Environment Configuration

```bash
# .env.local
CONVEX_DEPLOYMENT=<your-deployment>
POSTHOG_API_KEY=<your-posthog-key>
POSTHOG_HOST=https://app.posthog.com
```

---

## Success Metrics

### Performance Targets
- Query latency: < 100ms (p95)
- Mutation latency: < 200ms (p95)
- Real-time update latency: < 500ms
- Analytics action latency: < 1s (acceptable for async)

### Reliability Targets
- Database uptime: 99.9%
- Real-time subscription reliability: 99.5%
- Analytics delivery success rate: 99%

---

**Last Updated**: 2025-10-07
**Architecture Owner**: Winston (Technical Architect)
**Review Cycle**: Monthly
