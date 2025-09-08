import { httpRouter } from "convex/server";
import { 
  updateLiveScore, 
  startGame, 
  endGame, 
  addGameEvent, 
  getGameStatus,
  handleOptions 
} from "./gameHttpActions";

const http = httpRouter();

// Game score update endpoints
http.route({
  path: "/api/games/score",
  method: "POST",
  handler: updateLiveScore,
});

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

http.route({
  path: "/api/games/events",
  method: "POST",
  handler: addGameEvent,
});

// Get game status endpoint
http.route({
  path: "/api/games/status/*",
  method: "GET",
  handler: getGameStatus,
});

// CORS preflight requests
http.route({
  path: "/api/games/score",
  method: "OPTIONS",
  handler: handleOptions,
});

http.route({
  path: "/api/games/start", 
  method: "OPTIONS",
  handler: handleOptions,
});

http.route({
  path: "/api/games/end",
  method: "OPTIONS", 
  handler: handleOptions,
});

http.route({
  path: "/api/games/events",
  method: "OPTIONS",
  handler: handleOptions,
});

http.route({
  path: "/api/games/status/*",
  method: "OPTIONS",
  handler: handleOptions,
});

export default http;