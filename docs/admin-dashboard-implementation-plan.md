# CSN Admin Dashboard - Implementation Plan

## 🎯 **Project Overview**
Add a comprehensive admin dashboard to the existing CSN project, integrating with the current Convex backend and shadcn/ui setup, using the Soft Pop theme for enhanced UI.

## 📋 **Phase 1: Theme & Setup (Days 1-2)**

### **1.1 Install Soft Pop Theme**
```bash
# From project root
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/soft-pop.json

# Add missing shadcn components for admin features
pnpm dlx shadcn@latest add calendar chart progress select command sheet
```

### **1.2 Admin Route Structure**
```
app/
├── admin/                    # New admin section
│   ├── layout.tsx           # Admin-specific layout
│   ├── page.tsx             # Dashboard overview
│   ├── games/
│   │   ├── schedule/page.tsx
│   │   └── live/page.tsx
│   ├── content/page.tsx
│   ├── media/page.tsx
│   └── analytics/page.tsx
├── (existing routes)        # Keep all current routes
```

### **1.3 Extend Current Components**
- Enhance existing `components/ui/` with admin-specific variants
- Add admin components to `components/admin/`
- Integrate with existing Convex queries/mutations

## 📊 **Phase 2: Convex Integration (Days 3-4)**

### **2.1 Extend Existing Convex Functions**
```typescript
// convex/admin.ts - New admin-specific functions
export const getAdminDashboardMetrics = query({
  handler: async (ctx) => {
    // Aggregate existing game, user, content data for admin metrics
    const totalGames = await ctx.db.query("games").collect();
    const liveGames = totalGames.filter(game => game.status === "in_progress");
    const totalViews = await ctx.db.query("analytics").collect();
    
    return {
      totalGames: totalGames.length,
      liveGames: liveGames.length,
      totalViews: totalViews.reduce((sum, view) => sum + view.count, 0),
      // ... more admin metrics
    };
  },
});

export const scheduleGame = mutation({
  args: {
    homeTeamId: v.id("teams"),
    awayTeamId: v.id("teams"),
    sportId: v.id("sports"),
    gameDate: v.string(),
    venue: v.string(),
    broadcastSettings: v.object({
      liveStream: v.boolean(),
      record: v.boolean(),
      autoHighlights: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    // Extend existing game creation with admin features
    return await ctx.db.insert("games", {
      home_team_id: args.homeTeamId,
      away_team_id: args.awayTeamId,
      sport_id: args.sportId,
      game_date: args.gameDate,
      venue: args.venue,
      status: "scheduled",
      broadcast_settings: args.broadcastSettings,
      created_by: "admin", // Track admin creation
    });
  },
});

// Enhance existing convex/sports.ts
export const updateGameScore = mutation({
  args: {
    gameId: v.id("games"),
    homeScore: v.number(),
    awayScore: v.number(),
    setScores: v.optional(v.array(v.object({
      homeScore: v.number(),
      awayScore: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    // Real-time score updates for admin
    await ctx.db.patch(args.gameId, {
      home_score: args.homeScore,
      away_score: args.awayScore,
      set_scores: args.setScores,
      last_updated: Date.now(),
    });
    
    // Log admin action
    await ctx.db.insert("admin_actions", {
      action_type: "score_update",
      game_id: args.gameId,
      timestamp: Date.now(),
    });
  },
});

export const getGameAnalytics = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_game", (q) => q.eq("game_id", args.gameId))
      .collect();
    
    return {
      game,
      viewerCount: analytics.filter(a => a.metric_type === "viewer_count").length,
      engagementRate: calculateEngagement(analytics),
      peakViewers: Math.max(...analytics.map(a => a.value)),
    };
  },
});
```

### **2.2 Real-time Admin Features**
- Use existing Convex real-time subscriptions for live updates
- Extend current live game tracking with admin controls
- Add admin-specific live updates (viewer counts, engagement metrics)

### **2.3 Admin Authentication**
```typescript
// middleware.ts - Add admin route protection
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/games", "/teams", "/news"],
  beforeAuth: (req) => {
    // Admin routes require special permissions
    if (req.nextUrl.pathname.startsWith('/admin')) {
      return checkAdminPermissions(req);
    }
  },
});

// components/admin/AdminRoute.tsx
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  
  if (!isAdmin) {
    redirect('/unauthorized');
  }
  
  return <>{children}</>;
};
```

