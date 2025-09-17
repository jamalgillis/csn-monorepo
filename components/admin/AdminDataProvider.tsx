"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAdminData } from "@/hooks/admin/useAdminData";
import { ConsolidatedAdminData } from "@/lib/types/admin";

/**
 * Admin Data Context
 * Provides centralized admin data management with error boundaries
 * Implements performance optimization through context pattern
 */
const AdminDataContext = createContext<ConsolidatedAdminData | null>(null);

interface AdminDataProviderProps {
  children: ReactNode;
}

export function AdminDataProvider({ children }: AdminDataProviderProps) {
  const adminData = useAdminData();

  return (
    <AdminDataContext.Provider value={adminData}>
      {children}
    </AdminDataContext.Provider>
  );
}

/**
 * Admin Data Hook
 * Custom hook for accessing admin data context
 * Provides type-safe access with error handling
 */
export function useAdminDataContext(): ConsolidatedAdminData {
  const context = useContext(AdminDataContext);
  
  if (!context) {
    throw new Error("useAdminDataContext must be used within AdminDataProvider");
  }
  
  return context;
}

/**
 * Admin Loading State Component
 * Standardized loading indicator for admin dashboard
 */
export function AdminLoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2 text-muted-foreground">Loading admin data...</span>
    </div>
  );
}

/**
 * Admin Error State Component
 * Standardized error display for admin dashboard
 */
interface AdminErrorStateProps {
  error: Error;
  retry?: () => void;
}

export function AdminErrorState({ error, retry }: AdminErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-destructive mb-2">⚠️ Error loading admin data</div>
      <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
      {retry && (
        <button 
          onClick={retry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Admin Data Status Component
 * Shows real-time connection and sync status
 */
export function AdminDataStatus() {
  const { isLoading, hasError, allDataLoaded, health } = useAdminDataContext();
  
  if (isLoading) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
        Syncing...
      </div>
    );
  }
  
  if (hasError) {
    return (
      <div className="flex items-center text-sm text-destructive">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        Connection Error
      </div>
    );
  }
  
  if (allDataLoaded && health?.status === "healthy") {
    return (
      <div className="flex items-center text-sm text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        Live
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
      Ready
    </div>
  );
}