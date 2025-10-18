# Hero Carousel Architecture Documentation

**Component:** `HeroCarouselUpdate`
**File:** `components/hero/hero-carousel-update.tsx`
**Backend:** `convex/sports.ts:856` (`getHeroCarouselContent`)
**Last Updated:** 2025-01-16

---

## 📊 Complete System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER EXPERIENCE LAYER                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                  Browser (Next.js App)                        │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │  Hero Carousel Component (hero-carousel-update.tsx)     │ │ │
│  │  │  • Auto-rotation (8s)                                   │ │ │
│  │  │  • Manual navigation                                    │ │ │
│  │  │  • Click-to-navigate                                    │ │ │
│  │  └────────────────────┬────────────────────────────────────┘ │ │
│  └───────────────────────┼──────────────────────────────────────┘ │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             │ useQuery (Real-time subscription)
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                    BACKEND LAYER (Convex)                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  getHeroCarouselContent Query (sports.ts:856)                │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │ Priority 1: Live Games (in_progress)                    │ │ │
│  │  │ Priority 2: Featured Shows (featured=true)              │ │ │
│  │  │ Priority 3: Today's Games (scheduled, today)            │ │ │
│  │  │ Priority 4: Featured Content (highlights, features)     │ │ │
│  │  │ Priority 5: Upcoming Games (next 7 days)                │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                             │                                       │
│                             │ Database Queries                      │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐  │
│  │                   Database Tables                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │  games   │  │  teams   │  │ content  │  │  sports  │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema (Image Fields)

### Complete Table Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                             │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────┐
│   games            │
├────────────────────┤
│ _id: Id<"games">   │
│ home_team_id       │────────┐
│ away_team_id       │────┐   │
│ sport_id           │──┐ │   │
│ game_date          │  │ │   │
│ status             │  │ │   │
│ home_score         │  │ │   │
│ away_score         │  │ │   │
│ venue              │  │ │   │
│ quarter            │  │ │   │
│ time_left          │  │ │   │
│ video_url          │  │ │   │
│ hero_image_url ────┼──┼─┼───┼─► Hero Carousel Background (NEW!)
└────────────────────┘  │ │   │
                        │ │   │
┌────────────────────┐  │ │   │
│   sports           │  │ │   │
├────────────────────┤  │ │   │
│ _id: Id<"sports">  │◄─┘ │   │
│ name               │    │   │
│ slug               │    │   │
│ description        │    │   │
│ icon_url ──────────┼────┼───┼─► Sport Icon Badge
└────────────────────┘    │   │
                          │   │
┌────────────────────┐    │   │
│   teams            │    │   │
├────────────────────┤    │   │
│ _id: Id<"teams">   │◄───┴───┘
│ name               │
│ slug               │
│ league             │
│ city               │
│ state              │
│ logo_url ──────────┼─────────► Team Logo (Fallback for games)
└────────────────────┘

