# Developer Onboarding Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **pnpm** (package manager)
- **Git** for version control
- **VS Code** (recommended) with TypeScript and Tailwind extensions

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/your-org/sports-platform
cd sports-platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your environment variables (see Environment Setup below)

# Start development server
pnpm dev
```

### Environment Setup
Create `.env.local` file with:
```bash
# Convex Backend
NEXT_PUBLIC_CONVEX_URL=https://vibrant-pelican-556.convex.cloud
CONVEX_DEPLOYMENT=dev:vibrant-pelican-556

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Live Game API
LIVE_GAME_API_KEY=your-secure-api-key

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

## 🏗️ Project Structure Deep Dive

### Directory Organization
```
sports-platform/
├── app/                    # Next.js App Router (pages)
│   ├── (auth)/            # Auth-related pages (grouped route)
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes (if any)
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── layout/           # Layout components
│   ├── features/         # Feature-specific components
│   └── shared/           # Shared business components
├── convex/               # Backend (Convex)
│   ├── _generated/       # Auto-generated types and APIs
│   ├── schema.ts         # Database schema
│   ├── *.ts             # Backend functions
│   └── http.ts          # HTTP action routing
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configs
├── public/               # Static assets
├── styles/               # Additional stylesheets
└── docs/                 # Documentation (this folder)
```

### Key Files to Understand
- **`convex/schema.ts`**: Database schema definition
- **`app/layout.tsx`**: Root layout with providers
- **`components/ui/`**: Reusable UI components (shadcn/ui based)
- **`lib/utils.ts`**: Utility functions (cn, formatters, etc.)
- **`hooks/`**: Custom hooks for data fetching and state management

## 🎨 Frontend Development

### Component Architecture
We follow a **feature-based component organization**:

```
components/
├── ui/                    # Base components
│   ├── button.tsx        # Button variants
│   ├── input.tsx         # Input components
│   └── ...               # Other base UI components
├── layout/
│   ├── header.tsx        # Main navigation
│   ├── footer.tsx        # Site footer
│   └── sidebar.tsx       # Admin sidebar
├── features/
│   ├── games/
│   │   ├── game-card.tsx      # Game display component
│   │   ├── live-score.tsx     # Live scoring component
│   │   └── game-events.tsx    # Game events timeline
│   ├── shows/
│   │   ├── show-card.tsx      # Show/podcast card
│   │   ├── episode-list.tsx   # Episode listing
│   │   └── media-player.tsx   # Video/audio player
│   └── teams/
│       ├── team-card.tsx      # Team display card
│       ├── roster-table.tsx   # Player roster table
│       └── team-stats.tsx     # Team statistics
└── shared/
    ├── content-grid.tsx       # Generic content grid
    ├── search-bar.tsx         # Search functionality
    └── loading-spinner.tsx    # Loading states
```

### Styling System
We use **Tailwind CSS** with a custom sports theme:

```typescript
// tailwind.config.js themes
const colors = {
  primary: {
    50: '#fef2f2',   // Light red
    500: '#ef4444',  // Main red
    900: '#7f1d1d',  // Dark red
  },
  secondary: {
    50: '#eff6ff',   // Light blue
    500: '#3b82f6',  // Main blue  
    900: '#1e3a8a',  // Dark blue
  },
  accent: {
    50: '#fefce8',   // Light yellow
    500: '#eab308',  // Main yellow
    900: '#713f12',  // Dark yellow
  }
}
```

**Key Classes:**
- `bg-sports-dark` - Main dark background
- `text-sports-primary` - Red accent text
- `border-sports-secondary` - Blue borders
- `hover:bg-sports-accent` - Yellow hover states

### State Management
We use **Convex** for data and **React state** for UI:

```typescript
// Data fetching with Convex
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function GameList() {
  // Real-time data subscription
  const games = useQuery(api.sports.getAllGames);
  const addGame = useMutation(api.sports.addGame);
  
  // Local UI state
  const [selectedGame, setSelectedGame] = useState(null);
  
  return (
    // Component JSX
  );
}
```

## 🖥️ Backend Development (Convex)

### Database Schema
Located in `convex/schema.ts`, defines all tables and relationships:

```typescript
// Example table definition
games: defineTable({
  home_team_id: v.id("teams"),
  away_team_id: v.id("teams"),
  sport_id: v.id("sports"),
  game_date: v.string(),
  status: v.union(
    v.literal("scheduled"), 
    v.literal("in_progress"), 
    v.literal("final")
  ),
  home_score: v.optional(v.number()),
  away_score: v.optional(v.number()),
}).index("by_sport", ["sport_id"]),
```

### Backend Functions
Three types of functions:

#### 1. Queries (Read Data)
```typescript
// convex/sports.ts
export const getAllGames = query({
  handler: async (ctx) => {
    return await ctx.db.query("games").collect();
  },
});

export const getGameById = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});
```

#### 2. Mutations (Write Data)
```typescript
export const addGame = mutation({
  args: {
    homeTeamId: v.id("teams"),
    awayTeamId: v.id("teams"),
    sportId: v.id("sports"),
    gameDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("games", {
      home_team_id: args.homeTeamId,
      away_team_id: args.awayTeamId,
      sport_id: args.sportId,
      game_date: args.gameDate,
      status: "scheduled",
    });
  },
});
```

