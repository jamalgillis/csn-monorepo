# Hero Image URL Database Migration Plan

**Created:** 2025-01-16
**Schema Change:** Added `hero_image_url` field to `games` table
**Risk Level:** 🟢 LOW (backward-compatible optional field)

---

## 📋 Summary of Changes

### Schema Changes
**File:** `convex/schema.ts` (Line 192)

**Change:**
```typescript
games: defineTable({
  // ... existing fields ...
  video_url: v.optional(v.string()),
  hero_image_url: v.optional(v.string()), // ← NEW FIELD
  related_content_ids: v.optional(v.array(v.id("content"))),
  // ... rest of fields ...
})
```

### Query Changes
**File:** `convex/sports.ts` (Lines 882, 968)

**Change:** Updated thumbnail priority in `getHeroCarouselContent` query:
```typescript
// BEFORE
thumbnail: homeTeam.logo_url || "/placeholder-game.jpg",

// AFTER
thumbnail: game.hero_image_url || homeTeam.logo_url || "/placeholder-game.jpg",
```

---

## ✅ Why This Migration is Safe

### 1. **Optional Field**
- ✅ `v.optional(v.string())` - Field is NOT required
- ✅ Existing games without this field will continue to work
- ✅ No data migration needed for existing records

### 2. **Backward Compatible**
- ✅ Fallback chain ensures images always display:
  - 1st: `game.hero_image_url` (new, may be null)
  - 2nd: `homeTeam.logo_url` (existing fallback)
  - 3rd: `"/placeholder-game.jpg"` (final fallback)

### 3. **No Breaking Changes**
- ✅ No existing queries broken
- ✅ No existing mutations broken
- ✅ No UI components broken if field is null
- ✅ Gradual adoption - can add hero images to games over time

### 4. **Indexed Fields Unchanged**
- ✅ No changes to indexed fields (`by_sport` index still on `sport_id`)
- ✅ No performance impact on existing queries

---

## 🚀 Deployment Steps

### Step 1: Test in Development ✅ (Already Done)
```bash
# Development deployment (already tested)
CONVEX_DEPLOYMENT=dev:quick-chameleon-247 npx convex deploy
```

**Verification:**
- ✅ Check Convex dashboard for schema update
- ✅ Test hero carousel displays correctly
- ✅ Verify fallback images work when hero_image_url is null

### Step 2: Deploy to Production
```bash
# Production deployment
CONVEX_DEPLOYMENT=prod:quick-chameleon-247 npx convex deploy
```

**What Happens:**
1. Convex automatically adds the new optional field to schema
2. Existing games will have `hero_image_url: undefined`
3. Queries will use fallback chain (logo_url → placeholder)
4. No downtime or data migration needed

### Step 3: Verify Production
```bash
# Check production deployment status
CONVEX_DEPLOYMENT=prod:quick-chameleon-247 npx convex status
```

**Post-Deployment Checks:**
- [ ] Hero carousel loads on homepage
- [ ] Live games display with proper images
- [ ] Scheduled games display with proper images
- [ ] Fallback images work (logo → placeholder)
- [ ] No console errors in browser
- [ ] No Convex query errors in dashboard

### Step 4: Gradual Data Population (Optional)
Once deployed, you can gradually add hero images to games:

```typescript
// Example: Update a game with hero image
await ctx.db.patch(gameId, {
  hero_image_url: "https://example.com/game-hero-image.jpg"
});
```

**Suggested Approach:**
1. Start with upcoming high-profile games
2. Add hero images for live games
3. Populate historical games as needed
4. Hero images are purely optional - games without them still work perfectly

---

## 📊 Data Flow After Migration

```
┌─────────────────────────────────────────────────────────┐
│                  Hero Carousel Query                    │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │  Game Record from Database    │
        ├───────────────────────────────┤
        │  hero_image_url: string | null│ ← NEW FIELD
        │  home_team_id: Id<"teams">    │
        │  ... other fields ...         │
        └───────────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │     Image Priority Resolution         │
        ├───────────────────────────────────────┤
        │                                       │
        │  1. game.hero_image_url exists?       │
        │     ✓ YES → Use hero_image_url        │
        │     ✗ NO  ↓                          │
        │                                       │
        │  2. homeTeam.logo_url exists?         │
        │     ✓ YES → Use team logo             │
        │     ✗ NO  ↓                          │
        │                                       │
        │  3. Use "/placeholder-game.jpg"       │
        │                                       │
        └───────────────┬───────────────────────┘
                        │
                        ▼
            ┌─────────────────────────┐
            │  Display in Carousel    │
            └─────────────────────────┘
```

