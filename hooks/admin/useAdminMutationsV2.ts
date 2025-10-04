"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";

/**
 * Team Management Mutations
 */
export function useTeamMutations() {
  const createTeamMutation = useMutation(api.adminAPI.createTeam);
  const updateTeamMutation = useMutation(api.adminAPI.updateTeam);
  const deleteTeamMutation = useMutation(api.adminAPI.deleteTeam);

  return {
    createTeam: useCallback(
      async (data: Parameters<typeof createTeamMutation>[0]) => {
        try {
          const result = await createTeamMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Create team error:", error);
          throw error;
        }
      },
      [createTeamMutation]
    ),
    updateTeam: useCallback(
      async (data: Parameters<typeof updateTeamMutation>[0]) => {
        try {
          const result = await updateTeamMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Update team error:", error);
          throw error;
        }
      },
      [updateTeamMutation]
    ),
    deleteTeam: useCallback(
      async (teamId: Id<"teams">) => {
        try {
          const result = await deleteTeamMutation({ teamId });
          return { success: true, ...result };
        } catch (error) {
          console.error("Delete team error:", error);
          throw error;
        }
      },
      [deleteTeamMutation]
    )
  };
}

/**
 * Player Management Mutations
 */
export function usePlayerMutations() {
  const createPlayerMutation = useMutation(api.adminAPI.createPlayer);
  const updatePlayerMutation = useMutation(api.adminAPI.updatePlayer);
  const deletePlayerMutation = useMutation(api.adminAPI.deletePlayer);

  return {
    createPlayer: useCallback(
      async (data: Parameters<typeof createPlayerMutation>[0]) => {
        try {
          const result = await createPlayerMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Create player error:", error);
          throw error;
        }
      },
      [createPlayerMutation]
    ),
    updatePlayer: useCallback(
      async (data: Parameters<typeof updatePlayerMutation>[0]) => {
        try {
          const result = await updatePlayerMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Update player error:", error);
          throw error;
        }
      },
      [updatePlayerMutation]
    ),
    deletePlayer: useCallback(
      async (playerId: Id<"players">) => {
        try {
          const result = await deletePlayerMutation({ playerId });
          return { success: true, ...result };
        } catch (error) {
          console.error("Delete player error:", error);
          throw error;
        }
      },
      [deletePlayerMutation]
    )
  };
}

/**
 * Game Management Mutations
 */
export function useGameMutations() {
  const createGameMutation = useMutation(api.adminAPI.createGame);
  const updateGameMutation = useMutation(api.adminAPI.updateGame);
  const deleteGameMutation = useMutation(api.adminAPI.deleteGame);

  return {
    createGame: useCallback(
      async (data: Parameters<typeof createGameMutation>[0]) => {
        try {
          const result = await createGameMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Create game error:", error);
          throw error;
        }
      },
      [createGameMutation]
    ),
    updateGame: useCallback(
      async (data: Parameters<typeof updateGameMutation>[0]) => {
        try {
          const result = await updateGameMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Update game error:", error);
          throw error;
        }
      },
      [updateGameMutation]
    ),
    deleteGame: useCallback(
      async (gameId: Id<"games">) => {
        try {
          const result = await deleteGameMutation({ gameId });
          return { success: true, ...result };
        } catch (error) {
          console.error("Delete game error:", error);
          throw error;
        }
      },
      [deleteGameMutation]
    )
  };
}

/**
 * Sport Management Mutations
 */
export function useSportMutations() {
  const createSportMutation = useMutation(api.adminAPI.createSport);
  const updateSportMutation = useMutation(api.adminAPI.updateSport);

  return {
    createSport: useCallback(
      async (data: Parameters<typeof createSportMutation>[0]) => {
        try {
          const result = await createSportMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Create sport error:", error);
          throw error;
        }
      },
      [createSportMutation]
    ),
    updateSport: useCallback(
      async (data: Parameters<typeof updateSportMutation>[0]) => {
        try {
          const result = await updateSportMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Update sport error:", error);
          throw error;
        }
      },
      [updateSportMutation]
    )
  };
}

/**
 * Content Management Mutations
 */
export function useContentMutations() {
  const createContentMutation = useMutation(api.adminAPI.createContent);
  const updateContentMutation = useMutation(api.adminAPI.updateContent);
  const deleteContentMutation = useMutation(api.adminAPI.deleteContent);

  return {
    createContent: useCallback(
      async (data: Parameters<typeof createContentMutation>[0]) => {
        try {
          const result = await createContentMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Create content error:", error);
          throw error;
        }
      },
      [createContentMutation]
    ),
    updateContent: useCallback(
      async (data: Parameters<typeof updateContentMutation>[0]) => {
        try {
          const result = await updateContentMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Update content error:", error);
          throw error;
        }
      },
      [updateContentMutation]
    ),
    deleteContent: useCallback(
      async (contentId: Id<"content">) => {
        try {
          const result = await deleteContentMutation({ contentId });
          return { success: true, ...result };
        } catch (error) {
          console.error("Delete content error:", error);
          throw error;
        }
      },
      [deleteContentMutation]
    )
  };
}

/**
 * User Management Mutations
 */
export function useUserMutations() {
  const updateUserSubscriptionMutation = useMutation(api.adminAPI.updateUserSubscription);

  return {
    updateUserSubscription: useCallback(
      async (data: Parameters<typeof updateUserSubscriptionMutation>[0]) => {
        try {
          const result = await updateUserSubscriptionMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Update user subscription error:", error);
          throw error;
        }
      },
      [updateUserSubscriptionMutation]
    )
  };
}

/**
 * Media Management Mutations
 */
export function useMediaMutations() {
  const updateMediaStatusMutation = useMutation(api.adminAPI.updateMediaStatus);

  return {
    updateMediaStatus: useCallback(
      async (data: Parameters<typeof updateMediaStatusMutation>[0]) => {
        try {
          const result = await updateMediaStatusMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Update media status error:", error);
          throw error;
        }
      },
      [updateMediaStatusMutation]
    )
  };
}

/**
 * Live Game Control Mutations
 */
export function useLiveGameMutations() {
  const updateLiveGameControlMutation = useMutation(api.adminAPI.updateLiveGameControl);

  return {
    updateLiveGameControl: useCallback(
      async (data: Parameters<typeof updateLiveGameControlMutation>[0]) => {
        try {
          const result = await updateLiveGameControlMutation(data);
          return { success: true, ...result };
        } catch (error) {
          console.error("Update live game control error:", error);
          throw error;
        }
      },
      [updateLiveGameControlMutation]
    )
  };
}

/**
 * Consolidated mutations hook for all admin operations
 */
export function useAllAdminMutations() {
  const teamMutations = useTeamMutations();
  const playerMutations = usePlayerMutations();
  const gameMutations = useGameMutations();
  const sportMutations = useSportMutations();
  const contentMutations = useContentMutations();
  const userMutations = useUserMutations();
  const mediaMutations = useMediaMutations();
  const liveGameMutations = useLiveGameMutations();

  return {
    ...teamMutations,
    ...playerMutations,
    ...gameMutations,
    ...sportMutations,
    ...contentMutations,
    ...userMutations,
    ...mediaMutations,
    ...liveGameMutations
  };
}
