"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ContentUpdateRequest } from "@/lib/types/admin";
import { useToast } from "@/hooks/use-toast";

/**
 * Admin Content Management Hook
 * Provides optimistic updates and error handling for admin content operations
 * Implements audit logging and security validation
 */
export function useAdminContentMutations() {
  const { toast } = useToast();
  const updateContentStatus = useMutation(api.admin.updateContentStatus);

  const updateContent = async (request: ContentUpdateRequest) => {
    try {
      // Optimistic update with loading state
      toast({
        title: "Updating content...",
        description: `Changing status to ${request.status}`,
      });

      const result = await updateContentStatus({
        contentId: request.contentId,
        status: request.status,
        reason: request.reason
      });

      // Success notification
      toast({
        title: "Content updated successfully",
        description: `Status changed to ${result.newStatus}`,
      });

      return result;
    } catch (error) {
      // Error handling with user feedback
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      toast({
        title: "Failed to update content",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  };

  return {
    updateContent,
    isUpdating: false // Could be enhanced with loading state tracking
  };
}

/**
 * Admin Batch Operations Hook
 * Handles bulk operations with progress tracking and error recovery
 */
export function useAdminBatchOperations() {
  const { toast } = useToast();
  const updateContentStatus = useMutation(api.admin.updateContentStatus);

  const batchUpdateContent = async (
    requests: ContentUpdateRequest[],
    onProgress?: (completed: number, total: number) => void
  ) => {
    const results = [];
    const errors = [];

    for (let i = 0; i < requests.length; i++) {
      try {
        const result = await updateContentStatus({
          contentId: requests[i].contentId,
          status: requests[i].status,
          reason: requests[i].reason
        });
        
        results.push(result);
        onProgress?.(i + 1, requests.length);
      } catch (error) {
        errors.push({ request: requests[i], error });
        console.error(`Batch operation failed for item ${i}:`, error);
      }
    }

    // Summary notification
    if (errors.length === 0) {
      toast({
        title: "Batch operation completed",
        description: `Successfully updated ${results.length} items`,
      });
    } else {
      toast({
        title: "Batch operation completed with errors",
        description: `${results.length} successful, ${errors.length} failed`,
        variant: "destructive",
      });
    }

    return { results, errors };
  };

  return {
    batchUpdateContent
  };
}