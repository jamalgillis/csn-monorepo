import { httpRouter } from "convex/server";
import { 
  // Legacy endpoints (kept for compatibility)
  updateLiveScore, 
  startGame as startGameLegacy, 
  endGame as endGameLegacy, 
  addGameEvent as addGameEventLegacy, 
  getGameStatus,
  handleOptions as handleOptionsLegacy
} from "./gameHttpActions";

// Enhanced live game endpoints
import {
  startGame,
  updateScore,
  addGameEvent,
  updatePeriod,
  endGame,
  updateLiveStats,
  updateBroadcast,
  getGameState,
  getLiveGames,
  bulkAddEvents,
  gameDataWebhook,
  handleOptions
} from "./liveGameActions";

const http = httpRouter();

// ===== ENHANCED LIVE GAME ENDPOINTS =====

// Core game state management
http.route({
  path: "/api/games/start",
  method: "POST", 
  handler: startGame,
});

http.route({
  path: "/api/games/end",
  method: "POST",
  handler: endGame,
});

// Live scoring and events
http.route({
  path: "/api/games/score",
  method: "POST",
  handler: updateScore,
});

http.route({
  path: "/api/games/events",
  method: "POST",
  handler: addGameEvent,
});

http.route({
  path: "/api/games/period",
  method: "POST",
  handler: updatePeriod,
});

// Enhanced live features
http.route({
  path: "/api/games/stats",
  method: "POST",
  handler: updateLiveStats,
});

http.route({
  path: "/api/games/broadcast",
  method: "POST",
  handler: updateBroadcast,
});

// Bulk operations
http.route({
  path: "/api/games/events/bulk",
  method: "POST",
  handler: bulkAddEvents,
});

// Data retrieval
http.route({
  path: "/api/games/state/*",
  method: "GET",
  handler: getGameState,
});

http.route({
  path: "/api/games/live",
  method: "GET",
  handler: getLiveGames,
});

// Webhooks and integrations
http.route({
  path: "/api/games/webhook",
  method: "POST",
  handler: gameDataWebhook,
});

// ===== LEGACY ENDPOINTS (for backward compatibility) =====
http.route({
  path: "/api/games/legacy/score",
  method: "POST",
  handler: updateLiveScore,
});

http.route({
  path: "/api/games/status/*",
  method: "GET",
  handler: getGameStatus,
});

// ===== CORS PREFLIGHT REQUESTS =====
const corsRoutes = [
  "/api/games/start",
  "/api/games/end", 
  "/api/games/score",
  "/api/games/events",
  "/api/games/period",
  "/api/games/stats",
  "/api/games/broadcast",
  "/api/games/events/bulk",
  "/api/games/state/*",
  "/api/games/live",
  "/api/games/webhook",
  "/api/games/legacy/score",
  "/api/games/status/*"
];

corsRoutes.forEach(path => {
  http.route({
    path,
    method: "OPTIONS",
    handler: handleOptions,
  });
});

export default http;