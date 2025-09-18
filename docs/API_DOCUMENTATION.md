# Sports Platform API Documentation

## 🚀 API Overview

The Sports Platform uses **Convex** as its serverless backend, providing:
- **Real-time queries** for live data updates
- **Mutations** for data modifications
- **HTTP Actions** for external integrations
- **Subscriptions** for real-time updates

### Base URLs
- **Development**: `https://vibrant-pelican-556.convex.cloud`
- **Production**: `https://quick-chameleon-247.convex.cloud`

## 🎮 Live Game HTTP Actions

### Core Game Management

#### Start Live Game
```http
POST /api/games/start
Content-Type: application/json

{
  "gameId": "string",
  "startTime": "2024-01-15T19:00:00Z",
  "broadcastInfo": [
    {
      "provider": "ESPN",
      "channel": "ESPN2",
      "url": "https://espn.com/watch",
      "is_free": false
    }
  ],
  "lineups": {
    "home": ["player1_id", "player2_id"],
    "away": ["player3_id", "player4_id"]
  }
}
```

#### Update Live Score
```http
POST /api/games/score
Content-Type: application/json

{
  "gameId": "string",
  "homeScore": 14,
  "awayScore": 10,
  "period": 1,
  "timeLeft": "12:34",
  "detailedScore": {
    "volleyball_sets": [
      {"home": 25, "away": 23},
      {"home": 20, "away": 25}
    ]
  },
  "scoringTeam": "home",
  "pointsScored": 7,
  "eventDescription": "Touchdown by Player Name"
}
```

#### Add Game Event
```http
POST /api/games/events
Content-Type: application/json

{
  "gameId": "string",
  "eventType": "score",
  "description": "Touchdown by Player Name",
  "playerId": "player_id_optional",
  "teamId": "team_id_optional",
  "period": 1,
  "timeRemaining": "12:34",
  "scoreInfo": {
    "home_score": 14,
    "away_score": 10,
    "scoring_team": "home",
    "points_scored": 7
  },
  "metadata": {
    "yardLine": "25",
    "playType": "rushing"
  },
  "isHighlight": true
}
```

#### Update Game Period
```http
POST /api/games/period
Content-Type: application/json

{
  "gameId": "string",
  "period": 2,
  "periodType": "quarter",
  "timeLeft": "15:00",
  "isOvertime": false,
  "eventDescription": "Start of 2nd quarter"
}
```

#### End Game
```http
POST /api/games/end
Content-Type: application/json

{
  "gameId": "string",
  "finalHomeScore": 28,
  "finalAwayScore": 21,
  "endTime": "2024-01-15T22:30:00Z",
  "finalPeriod": 4,
  "gameNotes": "Close game with overtime finish"
}
```

### Enhanced Live Features

#### Update Live Statistics
```http
POST /api/games/stats
Content-Type: application/json

{
  "gameId": "string",
  "attendance": 45000,
  "viewerCount": 250000,
  "peakViewers": 280000,
  "weatherConditions": "Clear, 72°F",
  "temperature": 72
}
```

#### Update Broadcast Information
```http
POST /api/games/broadcast
Content-Type: application/json

{
  "gameId": "string",
  "liveStreamUrl": "https://stream.example.com/game123",
  "broadcastUrls": [
    "https://espn.com/watch/game123",
    "https://fox.com/live/game123"
  ],
  "broadcastInfo": [
    {
      "provider": "ESPN",
      "channel": "ESPN",
      "url": "https://espn.com/watch/game123",
      "is_free": false
    }
  ]
}
```

### Bulk Operations

#### Bulk Add Events
```http
POST /api/games/events/bulk
Content-Type: application/json

{
  "gameId": "string",
  "events": [
    {
      "eventType": "score",
      "description": "First touchdown",
      "periodInfo": {"period_number": 1, "time_remaining": "12:34"}
    },
    {
      "eventType": "timeout",
      "description": "Team timeout called",
      "teamId": "team_id"
    }
  ]
}
```

### Data Retrieval

#### Get Game State
```http
GET /api/games/state/{gameId}
```

**Response:**
```json
{
  "success": true,
  "gameId": "string",
  "gameState": {
    "current_period": 2,
    "period_type": "quarter",
    "time_left": "08:45",
    "home_score": 14,
    "away_score": 7,
    "is_overtime": false,
    "game_phase": "active",
    "momentum": "home",
    "last_updated": 1642284563000
  },
  "recentEvents": [
    {
      "event_type": "score",
      "description": "Touchdown pass",
      "creation_time": 1642284560000
    }
  ],
  "timestamp": "2024-01-15T20:15:00Z"
}
```

#### Get Live Games
```http
GET /api/games/live
```

**Response:**
```json
{
  "success": true,
  "liveGames": [
    {
      "gameId": "game123",
      "homeTeam": "Lakers",
      "awayTeam": "Warriors",
      "homeScore": 85,
      "awayScore": 78,
      "period": 3,
      "timeLeft": "05:42",
      "status": "in_progress"
    }
  ],
  "count": 3,
  "timestamp": "2024-01-15T20:15:00Z"
}
```

