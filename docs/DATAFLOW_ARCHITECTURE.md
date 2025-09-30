# Sports Platform - Real-Time Dataflow Architecture

## 🔄 Overview

The Sports Platform uses a **reactive, real-time dataflow** architecture powered by Convex's WebSocket-based subscriptions. This ensures that all UI components automatically update when backend data changes, providing a seamless live sports experience.

## 📊 Core Dataflow Pattern

### 1. **React Component Subscription**
```typescript
// Frontend component subscribes to live data
const adminMetrics = useQuery(api.admin.getAdminDashboardMetrics);
const games = useQuery(api.sports.getAllGames);
```

### 2. **Convex Query Function**
```typescript
// Backend query function (convex/admin.ts)
export const getAdminDashboardMetrics = query({
  handler: async (ctx) => {
    const allGames = await ctx.db.query("games").collect();
    const liveGames = allGames.filter(game => game.status === "in_progress");

    return {
      liveGames: liveGames.length,
      scheduledGames: scheduledGames.length,
      // Real-time metrics...
    };
  }
});
```

### 3. **Automatic Re-execution**
When database data changes:
1. Convex detects table modifications
2. Re-runs dependent query functions
3. Pushes new data via WebSocket
4. React components re-render automatically

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────┤
│ React Components                                            │
│ ├── useQuery(api.admin.getAdminDashboardMetrics)          │
│ ├── useQuery(api.sports.getAllGames)                      │
│ └── useMutation(api.sports.updateGameScore)               │
│                                                            │
│ State Management                                           │
│ ├── Loading states (undefined → data)                     │
│ ├── Error states (null = error)                           │
│ └── Real-time updates (automatic re-render)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket Connection
                              │ (Real-time Subscriptions)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONVEX BACKEND                          │
├─────────────────────────────────────────────────────────────┤
│ Query Functions (Real-time)                               │
│ ├── getAdminDashboardMetrics()                           │
│ ├── getAllGames()                                        │
│ └── getRecentAdminActivity()                             │
│                                                            │
│ Mutation Functions (Write Operations)                     │
│ ├── updateGameScore()                                    │
│ ├── addGameEvent()                                       │
│ └── createContent()                                      │
│                                                            │
│ HTTP Actions (External Integrations)                      │
│ ├── /api/games/start                                     │
│ ├── /api/games/score                                     │
│ └── /api/games/events                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Database Operations
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                          │
├─────────────────────────────────────────────────────────────┤
│ Tables                                                     │
│ ├── games (live scores, status, events)                  │
│ ├── game_events (play-by-play timeline)                  │
│ ├── game_states (current live state)                     │
│ ├── content (shows, highlights, clips)                   │
│ ├── teams (team information)                             │
│ └── users (user data, activity)                          │
│                                                            │
│ Indexes & Relations                                        │
│ ├── by_status (filter live games)                        │
│ ├── by_team (team-specific queries)                      │
│ └── by_date (time-based filtering)                       │
└─────────────────────────────────────────────────────────────┘
```

## ⚡ Real-Time Update Flow

### **Admin Dashboard Example**

1. **Initial Load**
   ```typescript
   // Component mounts
   const adminMetrics = useQuery(api.admin.getAdminDashboardMetrics);
   // State: adminMetrics = undefined (loading)
   ```

2. **Data Fetch**
   ```typescript
   // Convex query executes
   const allGames = await ctx.db.query("games").collect();
   // Returns: { liveGames: 2, scheduledGames: 8, ... }
   // State: adminMetrics = { liveGames: 2, scheduledGames: 8 }
   ```

3. **Game Status Change**
   ```typescript
   // External system calls HTTP action
   POST /api/games/start
   { "gameId": "abc123", "status": "in_progress" }

   // Convex updates database
   await ctx.db.patch(gameId, { status: "in_progress" });
   ```

4. **Automatic Re-execution**
   ```typescript
   // Convex detects games table change
   // Re-runs getAdminDashboardMetrics automatically
   // New result: { liveGames: 3, scheduledGames: 7 }
   // WebSocket pushes update to frontend
   ```

5. **UI Update**
   ```typescript
   // React component automatically re-renders
   // adminMetrics = { liveGames: 3, scheduledGames: 7 }
   // Live games counter updates from 2 → 3
   // Status indicator changes to "live" state
   ```

## 🎮 Live Game Updates

### **Real-Time Score Updates**
```typescript
// 1. Score update comes from external API
POST /api/games/score
{
  "gameId": "game_123",
  "homeScore": 21,
  "awayScore": 14,
  "eventType": "touchdown"
}