#### 3. HTTP Actions (External APIs)
```typescript
// convex/liveGameActions.ts
export const updateScore = httpAction(async (ctx, request) => {
  const { gameId, homeScore, awayScore } = await request.json();
  
  await ctx.runMutation(internal.sports.updateGameScore, {
    gameId,
    homeScore,
    awayScore,
  });
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### Data Relationships
Understanding table relationships:

```typescript
// Getting game with team information
export const getGameWithTeams = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return null;
    
    const homeTeam = await ctx.db.get(game.home_team_id);
    const awayTeam = await ctx.db.get(game.away_team_id);
    
    return { game, homeTeam, awayTeam };
  },
});
```

## 🔧 Development Workflows

### Adding a New Feature
1. **Create the backend function** (query/mutation in convex/)
2. **Create the React component** (in components/features/)
3. **Add the page route** (in app/ directory)
4. **Style with Tailwind** (following design system)
5. **Test functionality** (manual testing for now)

### Example: Adding a Player Profile Feature

#### Step 1: Backend (convex/sports.ts)
```typescript
export const getPlayerById = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) return null;
    
    const team = await ctx.db.get(player.team_id);
    const stats = await ctx.db
      .query("player_season_stats")
      .withIndex("by_player", q => q.eq("player_id", args.playerId))
      .collect();
    
    return { player, team, stats };
  },
});
```

#### Step 2: Component (components/features/players/player-profile.tsx)
```typescript
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PlayerProfileProps {
  playerId: string;
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const data = useQuery(api.sports.getPlayerById, { 
    playerId: playerId as Id<"players"> 
  });
  
  if (!data) return <div>Loading...</div>;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.player.full_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Team: {data.team?.name}</p>
        <p>Position: {data.player.position}</p>
        {/* Stats display */}
      </CardContent>
    </Card>
  );
}
```

#### Step 3: Page (app/players/[playerId]/page.tsx)
```typescript
import { PlayerProfile } from "@/components/features/players/player-profile";

export default function PlayerPage({ 
  params 
}: { 
  params: { playerId: string } 
}) {
  return (
    <div className="container mx-auto py-8">
      <PlayerProfile playerId={params.playerId} />
    </div>
  );
}
```

### Working with Real-time Data
Convex automatically handles real-time updates:

```typescript
// This component will automatically re-render when game data changes
function LiveGameScore({ gameId }: { gameId: string }) {
  const game = useQuery(api.sports.getGameById, { gameId });
  
  // Real-time updates happen automatically
  return (
    <div className="live-score">
      <span>{game?.home_score || 0}</span>
      <span> - </span>
      <span>{game?.away_score || 0}</span>
    </div>
  );
}
```

## 🎯 Testing Strategy

### Manual Testing Checklist
- **Responsive Design**: Test on mobile, tablet, desktop
- **Dark Mode**: Verify all components work in dark theme
- **Real-time Updates**: Test live data updates
- **Authentication**: Test login/logout flows
- **Admin Functions**: Test admin-only features

### Performance Testing
- **Lighthouse Scores**: Aim for 90+ in all categories
- **Core Web Vitals**: Monitor LCP, FID, CLS
- **Bundle Size**: Keep JavaScript bundles reasonable
- **API Performance**: Monitor query response times

## 🚀 Deployment Process

### Development Workflow
```bash
# 1. Make your changes
git checkout -b feature/new-feature

# 2. Test locally
pnpm dev

# 3. Deploy backend changes
npx convex deploy

# 4. Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 5. Create pull request
# 6. After review, merge to main
# 7. Production deployment happens automatically
```

### Environment Management
- **Development**: Your local environment + dev Convex deployment  
- **Staging**: Vercel preview deployment + staging Convex
- **Production**: Main Vercel deployment + production Convex

## 🔍 Debugging & Troubleshooting

### Common Issues

#### Convex Connection Issues
```typescript
// Check if Convex is connected
import { useConvexAuth } from "convex/react";

function MyComponent() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  
  if (isLoading) return <div>Connecting to Convex...</div>;
  // Component logic
}
```

#### TypeScript Errors
```bash
# Regenerate Convex types
npx convex dev

# Clear Next.js cache
rm -rf .next
pnpm dev
```

#### Styling Issues
- Check Tailwind IntelliSense extension is working
- Verify custom theme colors are properly defined
- Use browser dev tools to inspect applied classes

### Development Tools
- **Convex Dashboard**: Monitor backend functions and data
- **React Dev Tools**: Component state and props inspection  
- **Tailwind Dev Tools**: CSS class debugging
- **Next.js DevTools**: Performance and bundle analysis

## 📚 Key Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/docs)

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow Next.js recommended rules
- **Prettier**: Auto-formatting on save
- **Conventional Commits**: Use conventional commit messages

### Getting Help
- **Team Slack**: #dev-sports-platform channel
- **Code Reviews**: Required for all PRs
- **Documentation**: Always update docs when adding features
- **Testing**: Manual testing checklist for all changes

---

This developer guide provides everything needed to start contributing to the sports platform effectively. Remember to update documentation when you add new features!