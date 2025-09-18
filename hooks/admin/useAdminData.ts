"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Admin Dashboard Data Hook
 * Provides real-time admin dashboard metrics with error handling
 * Implements consistent loading states and error management
 */
export function useAdminDashboardMetrics() {
  const data = useQuery(api.admin.getAdminDashboardMetrics);
  
  return {
    data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch admin metrics") : null,
    refresh: () => {
      // Convex handles automatic refresh via subscriptions
      // This could be extended with manual refresh if needed
    }
  };
}

/**
 * Admin Activity Hook
 * Tracks recent administrative actions with configurable limits
 */
export function useAdminActivity(limit?: number) {
  const data = useQuery(api.admin.getRecentAdminActivity, { limit });
  
  return {
    data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch admin activity") : null
  };
}

/**
 * System Health Hook
 * Monitors system health status with real-time updates
 */
export function useSystemHealth() {
  const data = useQuery(api.admin.getSystemHealthStatus);
  
  return {
    data,
    isLoading: data === undefined,
    error: data === null ? new Error("Failed to fetch system health") : null,
    isHealthy: data?.status === "healthy",
    hasIssues: data?.status === "degraded" || data?.status === "error"
  };
}

/**
 * Consolidated Admin Data Hook
 * Provides all admin dashboard data in a single hook for optimal performance
 * Reduces multiple subscriptions and provides coordinated loading states
 */
export function useAdminData() {
  const metrics = useAdminDashboardMetrics();
  const activity = useAdminActivity(10);
  const health = useSystemHealth();
  
  const isLoading = metrics.isLoading || activity.isLoading || health.isLoading;
  const hasError = metrics.error || activity.error || health.error;
  
  return {
    metrics: metrics.data,
    activity: activity.data,
    health: health.data,
    isLoading,
    hasError,
    allDataLoaded: !isLoading && !hasError
  };
}