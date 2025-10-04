"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Hook for fetching all teams
 */
export function useTeams() {
  const data = useQuery(api.adminAPI.getAllTeams);

  return {
    teams: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch teams") : null
  };
}

/**
 * Hook for fetching all players
 */
export function usePlayers() {
  const data = useQuery(api.adminAPI.getAllPlayers);

  return {
    players: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch players") : null
  };
}

/**
 * Hook for fetching players by team
 */
export function usePlayersByTeam(teamId: Id<"teams"> | null) {
  const data = useQuery(
    api.adminAPI.getPlayersByTeam,
    teamId ? { teamId } : "skip"
  );

  return {
    players: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch players") : null
  };
}

/**
 * Hook for fetching all games
 */
export function useGames() {
  const data = useQuery(api.adminAPI.getAllGames);

  return {
    games: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch games") : null
  };
}

/**
 * Hook for fetching all sports
 */
export function useSports() {
  const data = useQuery(api.adminAPI.getAllSports);

  return {
    sports: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch sports") : null
  };
}

/**
 * Hook for fetching all content
 */
export function useContent() {
  const data = useQuery(api.adminAPI.getAllContent);

  return {
    content: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch content") : null
  };
}

/**
 * Hook for fetching all users
 */
export function useUsers() {
  const data = useQuery(api.adminAPI.getAllUsers);

  return {
    users: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch users") : null
  };
}

/**
 * Hook for fetching all media
 */
export function useMedia() {
  const data = useQuery(api.adminAPI.getAllMedia);

  return {
    media: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch media") : null
  };
}

/**
 * Hook for fetching analytics overview
 */
export function useAnalytics() {
  const data = useQuery(api.adminAPI.getAnalyticsOverview);

  return {
    analytics: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch analytics") : null
  };
}

/**
 * Hook for fetching live game controls
 */
export function useLiveGameControls(gameId: Id<"games"> | null) {
  const data = useQuery(
    api.adminAPI.getLiveGameControls,
    gameId ? { gameId } : "skip"
  );

  return {
    controls: data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch live game controls") : null
  };
}

/**
 * Consolidated hook for all admin data
 */
export function useAdminAllData() {
  const teams = useTeams();
  const players = usePlayers();
  const games = useGames();
  const sports = useSports();
  const content = useContent();
  const users = useUsers();
  const media = useMedia();
  const analytics = useAnalytics();

  const isLoading =
    teams.isLoading ||
    players.isLoading ||
    games.isLoading ||
    sports.isLoading ||
    content.isLoading ||
    users.isLoading ||
    media.isLoading ||
    analytics.isLoading;

  const hasError =
    teams.error ||
    players.error ||
    games.error ||
    sports.error ||
    content.error ||
    users.error ||
    media.error ||
    analytics.error;

  return {
    teams: teams.teams,
    players: players.players,
    games: games.games,
    sports: sports.sports,
    content: content.content,
    users: users.users,
    media: media.media,
    analytics: analytics.analytics,
    isLoading,
    hasError,
    allDataLoaded: !isLoading && !hasError
  };
}
