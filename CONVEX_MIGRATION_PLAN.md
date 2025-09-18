# Convex Migration Plan & Deployment Guide

## 🎯 Migration Overview

This migration plan safely cleans up your Convex backend while preserving all existing data and enhancing capabilities for:
- Live game data tracking
- Enhanced content management
- Improved user activity tracking  
- Comprehensive HTTP API for live updates

## 📋 Migration Checklist

### Phase 1: Pre-Migration Setup ✅
- [✅] Created migration scripts (`convex/migrations.ts`)
- [✅] Created enhanced schema (`convex/schema-enhanced.ts`) 
- [✅] Created enhanced live game APIs (`convex/liveGameActions.ts`)
- [✅] Updated HTTP routing (`convex/http.ts`)

### Phase 2: Data Analysis & Backup
- [ ] Run data integrity check
- [ ] Backup current deployment
- [ ] Document current API usage

### Phase 3: Schema Migration
- [ ] Deploy enhanced schema
- [ ] Run data migrations
- [ ] Verify data integrity

### Phase 4: API Enhancement
- [ ] Deploy new HTTP actions
- [ ] Test live game endpoints
- [ ] Update frontend integrations

### Phase 5: Cleanup
- [ ] Remove unused functions
- [ ] Clean up unused tables
- [ ] Performance optimization

## 🚀 Step-by-Step Deployment

### Step 1: Check Current Data
```bash
# Run data integrity check
npx convex run migrations:checkDataIntegrity
```

### Step 2: Backup Your Data
```bash
# Export current data (recommended before major changes)
npx convex export --output convex-backup-$(date +%Y%m%d).zip
```

### Step 3: Deploy Migration Scripts
```bash
# Deploy the migration functions first
npx convex deploy
```

### Step 4: Run Migrations
```bash
# Check what data you have
npx convex run migrations:checkDataIntegrity

# Run all migrations in sequence
npx convex run migrations:runAllMigrations
```

### Step 5: Update Schema (Critical Step)
```bash
# Replace your current schema.ts with the enhanced version
cp convex/schema-enhanced.ts convex/schema.ts

# Deploy the new schema
npx convex deploy
```

### Step 6: Test Enhanced APIs

#### Test Live Game Endpoints
```bash
# Start a live game
curl -X POST https://your-convex-site.convex.cloud/api/games/start \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "your-game-id",
    "startTime": "2024-01-15T19:00:00Z",
    "lineups": {
      "home": ["player1", "player2"],
      "away": ["player3", "player4"]
    }
  }'

# Update score
curl -X POST https://your-convex-site.convex.cloud/api/games/score \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "your-game-id",
    "homeScore": 14,
    "awayScore": 10,
    "period": 1,
    "timeLeft": "12:34"
  }'

# Add game event
curl -X POST https://your-convex-site.convex.cloud/api/games/events \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "your-game-id",
    "eventType": "score",
    "description": "Touchdown by Player Name",
    "period": 1,
    "timeRemaining": "12:34"
  }'

# Get live games
curl https://your-convex-site.convex.cloud/api/games/live

# Get game state
curl https://your-convex-site.convex.cloud/api/games/state/your-game-id
```

## 📊 Enhanced Schema Features

### New Tables Added:
- `user_activity` - Comprehensive user interaction tracking
- `shows` - Better organization for shows/podcasts
- `seasons` - Enhanced season management  
- `episodes` - Improved episode structure

### Enhanced Existing Tables:
- `games` - Added live streaming, attendance, weather
- `players` - Added physical stats, bio, social links
- `teams` - Added colors, social links, conference info
- `content` - Added analytics, premium features
- `users` - Added preferences, notifications, analytics

### Removed Tables:
- `Teams` (duplicate)
- `analytics_events` (empty)  
- `genres` (empty)
- `viewing_history` (empty)

## 🔗 New HTTP API Endpoints

