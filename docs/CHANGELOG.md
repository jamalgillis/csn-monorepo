# Changelog

All notable changes to the CSN Sports Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2025-01-16

#### Hero Image Database Integration
Enhanced hero carousel to pull background images from database with proper fallback system.

**Schema Changes:**
- Added `hero_image_url` field to `games` table (convex/schema.ts:192)
- Optional string field for dedicated hero carousel images

**Image Priority System:**
```
Games (Live & Scheduled):
┌─────────────────────┐
│ game.hero_image_url │ ← 1st Priority (NEW)
└──────────┬──────────┘
           │ (if empty)
           ▼
┌─────────────────────┐
│ homeTeam.logo_url   │ ← 2nd Priority (Fallback)
└──────────┬──────────┘
           │ (if empty)
           ▼
┌─────────────────────────────┐
│ "/placeholder-game.jpg"     │ ← 3rd Priority (Default)
└─────────────────────────────┘

Shows & Featured Content:
┌─────────────────────────┐
│ content.backdrop_url    │ ← 1st Priority
└──────────┬──────────────┘
           │ (if empty)
           ▼
┌─────────────────────────┐
│ content.poster_url      │ ← 2nd Priority (Fallback)
└─────────────────────────┘
```

**Modified Files:**
- `convex/schema.ts` - Added hero_image_url field
- `convex/sports.ts:882` - Updated live games query
- `convex/sports.ts:968` - Updated scheduled games query

**Image Recommendations:**
- Dimensions: 1920x1080 (16:9)
- Format: WebP or JPEG
- Size: < 500KB
- Works with 25% black overlay

---

#### Hero Carousel Enhancement (`hero-carousel-update.tsx`)
Enhanced the hero carousel component with full carousel functionality while preserving the minimalist design aesthetic.

**Key Features:**
- **Data Fetching & State Management** (lines 3-37)
  - Integrated Convex real-time data with `useQuery(api.sports.getHeroCarouselContent)`
  - State management for slide index, auto-play control, and pause status
  - TypeScript interface for carousel items supporting multiple content types

- **Auto-Rotation Logic** (lines 39-50)
  - 8-second auto-advance interval between slides
  - Automatic pause when user manually interacts with controls
  - 15-second resume timer after manual navigation

- **Navigation Functions** (lines 52-76)
  - `nextSlide()` - Advances to next carousel item
  - `prevSlide()` - Returns to previous carousel item
  - `goToSlide(index)` - Direct navigation to specific slide
  - `handleHeroClick()` - Click-to-navigate functionality for entire hero area

- **Dynamic Content Display** (lines 128-141)
  - Dynamic title updates from carousel data
  - Background thumbnail images change per slide
  - Full-hero clickable navigation to content pages

- **Navigation Controls** (lines 174-227)
  - Previous/Next arrow buttons (bottom-right placement)
  - Dot indicators showing carousel position
  - Play/Pause toggle for auto-rotation
  - Clean SVG icons matching minimalist design

- **Design Preservation**
  - Maintained exact grid layout (`grid-rows-3`, `snap-start`)
  - Preserved typography styling (`mix-blend-difference`, responsive font sizes)
  - Kept original color scheme (`slate-50`, `gray-900`)
  - Retained absolute positioning and z-index layering
  - Fallback state shows original "254 podcast studios" design

**Content Types Supported:**
- Live games with scores
- Live shows and podcasts
- Scheduled upcoming games
- Featured content
- General content items

**File Location:** `components/hero/hero-carousel-update.tsx`

**Dependencies:**
- Convex API (`api.sports.getHeroCarouselContent`)
- Next.js routing (`useRouter`)
- React hooks (`useState`, `useEffect`, `useCallback`)

---

## Version History

### [Initial Release] - 2025-01-01
- Initial platform setup with Next.js 15.2.4
- Convex backend integration
- Clerk authentication
- Admin dashboard
- Basic game, show, and team management