## 🎮 **Phase 3: Games Management (Days 5-6)**

### **3.1 Game Scheduling Integration**
```typescript
// app/admin/games/schedule/page.tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GameSchedulePage() {
  const games = useQuery(api.sports.getAllGames);
  const teams = useQuery(api.sports.getAllTeams);
  const sports = useQuery(api.sports.getAllSports);
  const scheduleGame = useMutation(api.admin.scheduleGame);
  
  // Calendar integration with existing game data
  const gameCalendarEvents = games?.map(game => ({
    id: game._id,
    date: new Date(game.game_date),
    title: `${game.home_team?.name} vs ${game.away_team?.name}`,
    status: game.status,
  }));
  
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Game Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar 
              events={gameCalendarEvents}
              onDateSelect={(date) => setSelectedDate(date)}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="xl:col-span-1">
        <GameScheduleForm 
          teams={teams}
          sports={sports}
          onSchedule={scheduleGame}
        />
      </div>
    </div>
  );
}
```

### **3.2 Live Games Dashboard**
```typescript
// app/admin/games/live/page.tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LiveGameCard } from "@/components/admin/games/LiveGameCard";

export default function LiveGamesPage() {
  const liveGames = useQuery(api.sports.getLiveGames);
  const analytics = useQuery(api.admin.getLiveAnalytics);
  
  return (
    <div className="space-y-8">
      {/* Live Games Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {liveGames?.map((game) => (
          <LiveGameCard 
            key={game._id} 
            game={game}
            analytics={analytics?.[game._id]}
          />
        ))}
      </div>
      
      {/* Live Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Live Event Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <EventTimeline events={liveEvents} />
        </CardContent>
      </Card>
    </div>
  );
}
```

## 📺 **Phase 4: Content & Media (Days 7-8)**

### **4.1 Content Management System**
```typescript
// Extend convex/schema.ts
shows: defineTable({
  title: v.string(),
  description: v.string(),
  sport_id: v.optional(v.id("sports")),
  status: v.union(
    v.literal("active"),
    v.literal("draft"),
    v.literal("archived")
  ),
  thumbnail_url: v.optional(v.string()),
  episode_count: v.number(),
  created_at: v.number(),
  updated_at: v.number(),
}).index("by_status", ["status"]),

episodes: defineTable({
  show_id: v.id("shows"),
  title: v.string(),
  description: v.string(),
  episode_number: v.number(),
  duration: v.optional(v.number()), // in seconds
  video_url: v.optional(v.string()),
  audio_url: v.optional(v.string()),
  thumbnail_url: v.optional(v.string()),
  status: v.union(
    v.literal("published"),
    v.literal("draft"),
    v.literal("scheduled")
  ),
  published_at: v.optional(v.number()),
  view_count: v.number(),
}).index("by_show", ["show_id"]),

// convex/content.ts
export const createShow = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    sportId: v.optional(v.id("sports")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("shows", {
      title: args.title,
      description: args.description,
      sport_id: args.sportId,
      status: "draft",
      episode_count: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const getShowsWithEpisodes = query({
  handler: async (ctx) => {
    const shows = await ctx.db.query("shows").collect();
    
    return Promise.all(shows.map(async (show) => {
      const episodes = await ctx.db
        .query("episodes")
        .withIndex("by_show", (q) => q.eq("show_id", show._id))
        .collect();
      
      return {
        ...show,
        episodes,
        latest_episode: episodes[episodes.length - 1],
      };
    }));
  },
});
```

### **4.2 Media Upload Integration**
```typescript
// components/admin/media/UploadZone.tsx
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export const MediaUploadZone = () => {
  const generateUploadUrl = useAction(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  
  const handleFileUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();
      
      // Upload to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        body: file,
      });
      
      const { storageId } = await result.json();
      
      // Save file metadata
      await saveFile({
        storageId,
        name: file.name,
        type: file.type,
        size: file.size,
        category: determineCategory(file.type),
      });
    }
  };
  
  return (
    <Card className="border-dashed border-2 hover:border-primary transition-all">
      <CardContent className="p-12">
        <div 
          className="text-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <UploadCloud className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Drop your media files here</h3>
          <p className="text-muted-foreground mb-6">
            Supports videos, images, and audio files up to 500MB each
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            Select Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

## 📈 **Phase 5: Analytics Dashboard (Days 9-10)**

### **5.1 Analytics Data Layer**
```typescript
// Extend convex/schema.ts
analytics: defineTable({
  entity_type: v.union(
    v.literal("game"),
    v.literal("show"),
    v.literal("episode"),
    v.literal("media")
  ),
  entity_id: v.string(), // Generic ID for flexibility
  metric_type: v.union(
    v.literal("view"),
    v.literal("engagement"),
    v.literal("duration"),
    v.literal("completion_rate")
  ),
  value: v.number(),
  metadata: v.optional(v.object({
    user_id: v.optional(v.string()),
    session_id: v.optional(v.string()),
    device_type: v.optional(v.string()),
    location: v.optional(v.string()),
  })),
  timestamp: v.number(),
}).index("by_entity", ["entity_type", "entity_id"])
  .index("by_date", ["timestamp"]),