┌────────────────────┐
│   content          │
├────────────────────┤
│ _id: Id<"content"> │
│ type               │
│ title              │
│ description        │
│ release_date       │
│ runtime            │
│ rating             │
│ tags               │
│ cast               │
│ poster_url ────────┼─────────► Portrait Image (2:3)
│ backdrop_url ──────┼─────────► Widescreen Image (16:9)
│ trailer_url        │
│ video_url          │
│ featured           │
│ trending           │
│ status             │
└────────────────────┘
```

---

## 🔄 Data Flow Diagram

### Frontend to Backend Communication

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE DATA FLOW                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Component Initialization                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Component Mounts                                               │
│         │                                                       │
│         ▼                                                       │
│  useQuery(api.sports.getHeroCarouselContent) ───┐              │
│         │                                        │              │
│         │                                    Establishes        │
│         ▼                                    real-time          │
│  Set up state:                               subscription       │
│  • currentIndex = 0                              │              │
│  • isAutoPlaying = true                          │              │
│  • isPaused = false                              │              │
│         │                                        │              │
│         ▼                                        │              │
│  Start auto-rotation interval (8s)               │              │
│                                                  │              │
└──────────────────────────────────────────────────┼──────────────┘
                                                   │
┌──────────────────────────────────────────────────▼──────────────┐
│ STEP 2: Backend Query Execution                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  getHeroCarouselContent()                                       │
│         │                                                       │
│         ├─► Query 1: Live Games                                │
│         │   • WHERE status = "in_progress"                     │
│         │   • JOIN teams, sports                               │
│         │   • BUILD carousel item with:                        │
│         │     - thumbnail = game.hero_image_url ||             │
│         │                   homeTeam.logo_url ||               │
│         │                   "/placeholder-game.jpg"            │
│         │                                                       │
│         ├─► Query 2: Featured Shows                            │
│         │   • WHERE featured = true AND type = "show"          │
│         │   • BUILD carousel item with:                        │
│         │     - thumbnail = show.backdrop_url ||               │
│         │                   show.poster_url                     │
│         │                                                       │
│         ├─► Query 3: Today's Scheduled Games                   │
│         │   • WHERE status = "scheduled" AND date = today      │
│         │   • JOIN teams, sports                               │
│         │   • BUILD carousel item (same image priority)        │
│         │                                                       │
│         ├─► Query 4: Featured Content                          │
│         │   • WHERE featured = true AND type IN (...types)     │
│         │   • BUILD carousel item with backdrop/poster         │
│         │                                                       │
│         └─► Query 5: Upcoming Games (if needed)                │
│             • WHERE status = "scheduled" AND date < +7 days    │
│                                                                 │
│         ▼                                                       │
│  Combine all items, sort by priority                           │
│         │                                                       │
│         ▼                                                       │
│  RETURN {                                                       │
│    items: CarouselItem[],                                      │
│    hasLiveContent: boolean,                                    │
│    liveGameCount: number,                                      │
│    featuredShowCount: number                                   │
│  }                                                              │
│                                                                 │
└─────────────────────────────────────────────┬───────────────────┘
                                              │
┌─────────────────────────────────────────────▼───────────────────┐
│ STEP 3: Frontend Receives Data                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  carouselData updated                                           │
│         │                                                       │
│         ▼                                                       │
│  Component re-renders                                           │
│         │                                                       │
│         ▼                                                       │
│  Display currentItem:                                           │
│  • <img src={currentItem.thumbnail} />                          │
│  • <h1>{currentItem.title}</h1>                                 │
│  • Navigation controls                                          │
│  • Slide indicators                                             │
│         │                                                       │
│         ▼                                                       │
│  Auto-rotation continues                                        │
│  (every 8 seconds, advance to next slide)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Real-time Updates (Automatic)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Database Change Detected                                       │
│  (e.g., game status changes to "in_progress")                  │
│         │                                                       │
│         ▼                                                       │
│  Convex triggers re-execution of query                          │
│         │                                                       │
│         ▼                                                       │
│  Frontend receives updated data                                 │
│         │                                                       │
│         ▼                                                       │
│  Component automatically re-renders with new data               │
│  (No page refresh needed!)                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖼️ Image Resolution Priority

### Game Images (Live & Scheduled)

```
┌───────────────────────────────────────────────────────────────┐
│               IMAGE RESOLUTION FLOWCHART                      │
│                    (Games Only)                               │
└───────────────────────────────────────────────────────────────┘

                    START: Need Game Image
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Check Database:     │
                    │ games.hero_image_url│
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
           [EXISTS]                      [NULL/EMPTY]
                │                             │
                ▼                             ▼
    ┌───────────────────────┐    ┌───────────────────────┐
    │ ✅ USE THIS IMAGE     │    │ Check Database:       │
    │ Source: Database      │    │ teams.logo_url        │
    │ Field: hero_image_url │    └──────────┬────────────┘
    │ Quality: Optimized    │               │
    │         for hero      │    ┌──────────┴──────────┐
    └───────────────────────┘    │                     │
                            [EXISTS]              [NULL/EMPTY]
                                 │                     │
                                 ▼                     ▼
                    ┌────────────────────┐  ┌─────────────────────┐
                    │ ✅ USE THIS IMAGE  │  │ ⚠️  USE PLACEHOLDER │
                    │ Source: Database   │  │ Source: Hardcoded   │
                    │ Field: logo_url    │  │ Path: /placeholder- │
                    │ Quality: Team logo │  │       game.jpg      │
                    │ Note: Not optimized│  └─────────────────────┘
                    │       for hero     │
                    └────────────────────┘

RECOMMENDATION: Always populate hero_image_url for best results!
                Dimensions: 1920x1080 (16:9)
                Format: WebP or JPEG
                Size: < 500KB