### Core Game Management
- `POST /api/games/start` - Start live game
- `POST /api/games/end` - End game with final scores
- `POST /api/games/score` - Update live scores
- `POST /api/games/period` - Update game period/quarter

### Live Game Events
- `POST /api/games/events` - Add single game event
- `POST /api/games/events/bulk` - Add multiple events

### Enhanced Features
- `POST /api/games/stats` - Update attendance, viewers, weather
- `POST /api/games/broadcast` - Update broadcast/streaming info
- `POST /api/games/webhook` - Generic webhook for integrations

### Data Retrieval
- `GET /api/games/state/{gameId}` - Get current game state
- `GET /api/games/live` - Get all live games

### Legacy Support
- `POST /api/games/legacy/score` - Backward compatibility
- `GET /api/games/status/{gameId}` - Original status endpoint

## 🔒 Security & API Keys

### Environment Variables Needed:
```bash
# Add to your Convex environment
LIVE_GAME_API_KEY=your-secure-api-key-here
```

### API Authentication:
- Webhook endpoints require `X-API-Key` header
- Public endpoints (GET) are open for real-time data
- Mutation endpoints can be secured as needed

## 📈 Performance Optimizations

### New Indexes Added:
- Games: `by_live`, `by_date`, `by_teams`  
- User Activity: `by_user_type`, `by_content`, `by_game`
- Content: `by_premium`, `by_published`
- Players: Search index for name lookup

### Caching Strategy:
- Live games: 10-second cache
- Game states: No cache (real-time)
- Static content: Longer cache headers

## 🧹 Cleanup Phase

### Functions to Remove (After Migration):
```bash
# Check which functions are unused
npx convex function-analyzer

# Remove unused blog functions if blog system not needed
# Remove legacy game functions after testing
```

### Tables to Remove from Schema:
After confirming migration success, remove these from schema.ts:
- `Teams` table definition
- `analytics_events` table definition  
- `genres` table definition
- `viewing_history` table definition
- Blog tables (if blog system not needed)

## 🚨 Rollback Plan

If something goes wrong:

1. **Immediate Rollback:**
```bash
# Restore from backup
npx convex restore convex-backup-YYYYMMDD.zip
```

2. **Schema Rollback:**
```bash
# Revert to original schema
git checkout HEAD~1 convex/schema.ts
npx convex deploy
```

3. **Partial Rollback:**
- Keep new HTTP endpoints, revert schema changes
- Keep schema changes, disable new endpoints

## 📝 Post-Migration Tasks

### Monitoring:
- [ ] Set up error monitoring for new endpoints
- [ ] Monitor API usage patterns
- [ ] Track live game update performance

### Documentation:
- [ ] Update frontend integration docs
- [ ] Create API documentation for partners
- [ ] Update deployment procedures

### Testing:
- [ ] Load test live game endpoints
- [ ] Test user activity tracking
- [ ] Verify all existing features work

## 💡 Migration Benefits

### Performance:
- Faster live game queries with better indexes
- Reduced schema complexity
- Optimized user activity tracking

### Features:
- Real-time game events and scoring
- Enhanced user engagement tracking
- Better content organization
- Comprehensive live game APIs

### Maintenance:  
- Cleaner codebase with unused code removed
- Better organized schema
- Standardized API patterns

## ⚠️ Migration Risks & Mitigation

### Low Risk:
- New tables/fields added (no data loss)
- Enhanced HTTP endpoints (backward compatible)
- Better indexes (performance improvement)

### Medium Risk:
- Schema field migrations (test thoroughly)
- Function cleanup (keep backups)

### High Risk Items:
- None - all changes preserve existing data

### Mitigation:
- Full backup before migration
- Staged deployment process
- Legacy endpoint preservation  
- Rollback plan ready

---

## 🎉 Ready to Deploy?

Your migration is designed to be **zero-downtime** and **data-safe**. All existing functionality will continue working while new features become available.

Would you like me to help you execute any specific part of this migration plan?