---

## 🧪 Testing Scenarios

### Scenario 1: New Game with Hero Image ✅
```typescript
{
  home_team_id: teamA,
  away_team_id: teamB,
  hero_image_url: "https://cdn.example.com/game-hero.jpg", // ← NEW
  // ... other fields
}
```
**Expected:** Carousel displays hero image

### Scenario 2: Existing Game (No Hero Image) ✅
```typescript
{
  home_team_id: teamA,
  away_team_id: teamB,
  // hero_image_url: undefined (field not set)
  // ... other fields
}
```
**Expected:** Carousel displays homeTeam.logo_url (fallback works)

### Scenario 3: Game with Null Hero Image ✅
```typescript
{
  home_team_id: teamA,
  away_team_id: teamB,
  hero_image_url: null, // ← Explicitly null
  // ... other fields
}
```
**Expected:** Carousel displays homeTeam.logo_url (fallback works)

### Scenario 4: Team Without Logo ✅
```typescript
{
  home_team_id: teamA, // Team has logo_url: null
  away_team_id: teamB,
  hero_image_url: null,
  // ... other fields
}
```
**Expected:** Carousel displays "/placeholder-game.jpg" (final fallback)

---

## 🔄 Rollback Plan

**If Issues Occur:**

### Option 1: Quick Fix (Remove Field Usage)
```bash
# Revert sports.ts query changes only
git checkout HEAD -- convex/sports.ts
npx convex deploy
```
**Result:** Hero images won't be used, but field remains in schema (harmless)

### Option 2: Full Rollback (Remove Field)
```bash
# Revert both schema and query changes
git checkout HEAD -- convex/schema.ts convex/sports.ts
npx convex deploy
```
**Result:** Complete rollback to previous state

### Option 3: Emergency Rollback (Convex Dashboard)
1. Go to Convex Dashboard
2. Navigate to Schema tab
3. Remove `hero_image_url` field from `games` table
4. Deploy schema change

**Note:** Convex allows removing optional fields safely since they're not required

---

## 📝 Pre-Deployment Checklist

- [x] Schema change is optional field (`v.optional()`)
- [x] Fallback chain implemented for null values
- [x] No breaking changes to existing queries
- [x] No changes to indexed fields
- [x] Build succeeds locally (`pnpm run build`)
- [x] Development deployment tested
- [ ] Production deployment approved
- [ ] Post-deployment verification plan ready
- [ ] Rollback plan documented

---

## 🎯 Post-Deployment Tasks

### Immediate (Within 1 hour)
- [ ] Verify production hero carousel loads
- [ ] Check Convex dashboard for errors
- [ ] Monitor browser console for errors
- [ ] Test navigation on production site

### Short-term (Within 1 day)
- [ ] Identify high-priority games for hero images
- [ ] Upload hero images for upcoming games
- [ ] Test hero image display in production

### Long-term (Within 1 week)
- [ ] Create admin interface for uploading hero images
- [ ] Document hero image upload process
- [ ] Train content managers on hero image workflow

---

## 📞 Contacts & Resources

**Schema Documentation:**
- `docs/HERO_CAROUSEL_ARCHITECTURE.md` - Complete architecture
- `docs/COMPONENT_REFERENCE.md` - Component API reference
- `docs/CHANGELOG.md` - Version history

**Convex Resources:**
- Dashboard: https://dashboard.convex.dev
- Schema Migrations: https://docs.convex.dev/database/schemas
- Optional Fields: https://docs.convex.dev/database/schemas#optional-fields

**Deployment Commands:**
```bash
# Check current deployment
npx convex status

# Deploy to development
CONVEX_DEPLOYMENT=dev:quick-chameleon-247 npx convex deploy

# Deploy to production
CONVEX_DEPLOYMENT=prod:quick-chameleon-247 npx convex deploy

# View logs
npx convex logs
```

---

**Migration Status:** ✅ READY FOR PRODUCTION
**Risk Assessment:** 🟢 LOW RISK (Backward-compatible optional field)
**Estimated Downtime:** ⚡ ZERO (No downtime required)
**Rollback Available:** ✅ YES (Can revert instantly)

---

**Prepared by:** Claude Code Assistant
**Date:** 2025-01-16
**Version:** 1.0
