import { Id } from "@/convex/_generated/dataModel";

/**
 * Admin Dashboard Types
 * Type definitions for admin dashboard data structures
 */

export interface AdminDashboardMetrics {
  // Games metrics
  totalGames: number;
  liveGames: number;
  scheduledGames: number;
  completedGames: number;
  
  // Content metrics
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  
  // User metrics
  totalUsers: number;
  
  // Recent activity
  recentActivity: AdminActivity[];
  
  // System health
  systemHealth: {
    databaseConnected: boolean;
    lastUpdated: number;
  };
}

export interface AdminActivity {
  type: "game" | "content";
  id: Id<"games"> | Id<"content">;
  title: string;
  timestamp: number;
  status: string;
}

export interface DetailedAdminActivity {
  id: Id<"games"> | Id<"content">;
  type: "game_update" | "content_update";
  description: string;
  timestamp: number;
  userId: string;
  metadata: {
    gameId?: Id<"games">;
    contentId?: Id<"content">;
    status?: string;
    [key: string]: any;
  };
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "error";
  timestamp: number;
  metrics?: {
    databaseResponseTime: number;
    totalEntities: number;
    uptime: number;
  };
  checks?: {
    database: "healthy" | "degraded" | "error";
    api: "healthy" | "degraded" | "error";
    storage: "healthy" | "degraded" | "error";
  };
  error?: string;
}

export interface ContentUpdateRequest {
  contentId: Id<"content">;
  status: "published" | "draft" | "archived";
  reason?: string;
}

export interface ContentUpdateResponse {
  success: boolean;
  contentId: Id<"content">;
  newStatus: "published" | "draft" | "archived";
  timestamp: number;
}

/**
 * Admin Authorization Types
 * Role-based access control definitions
 */
export type AdminRole = "Sports Admin Coordinator" | "Content Manager" | "System Administrator";

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  organizationId: string;
  permissions: AdminPermission[];
}

export type AdminPermission = 
  | "read:dashboard"
  | "read:games"
  | "write:games"
  | "read:content"
  | "write:content"
  | "read:users"
  | "write:users"
  | "read:analytics"
  | "read:system"
  | "write:system";

/**
 * Hook Return Types
 * Standardized return types for admin data hooks
 */
export interface AdminDataHookResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

export interface AdminMetricsHookResult extends AdminDataHookResult<AdminDashboardMetrics> {
  refresh: () => void;
}

export interface AdminActivityHookResult extends AdminDataHookResult<DetailedAdminActivity[]> {}

export interface SystemHealthHookResult extends AdminDataHookResult<SystemHealth> {
  isHealthy: boolean;
  hasIssues: boolean;
}

export interface ConsolidatedAdminData {
  metrics: AdminDashboardMetrics | undefined;
  activity: DetailedAdminActivity[] | undefined;
  health: SystemHealth | undefined;
  isLoading: boolean;
  hasError: Error | null;
  allDataLoaded: boolean;
}