```

### Show & Content Images

```
┌───────────────────────────────────────────────────────────────┐
│               IMAGE RESOLUTION FLOWCHART                      │
│              (Shows & Featured Content)                       │
└───────────────────────────────────────────────────────────────┘

                START: Need Show/Content Image
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Check Database:     │
                    │ content.backdrop_url│
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
           [EXISTS]                      [NULL/EMPTY]
                │                             │
                ▼                             ▼
    ┌───────────────────────┐    ┌───────────────────────┐
    │ ✅ USE THIS IMAGE     │    │ Check Database:       │
    │ Source: Database      │    │ content.poster_url    │
    │ Field: backdrop_url   │    └──────────┬────────────┘
    │ Aspect: 16:9 (ideal!) │               │
    └───────────────────────┘    ┌──────────┴──────────┐
                                 │                     │
                            [EXISTS]              [NULL/EMPTY]
                                 │                     │
                                 ▼                     ▼
                    ┌────────────────────┐  ┌─────────────────────┐
                    │ ⚠️  USE THIS IMAGE │  │ ❌ NO IMAGE         │
                    │ Source: Database   │  │ Display: Fallback   │
                    │ Field: poster_url  │  │          SVG icon   │
                    │ Aspect: 2:3        │  │ (Microphone for     │
                    │ Note: Will be      │  │  podcast studios)   │
                    │       cropped!     │  └─────────────────────┘
                    └────────────────────┘

RECOMMENDATION: Always use backdrop_url for shows!
                Poster is portrait orientation and will be cropped.
```

---

## 🎬 Component State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│              HERO CAROUSEL STATE MACHINE                        │
└─────────────────────────────────────────────────────────────────┘

                        ┌─────────────┐
                        │   LOADING   │
                        │ (No data)   │
                        └──────┬──────┘
                               │
                               │ Data received
                               ▼
                    ┌──────────────────────┐
                    │   AUTO-PLAYING       │
                    │ • currentIndex       │
                    │ • isAutoPlaying=true │
                    │ • isPaused=false     │
                    └──────┬───────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    User clicks      Interval fires   User clicks
    nav control      (8 seconds)      slide/hero
          │                │                │
          ▼                ▼                ▼
    ┌─────────┐    ┌──────────────┐  ┌──────────┐
    │  PAUSED │    │ ADVANCE SLIDE│  │ NAVIGATE │
    │ (15s)   │    │ currentIndex++│  │ to URL   │
    └────┬────┘    └──────┬───────┘  └──────────┘
         │                │
         │ After 15s      │
         │                │
         └────────┬───────┘
                  │
                  ▼
           ┌─────────────────┐
           │  RESUME AUTO-   │
           │    PLAYING      │
           └─────────────────┘
                  │
                  │ Loop continues
                  │
                  ▼
        ┌──────────────────────┐
        │   AUTO-PLAYING       │
        └──────────────────────┘
```

---

## 📝 Code References

### Key Files & Line Numbers

| File | Lines | Description |
|------|-------|-------------|
| `convex/schema.ts` | 192 | `hero_image_url` field definition |
| `convex/sports.ts` | 856-1050 | `getHeroCarouselContent` query |
| `convex/sports.ts` | 882 | Live games image priority |
| `convex/sports.ts` | 918 | Shows image selection |
| `convex/sports.ts` | 968 | Scheduled games image priority |
| `convex/sports.ts` | 1005 | Featured content image selection |
| `components/hero/hero-carousel-update.tsx` | 1-288 | Complete component |
| `components/hero/hero-carousel-update.tsx` | 39 | Data fetching with `useQuery` |
| `components/hero/hero-carousel-update.tsx` | 45-55 | Auto-rotation logic |
| `components/hero/hero-carousel-update.tsx` | 145 | Image rendering |

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Run `npx convex deploy` to update schema
- [ ] Verify schema change doesn't break existing data
- [ ] Test with sample hero images
- [ ] Check fallback behavior (no images)
- [ ] Test real-time updates

### After Deploying

- [ ] Add `hero_image_url` to existing games via admin
- [ ] Monitor Convex dashboard for query performance
- [ ] Check image loading performance
- [ ] Verify mobile responsiveness
- [ ] Test with live games

---

## 💡 Best Practices

### Image Guidelines

1. **Dimensions**: 1920x1080 (16:9 aspect ratio)
2. **Format**: WebP preferred, JPEG acceptable
3. **File Size**: Keep under 500KB
4. **Content**: Action shots, stadium views, team matchups
5. **Overlay**: Design for 25% black overlay

### Performance Tips

1. Use CDN for image hosting
2. Enable image compression
3. Lazy load non-hero images
4. Cache carousel data appropriately
5. Monitor query execution time

### Database Management

1. Always populate `hero_image_url` for important games
2. Keep team logos up to date as fallbacks
3. Use backdrop_url for all shows/content
4. Include descriptive alt text in image URLs
5. Regular cleanup of unused images

---

**Documentation Version:** 1.0
**Last Updated:** 2025-01-16
**Maintainer:** Development Team
