import { httpAction } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Helper function to validate API key
function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "");
  
  // For now, use a simple API key check - in production, this should be more secure
  const validApiKeys = [
    "csn-live-scores-2024",
    "volleyball-tracker-api", 
    "admin-panel-key"
  ];
  
  return apiKey ? validApiKeys.includes(apiKey) : false;
}

// Helper function to add CORS headers
function addCorsHeaders(response: Response): Response {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
  return response;
}

// Helper function to validate game ID format
function validateGameId(gameId: string): boolean {
  // Convex ID format validation (basic check)
  return gameId && gameId.length > 10 && !gameId.includes(" ");
}

// Update live game scores and period information
export const updateLiveScore = httpAction(async (ctx, request) => {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid or missing API key" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Parse request body
    const body = await request.json();
    const { gameId, homeScore, awayScore, period, timeLeft, sets, isOvertime } = body;

    // Validate required fields
    if (!gameId || homeScore === undefined || awayScore === undefined) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Missing required fields: gameId, homeScore, awayScore" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Validate game ID format
    if (!validateGameId(gameId)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid gameId format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Prepare detailed score for volleyball
    let detailedScore = undefined;
    if (sets && Array.isArray(sets)) {
      detailedScore = {
        volleyball_sets: sets.map((set: any) => ({
          home: set.home || 0,
          away: set.away || 0
        }))
      };
    }

    // Call internal mutation to update game stats
    const result = await ctx.runMutation(internal.sports.updateGameStats, {
      gameId: gameId as Id<"games">,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      status: "in_progress" as const,
      period: period ? Number(period) : undefined,
      timeLeft: timeLeft || undefined,
      isOvertime: Boolean(isOvertime),
      detailedScore
    });

    return addCorsHeaders(new Response(
      JSON.stringify({ 
        success: true, 
        gameId,
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        period,
        timeLeft,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ));

  } catch (error) {
    console.error("Error updating live score:", error);
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Internal server error", message: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    ));
  }
});

// Start a scheduled game (make it live)
export const startGame = httpAction(async (ctx, request) => {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid or missing API key" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Parse request body
    const body = await request.json();
    const { gameId, videoUrl, startingPeriod = 1 } = body;

    // Validate required fields
    if (!gameId) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Missing required field: gameId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Validate game ID format
    if (!validateGameId(gameId)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid gameId format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Call internal mutation to start the game
    const result = await ctx.runMutation(internal.sports.startLiveGame, {
      gameId: gameId as Id<"games">,
      homeScore: 0,
      awayScore: 0,
      period: Number(startingPeriod),
      videoUrl: videoUrl || undefined
    });

    return addCorsHeaders(new Response(
      JSON.stringify({ 
        success: true, 
        gameId,
        status: "in_progress",
        startedAt: new Date().toISOString()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ));

  } catch (error) {
    console.error("Error starting game:", error);
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Internal server error", message: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    ));
  }
});

// End a game with final scores
export const endGame = httpAction(async (ctx, request) => {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid or missing API key" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Parse request body
    const body = await request.json();
    const { gameId, finalHomeScore, finalAwayScore } = body;

    // Validate required fields
    if (!gameId || finalHomeScore === undefined || finalAwayScore === undefined) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Missing required fields: gameId, finalHomeScore, finalAwayScore" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Validate game ID format
    if (!validateGameId(gameId)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid gameId format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Call internal mutation to end the game
    const result = await ctx.runMutation(internal.sports.endGame, {
      gameId: gameId as Id<"games">,
      finalHomeScore: Number(finalHomeScore),
      finalAwayScore: Number(finalAwayScore)
    });

    return addCorsHeaders(new Response(
      JSON.stringify({ 
        success: true, 
        gameId,
        status: "final",
        finalHomeScore: Number(finalHomeScore),
        finalAwayScore: Number(finalAwayScore),
        endedAt: new Date().toISOString()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ));

  } catch (error) {
    console.error("Error ending game:", error);
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Internal server error", message: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    ));
  }
});

// Add a game event (play-by-play)
export const addGameEvent = httpAction(async (ctx, request) => {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid or missing API key" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Parse request body
    const body = await request.json();
    const { 
      gameId, 
      eventType, 
      description, 
      teamId, 
      playerId, 
      scoreInfo,
      periodInfo,
      metadata 
    } = body;

    // Validate required fields
    if (!gameId || !eventType || !description) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Missing required fields: gameId, eventType, description" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Validate game ID format
    if (!validateGameId(gameId)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid gameId format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Validate event type
    const validEventTypes = [
      "period_start", "period_end", "score", "timeout", 
      "substitution", "penalty", "turnover", "rebound", "foul"
    ];
    
    if (!validEventTypes.includes(eventType)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ 
          error: "Invalid eventType", 
          validTypes: validEventTypes 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Call the existing updateGameState mutation
    const result = await ctx.runMutation(api.sports.updateGameState, {
      gameId: gameId as Id<"games">,
      eventType,
      description,
      scoreInfo: scoreInfo ? {
        home_score: scoreInfo.homeScore || scoreInfo.home_score || 0,
        away_score: scoreInfo.awayScore || scoreInfo.away_score || 0,
        details: scoreInfo.details
      } : undefined,
      periodInfo: periodInfo ? {
        period_number: periodInfo.periodNumber || periodInfo.period_number || 1,
        time_remaining: periodInfo.timeRemaining || periodInfo.time_remaining,
        is_overtime: periodInfo.isOvertime || periodInfo.is_overtime
      } : undefined,
      teamId: teamId as Id<"teams"> | undefined,
      playerId: playerId as Id<"players"> | undefined,
      metadata
    });

    return addCorsHeaders(new Response(
      JSON.stringify({ 
        success: true, 
        gameId,
        eventType,
        description,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ));

  } catch (error) {
    console.error("Error adding game event:", error);
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Internal server error", message: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    ));
  }
});

// Get game status (useful for checking current state)
export const getGameStatus = httpAction(async (ctx, request) => {
  try {
    // Parse URL to get gameId
    const url = new URL(request.url);
    const gameId = url.pathname.split('/').pop();

    if (!gameId || !validateGameId(gameId)) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Invalid or missing gameId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Call the existing query to get game details  
    const gameData = await ctx.runQuery(api.sports.getGameById, {
      gameId: gameId as Id<"games">
    });

    if (!gameData) {
      return addCorsHeaders(new Response(
        JSON.stringify({ error: "Game not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      ));
    }

    return addCorsHeaders(new Response(
      JSON.stringify({
        success: true,
        game: gameData,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    ));

  } catch (error) {
    console.error("Error getting game status:", error);
    return addCorsHeaders(new Response(
      JSON.stringify({ error: "Internal server error", message: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    ));
  }
});

// Handle OPTIONS requests for CORS
export const handleOptions = httpAction(async (ctx, request) => {
  return addCorsHeaders(new Response(null, { status: 200 }));
});