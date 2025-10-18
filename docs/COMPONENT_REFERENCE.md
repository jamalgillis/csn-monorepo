# Component Reference

This document provides detailed information about key components in the CSN Sports Platform.

## Table of Contents
- [Hero Components](#hero-components)
- [Game Components](#game-components)
- [Show Components](#show-components)
- [Admin Components](#admin-components)

---

## Hero Components

### HeroCarouselUpdate

**File:** `components/hero/hero-carousel-update.tsx`
**Added:** 2025-01-16
**Status:** ✅ Active

Full-screen hero carousel with auto-rotation, showcasing live games, shows, and featured content.

#### Overview
A minimalist, full-viewport carousel component that displays dynamic content from Convex backend. Features automatic rotation, manual navigation controls, and click-to-navigate functionality while maintaining a clean, broadcast-quality aesthetic.

#### Features
- 🔄 **Auto-rotation:** 8-second intervals with smart pause/resume
- 🎯 **Multiple Content Types:** Live games, shows, scheduled events, featured content
- 📱 **Responsive Design:** Full viewport on all screen sizes
- 🎨 **Minimalist Aesthetic:** Clean typography with mix-blend-difference effects
- ⚡ **Real-time Data:** Live updates via Convex subscriptions
- 🖱️ **Interactive:** Click anywhere to navigate to content

#### Props
This component doesn't accept props - it fetches data automatically via Convex.

#### Data Requirements
**Convex Query:** `api.sports.getHeroCarouselContent`

**Expected Response:**
```typescript
{
  items: CarouselItem[],
  hasLiveContent: boolean,
  liveGameCount: number,
  featuredShowCount: number
}
```

#### Data Flow Architecture

**Complete Data Flow (Database → Component):**
```
┌─────────────────────────────────────────────────────────────┐
│                    Convex Database                          │
└───┬─────────────┬─────────────────┬──────────────┬──────────┘
    │             │                 │              │
    │ games       │ teams           │ content      │ sports
    │ table       │ table           │ table        │ table
    │             │                 │              │
    ▼             ▼                 ▼              ▼
┌───────────────────────────────────────────────────────────────┐
│      api.sports.getHeroCarouselContent (sports.ts:856)        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 1. Query live games        (priority: 1)                │ │
│  │ 2. Query featured shows    (priority: 2)                │ │
│  │ 3. Query today's games     (priority: 3)                │ │
│  │ 4. Query featured content  (priority: 4)                │ │
│  │ 5. Query upcoming games    (priority: 5)                │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                                │
│                              ▼                                │
│                    Sort by priority                           │
│                              │                                │
│                              ▼                                │
│              Build CarouselItem[] array                       │
└──────────────────────────────┬────────────────────────────────┘
                               │
                               │ Real-time subscription
                               │
                               ▼
        ┌──────────────────────────────────────────┐
        │  useQuery(api.sports.getHeroCarouselContent)  │
        │  (hero-carousel-update.tsx:39)           │
        └───────────────────┬──────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    Component State Management         │
        │  - currentIndex                       │
        │  - isAutoPlaying                      │
        │  - isPaused                           │
        └───────────────────┬───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    Render Current Slide               │
        │  <img src={currentItem.thumbnail} />  │
        └───────────────────────────────────────┘
```

#### Image Source Priority System

**For Live & Scheduled Games:**
```
┌──────────────────────────────────────────────────────────┐
│                    Image Resolution                      │
│                                                          │
│  Step 1: Check game.hero_image_url                      │
│  ┌────────────────────────────┐                         │
│  │  games.hero_image_url      │ ← NEW (2025-01-16)      │
│  └─────────┬──────────────────┘                         │
│            │                                             │
│            ├─ [EXISTS] ─────────────────┐               │
│            │                             ▼               │
│            │                    ┌──────────────────┐    │
│            │                    │  USE THIS IMAGE  │    │
│            │                    └──────────────────┘    │
│            │                                             │
│            └─ [EMPTY/NULL]                              │
│                     │                                    │
│                     ▼                                    │
│  Step 2: Fallback to team logo                          │
│  ┌────────────────────────────┐                         │
│  │  teams.logo_url            │ ← Existing              │
│  └─────────┬──────────────────┘                         │
│            │                                             │
│            ├─ [EXISTS] ─────────────────┐               │
│            │                             ▼               │
│            │                    ┌──────────────────┐    │
│            │                    │  USE THIS IMAGE  │    │
│            │                    └──────────────────┘    │
│            │                                             │
│            └─ [EMPTY/NULL]                              │
│                     │                                    │
│                     ▼                                    │
│  Step 3: Use hardcoded placeholder                      │
│  ┌────────────────────────────────┐                     │
│  │  "/placeholder-game.jpg"       │ ← Default           │
│  └─────────┬──────────────────────┘                     │
│            │                                             │
│            ▼                                             │
│   ┌──────────────────┐                                  │
│   │  USE THIS IMAGE  │                                  │
│   └──────────────────┘                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**For Shows & Featured Content:**
```
┌──────────────────────────────────────────────────────────┐
│                    Image Resolution                      │
│                                                          │
│  Step 1: Check backdrop URL                             │
│  ┌────────────────────────────┐                         │
│  │  content.backdrop_url      │ ← Primary (16:9)        │
│  └─────────┬──────────────────┘                         │
│            │                                             │
│            ├─ [EXISTS] ─────────────────┐               │
│            │                             ▼               │
│            │                    ┌──────────────────┐    │
│            │                    │  USE THIS IMAGE  │    │
│            │                    └──────────────────┘    │
│            │                                             │
│            └─ [EMPTY/NULL]                              │
│                     │                                    │
│                     ▼                                    │
│  Step 2: Fallback to poster                             │
│  ┌────────────────────────────┐                         │
│  │  content.poster_url        │ ← Fallback (Portrait)   │
│  └─────────┬──────────────────┘                         │
│            │                                             │
│            ├─ [EXISTS] ─────────────────┐               │
│            │                             ▼               │
│            │                    ┌──────────────────┐    │
│            │                    │  USE THIS IMAGE  │    │
│            │                    └──────────────────┘    │
│            │                                             │
│            └─ [EMPTY/NULL]                              │
│                     │                                    │
│                     ▼                                    │
│              ┌─────────────┐                             │
│              │  NO IMAGE   │ (Shows fallback SVG)        │
│              └─────────────┘                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Database Schema Relationships

**Image Field Locations:**
```
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE TABLES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐       ┌──────────────────┐              │
│  │   games table    │       │   teams table    │              │
│  ├──────────────────┤       ├──────────────────┤              │
│  │ _id              │◄──┐   │ _id              │              │
│  │ home_team_id ────┼───┴──►│ name             │              │
│  │ away_team_id ────┼───┬──►│ slug             │              │
│  │ sport_id         │   │   │ logo_url ────────┼─► Team Logo  │
│  │ game_date        │   │   │ city             │              │
│  │ status           │   │   │ state            │              │
│  │ hero_image_url ──┼─► │   └──────────────────┘              │
│  │   (NEW!)         │   │                                      │
│  │ video_url        │   │   ┌──────────────────┐              │
│  │ venue            │   │   │  content table   │              │
│  │ home_score       │   │   ├──────────────────┤              │
│  │ away_score       │   │   │ _id              │              │
│  └──────────────────┘   │   │ type             │              │
│          │              │   │ title            │              │
│          │              │   │ description      │              │
│          ▼              │   │ backdrop_url ────┼─► 16:9 Image │
│  ┌──────────────────┐   │   │ poster_url ──────┼─► Portrait  │
│  │  sports table    │   │   │ video_url        │              │
│  ├──────────────────┤   │   │ featured         │              │
│  │ _id              │◄──┘   │ status           │              │
│  │ name             │       └──────────────────┘              │
│  │ slug             │                                          │
│  │ icon_url ────────┼─► Sport Icon                            │
│  └──────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Legend:
  ─► : Image URL field
  ──► : Foreign key relationship
```

**CarouselItem Interface:**
```typescript
interface CarouselItem {
  id: string
  type: "live_game" | "live_show" | "scheduled_game" | "featured_content" | "upcoming_game"
  priority: number
  title: string
  subtitle: string
  thumbnail: string
  isLive: boolean
  navigationUrl: string
  homeTeam?: string
  awayTeam?: string
  homeScore?: number
  awayScore?: number
  sport?: string
  quarter?: string
  timeLeft?: string
  gameTime?: string
  venue?: string
  showTitle?: string
  host?: string
  description?: string
  videoUrl?: string
}
```

#### State Management

**Internal State:**
- `currentIndex: number` - Current slide index (0-based)
- `isAutoPlaying: boolean` - Auto-rotation enabled/disabled
- `isPaused: boolean` - Temporary pause state

**State Flow:**
1. Component mounts → Starts auto-rotation
2. User clicks navigation → Pauses for 15 seconds
3. After 15s → Resumes auto-rotation
4. User clicks slide → Navigates to content URL

#### Navigation Controls

**Bottom-Right Controls:**
- **Previous Button:** ChevronLeft icon, advances to previous slide
- **Dot Indicators:** Visual position markers, clickable for direct navigation
- **Next Button:** ChevronRight icon, advances to next slide
- **Play/Pause Button:** Toggles auto-rotation on/off

**Keyboard Accessibility:**
- All controls are keyboard accessible
- ARIA labels provided for screen readers

#### Styling

**Layout:**
```css
.hero-carousel {
  position: relative;
  width: 100svw;
  height: 100svh;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  scroll-snap-align: start;
}
```

**Typography:**
```css
.hero-title {
  font-size: clamp(2xl, 5xl, 8xl); /* Responsive */
  text-transform: uppercase;
  font-weight: 900;
  color: rgb(248 250 252); /* slate-50 */
  mix-blend-mode: difference;
}
```

**Colors:**
- Background: `bg-slate-900`
- Overlay: `bg-black opacity-25`
- Text: `text-slate-50`
- Hover: `hover:text-slate-300`

#### Auto-Rotation Logic

**Timing:**
- Slide duration: 8000ms (8 seconds)
- Manual pause duration: 15000ms (15 seconds)
- Transition duration: 300ms

**Behavior:**
```typescript
// Auto-advance every 8 seconds
useEffect(() => {
  if (!isAutoPlaying || isPaused || !carouselData?.items.length) return

  const interval = setInterval(() => {
    setCurrentIndex(prev =>
      prev === carouselData.items.length - 1 ? 0 : prev + 1
    )
  }, 8000)

  return () => clearInterval(interval)
}, [isAutoPlaying, isPaused, carouselData?.items.length])
```

**Pause on Interaction:**
```typescript
const goToSlide = useCallback((index: number) => {
  setCurrentIndex(index)
  setIsPaused(true)
  setTimeout(() => setIsPaused(false), 15000)
}, [])
```

#### Usage Example

**Basic Usage:**
```tsx
import { HeroCarouselUpdate } from "@/components/hero/hero-carousel-update"

export default function HomePage() {
  return (
    <main>
      <HeroCarouselUpdate />
      <section>{/* Other content */}</section>
    </main>
  )
}
```

**With Scroll Snapping:**
```tsx
<div className="snap-y snap-mandatory h-screen overflow-y-scroll">
  <HeroCarouselUpdate />
  <section className="snap-start h-screen">
    {/* Next section */}
  </section>
</div>
```

#### Fallback Behavior

When no carousel data is available:
- Displays static "254 podcast studios" screen
- Shows placeholder background with microphone icon
- Maintains same layout and styling
- No interactive controls shown

#### Performance Considerations

**Optimizations:**
- Uses `useCallback` for navigation functions to prevent re-renders
- Cleans up interval on unmount
- Loads images with `loading="eager"` for hero content
- Minimal re-renders with proper dependency arrays

**Image Loading:**
- Images loaded eagerly (above fold)
- Fallback placeholder for failed loads
- Object-fit: cover for consistent sizing

#### Accessibility

**ARIA Labels:**
- Previous slide: `aria-label="Previous slide"`
- Next slide: `aria-label="Next slide"`
- Dot indicators: `aria-label="Go to slide {n}"`
- Play/Pause: `aria-label="Pause autoplay" | "Start autoplay"`

**Keyboard Navigation:**
- All buttons are keyboard accessible
- Event handlers properly handle `stopPropagation` to prevent conflicts

#### Browser Compatibility

**Tested On:**
- Chrome 120+
- Safari 17+
- Firefox 121+
- Edge 120+

**CSS Features Used:**
- CSS Grid
- SVG viewport units (`svw`, `svh`)
- `mix-blend-mode: difference`
- Modern Tailwind utilities

#### Troubleshooting

**No slides showing:**
- Check Convex connection status
- Verify `api.sports.getHeroCarouselContent` returns data
- Check console for TypeScript errors

**Auto-rotation not working:**
- Verify `isAutoPlaying` state is `true`
- Check that `carouselData.items.length > 0`
- Look for interval cleanup issues

**Navigation not working:**
- Check `navigationUrl` field in carousel items
- Verify Next.js router is working
- Check for click event propagation issues

#### Related Components
- `HeroCarousel` - Original hero carousel (deprecated)
- `LiveSportsHero` - Alternative hero component for single live game

#### Changelog

**2025-01-16 - Initial Release**
- Added full carousel functionality
- Implemented auto-rotation with 8s intervals
- Added navigation controls (prev/next/dots/play-pause)
- Integrated Convex real-time data
- Preserved minimalist design from original mockup

---

## Game Components

*(Documentation to be added)*

## Show Components

*(Documentation to be added)*

## Admin Components

*(Documentation to be added)*