// convex/analytics.ts
export const getAdminAnalytics = query({
  args: {
    dateRange: v.object({
      start: v.number(),
      end: v.number(),
    }),
    entityType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("analytics");
    
    if (args.entityType) {
      query = query.withIndex("by_entity", (q) => 
        q.eq("entity_type", args.entityType)
      );
    }
    
    const analytics = await query
      .filter((q) => 
        q.gte(q.field("timestamp"), args.dateRange.start) &&
        q.lte(q.field("timestamp"), args.dateRange.end)
      )
      .collect();
    
    // Process analytics data
    return {
      totalViews: analytics.filter(a => a.metric_type === "view").length,
      avgEngagement: calculateAverage(analytics, "engagement"),
      topPerforming: getTopPerforming(analytics),
      trends: calculateTrends(analytics),
    };
  },
});
```

### **5.2 Analytics Dashboard Components**
```typescript
// components/admin/analytics/AnalyticsDashboard.tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const AnalyticsDashboard = () => {
  const analytics = useQuery(api.analytics.getAdminAnalytics, {
    dateRange: {
      start: Date.now() - (30 * 24 * 60 * 60 * 1000), // Last 30 days
      end: Date.now(),
    }
  });
  
  const chartData = {
    labels: analytics?.trends?.dates || [],
    datasets: [
      {
        label: 'Views',
        data: analytics?.trends?.views || [],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
      },
      {
        label: 'Engagement',
        data: analytics?.trends?.engagement || [],
        borderColor: 'hsl(var(--secondary))',
        backgroundColor: 'hsl(var(--secondary) / 0.1)',
      },
    ],
  };
  
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value={analytics?.totalViews || 0}
          trend="+15.3%"
          icon={Eye}
        />
        {/* More metric cards... */}
      </div>
      
      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Viewership Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
};
```

## 🛠 **Phase 6: UI Components (Days 11-12)**

### **6.1 Admin Layout Components**
```typescript
// components/admin/layout/AdminLayout.tsx
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { AdminRoute } from "../AdminRoute";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 lg:ml-64 pt-16 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};

// components/admin/layout/AdminSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Gamepad2,
  Tv,
  UploadCloud,
  TrendingUp,
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Games & Scheduling', href: '/admin/games', icon: Gamepad2 },
  { name: 'Content Management', href: '/admin/content', icon: Tv },
  { name: 'Media Upload', href: '/admin/media', icon: UploadCloud },
  { name: 'Analytics & Reports', href: '/admin/analytics', icon: TrendingUp },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
```

### **6.2 Reusable Admin Components**
```typescript
// components/admin/shared/MetricCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, trend, icon: Icon }: MetricCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {trend && (
          <div className="mt-3">
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
              trend.startsWith('+') 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            )}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// components/admin/shared/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "live" | "scheduled" | "completed" | "draft" | "archived";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    live: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800",
    scheduled: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800",
    completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800",
    draft: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800",
    archived: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
  };
  
  return (
    <Badge 
      variant="outline" 
      className={cn(variants[status], className)}
    >
      {status === "live" && <div className="w-2 h-2 bg-current rounded-full mr-1 animate-pulse" />}
      {status.toUpperCase()}
    </Badge>
  );
};
```

## 🔧 **Phase 7: Integration & Polish (Days 13-15)**

### **7.1 App Router Integration**
```typescript
// app/admin/layout.tsx
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}

// app/admin/page.tsx
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";

export default function AdminPage() {
  return <AdminDashboard />;
}