### Webhooks

#### Game Data Webhook
```http
POST /api/games/webhook
Content-Type: application/json
X-API-Key: your-secure-api-key

{
  "type": "score_update",
  "gameId": "string",
  "homeScore": 21,
  "awayScore": 14,
  "period": 2,
  "timeLeft": "08:15"
}
```

## 📊 Convex Database Queries

### Sports Queries

#### Get All Games
```javascript
// In your React component
const games = useQuery(api.sports.getAllGames);
```

#### Get Game by ID
```javascript
const game = useQuery(api.sports.getGameById, { gameId: "game123" });
```

#### Get Live Games
```javascript
const liveGames = useQuery(api.sports.getLiveGames);
```

#### Get Teams
```javascript
const teams = useQuery(api.sports.getTeams);
```

#### Get Sports
```javascript
const sports = useQuery(api.sports.getSports);
```

### Content Queries

#### Get Content by ID
```javascript
const content = useQuery(api.content.getContentById, { id: "content123" });
```

#### Get All Shows
```javascript
const shows = useQuery(api.sports.getAllShows);
```

#### Get Show Details
```javascript
const showDetails = useQuery(api.sports.getShowDetails, { showId: "show123" });
```

### User Queries

#### Get User by Clerk ID
```javascript
const user = useQuery(api.users.getUserByClerkId, { clerkId: "user_123" });
```

## 🔧 Convex Mutations

### Game Mutations

#### Add Team
```javascript
const addTeam = useMutation(api.sports.addTeam);

await addTeam({
  name: "Los Angeles Lakers",
  slug: "lakers",
  city: "Los Angeles",
  state: "CA",
  league: "NBA"
});
```

#### Add Sport
```javascript
const addSport = useMutation(api.sports.addSport);

await addSport({
  name: "Basketball",
  slug: "basketball",
  description: "Professional basketball league"
});
```

#### Bulk Add Games
```javascript
const bulkAddGames = useMutation(api.sports.bulkAddGames);

await bulkAddGames({
  games: [
    {
      homeTeam: "Lakers",
      awayTeam: "Warriors", 
      sportName: "Basketball",
      gameDate: "2024-01-15T19:00:00Z",
      venue: "Staples Center",
      status: "scheduled"
    }
  ]
});
```

### User Mutations

#### Create User
```javascript
const createUser = useMutation(api.users.createUser);

await createUser({
  clerkId: "user_123",
  email: "user@example.com",
  name: "John Doe",
  avatarUrl: "https://example.com/avatar.jpg"
});
```

#### Update User
```javascript
const updateUser = useMutation(api.users.updateUser);

await updateUser({
  clerkId: "user_123",
  name: "John Smith",
  avatarUrl: "https://example.com/new-avatar.jpg"
});
```

## 🔐 Authentication

### Clerk Integration
All authenticated requests use Clerk's JWT tokens:

```javascript
import { useAuth } from "@clerk/nextjs";

function MyComponent() {
  const { getToken } = useAuth();
  
  // Convex automatically handles Clerk auth
  const user = useQuery(api.users.getCurrentUser);
}
```

### API Key Authentication (HTTP Actions)
For external integrations, use API key in headers:

```http
X-API-Key: your-secure-api-key
```

## 📈 Real-Time Subscriptions

### Live Game Updates
```javascript
// Automatically updates when game data changes
const gameState = useQuery(api.sports.getGameById, { gameId: "game123" });

// Listen for live game events
const gameEvents = useQuery(api.sports.getGameEvents, { gameId: "game123" });
```

### User Activity
```javascript
// Real-time user activity updates
const userActivity = useQuery(api.users.getUserActivity, { userId: "user123" });
```

## ❌ Error Handling

### HTTP Action Errors
```json
{
  "error": "Game ID is required",
  "code": "INVALID_REQUEST"
}
```

### Convex Query Errors
Convex queries automatically handle loading states and errors:

```javascript
const game = useQuery(api.sports.getGameById, { gameId: "invalid" });
// Returns undefined while loading, null if not found
```

## 🚦 Rate Limits

- **HTTP Actions**: 100 requests/minute per IP
- **Convex Queries**: Unlimited (real-time subscriptions)
- **Mutations**: 1000 requests/minute per user

## 🔧 Environment Variables

### Required Environment Variables
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-deployment

# Clerk Authentication  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Live Game API
LIVE_GAME_API_KEY=your-secure-api-key
```

## 📚 SDKs and Libraries

### Frontend Integration
```javascript
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useQuery, useMutation } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Wrap your app
<ConvexProvider client={convex}>
  <App />
</ConvexProvider>
```

### TypeScript Support
Convex automatically generates TypeScript types:

```javascript
import { api } from "./convex/_generated/api";
import { Id } from "./convex/_generated/dataModel";

// Fully typed queries and mutations
const game = useQuery(api.sports.getGameById, { 
  gameId: "game123" as Id<"games"> 
});
```

---

This API documentation covers all major endpoints and integration patterns for the Sports Platform.