import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// HTTP endpoint to update game stats via webhook
export const updateGameStats = httpAction(async (ctx, request) => {
  const { gameId, status, homeScore, awayScore, period, timeLeft, videoUrl, detailedScore } = await request.json();
  
  if (!gameId) {
    return new Response("Missing gameId", { status: 400 });
  }

  try {
    const result = await ctx.runMutation(internal.sports.updateGameStats, {
      gameId,
      status,
      homeScore,
      awayScore, 
      period,
      timeLeft,
      videoUrl,
      detailedScore
    });

    return new Response(JSON.stringify({
      success: true,
      message: result.message,
      gameId: result.gameId,
      status: result.status,
      homeScore: result.homeScore,
      awayScore: result.awayScore
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});

// HTTP endpoint to start a live game
export const startLiveGame = httpAction(async (ctx, request) => {
  const { gameId, homeScore, awayScore, period, timeLeft, videoUrl } = await request.json();
  
  if (!gameId) {
    return new Response("Missing gameId", { status: 400 });
  }

  try {
    const result = await ctx.runMutation(internal.sports.startLiveGame, {
      gameId,
      homeScore,
      awayScore,
      period,
      timeLeft,
      videoUrl
    });

    return new Response(JSON.stringify({
      success: true,
      message: result.message,
      gameId: result.gameId,
      status: result.status
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS", 
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});

// HTTP endpoint to end a game
export const endGame = httpAction(async (ctx, request) => {
  const { gameId, finalHomeScore, finalAwayScore } = await request.json();
  
  if (!gameId || finalHomeScore === undefined || finalAwayScore === undefined) {
    return new Response("Missing required fields: gameId, finalHomeScore, finalAwayScore", { status: 400 });
  }

  try {
    const result = await ctx.runMutation(internal.sports.endGame, {
      gameId,
      finalHomeScore,
      finalAwayScore
    });

    return new Response(JSON.stringify({
      success: true,
      message: result.message,
      gameId: result.gameId,
      status: result.status,
      finalHomeScore: result.finalHomeScore,
      finalAwayScore: result.finalAwayScore
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});

// Vernon game specific webhook - hardcoded to today's Vernon vs McLennan game
export const updateVernonGame = httpAction(async (ctx, request) => {
  const { status, homeScore, awayScore, period, timeLeft, videoUrl } = await request.json();
  
  // Find today's Vernon game
  const vernonGameId = "m571784ckjh1gdz173pbskwhcx7q20w2"; // Today's Vernon vs McLennan game ID

  try {
    const result = await ctx.runMutation(internal.sports.updateGameStats, {
      gameId: vernonGameId,
      status,
      homeScore,
      awayScore,
      period,
      timeLeft,
      videoUrl
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Vernon game updated: ${result.message}`,
      gameId: result.gameId,
      status: result.status,
      homeScore: result.homeScore,
      awayScore: result.awayScore,
      period: result.period,
      timeLeft: result.timeLeft
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});

// Handle CORS preflight requests
export const options = httpAction(async (ctx, request) => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
});