// 2. HTTP Action processes update
export const updateGameScore = httpAction(async (ctx, request) => {
  await ctx.runMutation(internal.sports.updateScore, data);
});

// 3. Mutation updates database
export const updateScore = internalMutation({
  handler: async (ctx, args) => {
    // Update game record
    await ctx.db.patch(args.gameId, {
      home_score: args.homeScore,
      away_score: args.awayScore
    });

    // Add game event
    await ctx.db.insert("game_events", {
      game_id: args.gameId,
      event_type: "score",
      description: "Touchdown - 7 points"
    });
  }
});

// 4. All subscribed components update automatically:
// - Game detail page (live score)
// - Admin dashboard (live games count)
// - Games carousel (score display)
// - Homepage hero (if featured game)
```

## 🔍 Data Dependencies

### **Component → Query Dependencies**
```typescript
// Admin Dashboard
adminMetrics = useQuery(api.admin.getAdminDashboardMetrics)
├── Depends on: games table
├── Depends on: content table
├── Depends on: users table
└── Updates when: any of these tables change

// Games Carousel
games = useQuery(api.sports.getAllGames)
├── Depends on: games table
├── Depends on: teams table (via relation)
└── Updates when: game status/scores change

// Live Game Page
gameDetail = useQuery(api.sports.getGameById, { gameId })
gameEvents = useQuery(api.sports.getGameEvents, { gameId })
├── Depends on: specific game record
├── Depends on: game_events table
└── Updates when: score/events added
```

## 🚨 Error Handling & Loading States

### **State Transitions**
```typescript
// Loading State
adminMetrics = undefined
// → Show loading spinner

// Success State
adminMetrics = { liveGames: 2, scheduledGames: 8 }
// → Render data

// Error State
adminMetrics = null
// → Show error message

// Real-time Update
adminMetrics = { liveGames: 3, scheduledGames: 7 }
// → Automatic UI update (no loading state)
```

## 🔐 Security & Performance

### **Query Optimization**
- **Indexes**: Queries use database indexes for performance
- **Filtering**: Server-side filtering reduces data transfer
- **Caching**: Convex caches query results intelligently
- **Batching**: Multiple queries batched in single WebSocket message

### **Security Model**
```typescript
// Admin queries require authentication
export const getAdminDashboardMetrics = query({
  handler: async (ctx) => {
    // Authentication check (currently bypassed in dev)
    const auth = await requireAdminAuth(ctx);

    // Query data with user context
    const allGames = await ctx.db.query("games").collect();
    return aggregatedMetrics;
  }
});
```

## 📱 Cross-Platform Consistency

All platforms (web, mobile, admin) receive the same real-time updates simultaneously:
- **Web App**: Instant UI updates
- **Admin Dashboard**: Live metrics and controls
- **Mobile**: Push notifications for major events
- **External Systems**: Webhook notifications

This ensures consistent data across all touchpoints without manual synchronization.

---

## 🔗 Related Documentation

- [Technical Overview](./TECHNICAL_OVERVIEW.md) - High-level architecture
- [API Documentation](./API_DOCUMENTATION.md) - HTTP endpoints and Convex functions
- [Admin Guide](./ADMIN_GUIDE.md) - Admin dashboard usage
- [Developer Guide](./DEVELOPER_GUIDE.md) - Development setup and patterns