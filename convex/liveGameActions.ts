import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Enhanced Live Game HTTP Actions
 * 
 * Comprehensive endpoints for updating live game data including:
 * - Real-time scoring
 * - Game events and play-by-play
 * - Live statistics
 * - Broadcast information
 * - Game state management
 */

// ===== GAME STATE MANAGEMENT =====

// Start a live game
export const startGame = httpAction(async (ctx, request) => {
  const { gameId, startTime, broadcastInfo, lineups } = await request.json();
  
  try {
    // Validate required fields
    if (!gameId) {
      return new Response(JSON.stringify({ 
        error: "Game ID is required" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Start the game and initialize state
    const result = await ctx.runMutation(internal.sports.startLiveGame, {
      gameId,
      startTime: startTime || new Date().toISOString(),
      broadcastInfo: broadcastInfo || [],
      homeTeamLineup: lineups?.home || [],
      awayTeamLineup: lineups?.away || [],
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Game started successfully",
      gameId,
      data: result
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to start game: ${error}`
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

// Update game score
export const updateScore = httpAction(async (ctx, request) => {
  const { 
    gameId, 
    homeScore, 
    awayScore, 
    period, 
    timeLeft, 
    detailedScore,
    scoringTeam,
    pointsScored,
    eventDescription 
  } = await request.json();
  
  try {
    if (!gameId) {
      return new Response(JSON.stringify({ 
        error: "Game ID is required" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Update game score and state
    const result = await ctx.runMutation(internal.sports.updateGameScore, {
      gameId,
      homeScore,
      awayScore,
      period,
      timeLeft,
      detailedScore,
      isOvertime: period > 4, // Adjust based on sport
    });

    // Create scoring event if specified
    if (scoringTeam && pointsScored) {
      await ctx.runMutation(internal.sports.createGameEvent, {
        gameId,
        eventType: "score",
        description: eventDescription || `${scoringTeam} scores ${pointsScored} points`,
        scoreInfo: {
          home_score: homeScore,
          away_score: awayScore,
          scoring_team: scoringTeam,
          points_scored: pointsScored
        },
        periodInfo: {
          period_number: period,
          time_remaining: timeLeft,
          period_type: period <= 4 ? "quarter" : "overtime"
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Score updated successfully",
      gameId,
      homeScore,
      awayScore,
      data: result
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to update score: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// Add game event (play-by-play)
export const addGameEvent = httpAction(async (ctx, request) => {
  const { 
    gameId, 
    eventType, 
    description, 
    playerId, 
    teamId, 
    period, 
    timeRemaining,
    scoreInfo,
    metadata,
    isHighlight 
  } = await request.json();
  
  try {
    if (!gameId || !eventType || !description) {
      return new Response(JSON.stringify({ 
        error: "Game ID, event type, and description are required" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const result = await ctx.runMutation(internal.sports.createGameEvent, {
      gameId,
      eventType,
      description,
      playerId: playerId || null,
      teamId: teamId || null,
      periodInfo: period ? {
        period_number: period,
        time_remaining: timeRemaining,
        period_type: period <= 4 ? "quarter" : "overtime",
        clock_running: true
      } : null,
      scoreInfo: scoreInfo || null,
      metadata: metadata || null,
      isHighlight: isHighlight || false
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Game event added successfully",
      eventId: result,
      data: { gameId, eventType, description }
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to add game event: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// Update game period/quarter
export const updatePeriod = httpAction(async (ctx, request) => {
  const { 
    gameId, 
    period, 
    periodType, 
    timeLeft, 
    isOvertime,
    eventDescription 
  } = await request.json();
  
  try {
    if (!gameId || !period) {
      return new Response(JSON.stringify({ 
        error: "Game ID and period are required" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Update game state
    const result = await ctx.runMutation(internal.sports.updateGamePeriod, {
      gameId,
      period,
      periodType: periodType || (period <= 4 ? "quarter" : "overtime"),
      timeLeft: timeLeft || "00:00",
      isOvertime: isOvertime || period > 4
    });

    // Create period event
    await ctx.runMutation(internal.sports.createGameEvent, {
      gameId,
      eventType: "period_start",
      description: eventDescription || `Start of ${periodType || "period"} ${period}`,
      periodInfo: {
        period_number: period,
        period_type: periodType || (period <= 4 ? "quarter" : "overtime"),
        time_remaining: timeLeft,
        is_overtime: isOvertime || period > 4
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Period updated successfully",
      gameId,
      period,
      data: result
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to update period: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// End game
export const endGame = httpAction(async (ctx, request) => {
  const { 
    gameId, 
    finalHomeScore, 
    finalAwayScore, 
    endTime, 
    finalPeriod,
    gameNotes 
  } = await request.json();
  
  try {
    if (!gameId || finalHomeScore === undefined || finalAwayScore === undefined) {
      return new Response(JSON.stringify({ 
        error: "Game ID and final scores are required" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const result = await ctx.runMutation(internal.sports.endGame, {
      gameId,
      finalHomeScore,
      finalAwayScore,
      endTime: endTime || new Date().toISOString(),
      finalPeriod: finalPeriod || 4,
      gameNotes: gameNotes || null
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Game ended successfully",
      gameId,
      finalScore: { home: finalHomeScore, away: finalAwayScore },
      data: result
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to end game: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// ===== LIVE STATISTICS & ANALYTICS =====

// Update live statistics
export const updateLiveStats = httpAction(async (ctx, request) => {
  const { 
    gameId, 
    attendance, 
    viewerCount, 
    peakViewers,
    weatherConditions,
    temperature 
  } = await request.json();
  
  try {
    if (!gameId) {
      return new Response(JSON.stringify({ 
        error: "Game ID is required" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const result = await ctx.runMutation(internal.sports.updateLiveStats, {
      gameId,
      attendance: attendance || null,
      viewerCount: viewerCount || null,
      peakViewers: peakViewers || null,
      weatherConditions: weatherConditions || null,
      temperature: temperature || null
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Live stats updated successfully",
      gameId,
      data: result
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to update live stats: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// Update broadcast information
export const updateBroadcast = httpAction(async (ctx, request) => {
  const { 
    gameId, 
    liveStreamUrl, 
    broadcastUrls, 
    broadcastInfo 
  } = await request.json();
  
  try {
    if (!gameId) {
      return new Response(JSON.stringify({ 
        error: "Game ID is required" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const result = await ctx.runMutation(internal.sports.updateBroadcastInfo, {
      gameId,
      liveStreamUrl: liveStreamUrl || null,
      broadcastUrls: broadcastUrls || [],
      broadcastInfo: broadcastInfo || []
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Broadcast info updated successfully",
      gameId,
      data: result
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to update broadcast info: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// ===== GAME DATA RETRIEVAL =====

// Get current game state
export const getGameState = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const gameId = url.pathname.split('/').pop();
  
  try {
    if (!gameId) {
      return new Response(JSON.stringify({ 
        error: "Game ID is required" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const gameState = await ctx.runQuery(internal.sports.getGameState, { gameId });
    const recentEvents = await ctx.runQuery(internal.sports.getRecentGameEvents, { 
      gameId, 
      limit: 10 
    });

    return new Response(JSON.stringify({
      success: true,
      gameId,
      gameState,
      recentEvents,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to get game state: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// Get live games
export const getLiveGames = httpAction(async (ctx, request) => {
  try {
    const liveGames = await ctx.runQuery(internal.sports.getAllLiveGames, {});
    
    return new Response(JSON.stringify({
      success: true,
      liveGames,
      count: liveGames.length,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "max-age=10" // Cache for 10 seconds
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to get live games: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// ===== BULK OPERATIONS =====

// Bulk update multiple game events
export const bulkAddEvents = httpAction(async (ctx, request) => {
  const { gameId, events } = await request.json();
  
  try {
    if (!gameId || !events || !Array.isArray(events)) {
      return new Response(JSON.stringify({ 
        error: "Game ID and events array are required" 
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const results = [];
    for (const event of events) {
      try {
        const result = await ctx.runMutation(internal.sports.createGameEvent, {
          gameId,
          eventType: event.eventType,
          description: event.description,
          playerId: event.playerId || null,
          teamId: event.teamId || null,
          periodInfo: event.periodInfo || null,
          scoreInfo: event.scoreInfo || null,
          metadata: event.metadata || null,
          isHighlight: event.isHighlight || false
        });
        results.push({ success: true, eventId: result, event: event.description });
      } catch (eventError) {
        results.push({ success: false, error: eventError, event: event.description });
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    return new Response(JSON.stringify({
      success: true,
      message: `Added ${successCount} of ${events.length} events`,
      results,
      gameId
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Failed to add bulk events: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// ===== WEBHOOKS & INTEGRATIONS =====

// Generic webhook receiver for third-party integrations
export const gameDataWebhook = httpAction(async (ctx, request) => {
  const data = await request.json();
  const apiKey = request.headers.get("X-API-Key");
  
  try {
    // Validate API key (implement your validation logic)
    if (!apiKey || apiKey !== process.env.LIVE_GAME_API_KEY) {
      return new Response(JSON.stringify({ 
        error: "Invalid API key" 
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // Process the webhook data based on type
    switch (data.type) {
      case "score_update":
        await ctx.runMutation(internal.sports.updateGameScore, {
          gameId: data.gameId,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
          period: data.period,
          timeLeft: data.timeLeft
        });
        break;
        
      case "game_event":
        await ctx.runMutation(internal.sports.createGameEvent, {
          gameId: data.gameId,
          eventType: data.eventType,
          description: data.description,
          playerId: data.playerId,
          teamId: data.teamId,
          periodInfo: data.periodInfo,
          scoreInfo: data.scoreInfo
        });
        break;
        
      default:
        return new Response(JSON.stringify({ 
          error: "Unknown webhook type" 
        }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Webhook processed successfully",
      type: data.type,
      gameId: data.gameId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: `Webhook processing failed: ${error}`
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

// ===== OPTIONS HANDLERS FOR CORS =====

export const handleOptions = httpAction(async (ctx, request) => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
      "Access-Control-Max-Age": "86400"
    }
  });
});