// app/admin/games/schedule/page.tsx
import { GameSchedulePage } from "@/components/admin/games/GameSchedulePage";

export default function SchedulePage() {
  return <GameSchedulePage />;
}
```

### **7.2 Responsive Design & Accessibility**
```typescript
// tailwind.config.js - Extend existing config
module.exports = {
  // ... existing config
  theme: {
    extend: {
      // Add admin-specific utilities
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
};
```

## 📦 **File Structure Integration**

```
csn-monorepo/
├── app/
│   ├── admin/                      # NEW: Admin dashboard routes
│   │   ├── layout.tsx             # Admin layout wrapper
│   │   ├── page.tsx               # Dashboard overview
│   │   ├── games/
│   │   │   ├── schedule/page.tsx  # Game scheduling
│   │   │   └── live/page.tsx      # Live games management
│   │   ├── content/page.tsx       # Content management
│   │   ├── media/page.tsx         # Media upload
│   │   └── analytics/page.tsx     # Analytics dashboard
│   ├── (existing routes)/         # KEEP: All current routes
├── components/
│   ├── ui/                        # EXTEND: Enhanced with Soft Pop theme
│   ├── admin/                     # NEW: Admin-specific components
│   │   ├── layout/               # Layout components
│   │   ├── dashboard/            # Dashboard components
│   │   ├── games/                # Game management components
│   │   ├── content/              # Content management components
│   │   ├── media/                # Media upload components
│   │   ├── analytics/            # Analytics components
│   │   └── shared/               # Reusable admin components
│   ├── (existing)/               # KEEP: All current components
├── convex/
│   ├── admin.ts                  # NEW: Admin-specific functions
│   ├── analytics.ts              # NEW: Analytics functions
│   ├── content.ts                # NEW: Content management functions
│   ├── files.ts                  # NEW: File upload functions
│   ├── (existing files)/         # EXTEND: Current functions
├── lib/
│   ├── admin-utils.ts            # NEW: Admin utility functions
│   └── (existing)/               # KEEP: Current utilities
└── docs/
    └── admin-dashboard-implementation-plan.md  # This document
```

## 🚀 **Development Workflow**

### **Development Setup:**
1. **Create feature branch**: `git checkout -b feature/admin-dashboard`
2. **Install Soft Pop theme**: Follow Phase 1.1 instructions
3. **Incremental development**: Add one admin section at a time
4. **Test integration**: Ensure existing functionality remains intact

### **Testing Strategy:**
```bash
# Unit tests for admin components
npm run test components/admin

# Integration tests for admin routes
npm run test:integration app/admin

# E2E tests for admin workflows
npm run test:e2e admin-dashboard
```

### **Deployment Strategy:**
1. **Environment variables**: Add admin-specific config
2. **Database migrations**: Extend Convex schema incrementally
3. **Feature flags**: Use Convex to toggle admin features
4. **Gradual rollout**: Enable admin access for specific users first

## 🎯 **Success Metrics**

### **Performance Targets:**
- **Page load time**: < 2s for admin pages
- **Real-time updates**: < 500ms latency
- **Bundle size**: < 50KB increase for admin routes

### **User Experience:**
- **Mobile responsive**: 100% feature parity on mobile
- **Accessibility**: WCAG 2.1 AA compliance
- **Error handling**: Graceful degradation for all features

### **Business Metrics:**
- **Admin efficiency**: 50% reduction in manual tasks
- **Data accuracy**: Real-time updates with < 1s delay
- **Content management**: 3x faster content publishing workflow

## 📋 **Deliverables Checklist**

### **Week 1: Foundation**
- [ ] Soft Pop theme installed and configured
- [ ] Admin routing structure implemented
- [ ] Basic admin layout with navigation
- [ ] Dashboard overview page with metrics
- [ ] Admin authentication and authorization

### **Week 2: Core Features**
- [ ] Game scheduling interface with calendar
- [ ] Live games management with real-time updates
- [ ] Content management system (shows/episodes)
- [ ] Media upload with drag & drop functionality
- [ ] Basic analytics dashboard

### **Week 3: Polish & Integration**
- [ ] Advanced analytics with charts and reports
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Testing and bug fixes
- [ ] Documentation and deployment

This implementation plan builds upon your existing CSN infrastructure while adding comprehensive admin capabilities using proven UI patterns and the enhanced Soft Pop theme for a polished, professional admin experience.