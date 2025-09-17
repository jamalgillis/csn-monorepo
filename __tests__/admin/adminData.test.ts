/**
 * Admin Data Integration Tests
 * Tests admin dashboard data fetching, real-time updates, and error handling
 * Addresses testing requirements from Story 1.2
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/jest';

// Mock Convex hooks
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

import { useQuery, useMutation } from 'convex/react';
import { renderHook, waitFor } from '@testing-library/react';
import { useAdminDashboardMetrics, useAdminActivity, useSystemHealth, useAdminData } from '@/hooks/admin/useAdminData';
import { useAdminContentMutations } from '@/hooks/admin/useAdminMutations';

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;

describe('Admin Data Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAdminDashboardMetrics', () => {
    it('should return loading state when data is undefined', () => {
      mockUseQuery.mockReturnValue(undefined);
      
      const { result } = renderHook(() => useAdminDashboardMetrics());
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should return error state when data is null', () => {
      mockUseQuery.mockReturnValue(null);
      
      const { result } = renderHook(() => useAdminDashboardMetrics());
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(new Error("Failed to fetch admin metrics"));
    });

    it('should return data when successfully loaded', () => {
      const mockData = {
        totalGames: 10,
        liveGames: 2,
        scheduledGames: 5,
        completedGames: 3,
        totalContent: 25,
        publishedContent: 20,
        draftContent: 5,
        totalUsers: 100,
        recentActivity: [],
        systemHealth: {
          databaseConnected: true,
          lastUpdated: Date.now()
        }
      };
      
      mockUseQuery.mockReturnValue(mockData);
      
      const { result } = renderHook(() => useAdminDashboardMetrics());
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });
  });

  describe('useAdminActivity', () => {
    it('should pass limit parameter to query', () => {
      mockUseQuery.mockReturnValue([]);
      
      renderHook(() => useAdminActivity(15));
      
      expect(mockUseQuery).toHaveBeenCalledWith(
        expect.any(Object), // api.admin.getRecentAdminActivity
        { limit: 15 }
      );
    });

    it('should handle empty activity data', () => {
      mockUseQuery.mockReturnValue([]);
      
      const { result } = renderHook(() => useAdminActivity());
      
      expect(result.current.data).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useSystemHealth', () => {
    it('should correctly identify healthy status', () => {
      const healthyData = {
        status: 'healthy' as const,
        timestamp: Date.now(),
        metrics: {
          databaseResponseTime: 100,
          totalEntities: 135,
          uptime: Date.now()
        }
      };
      
      mockUseQuery.mockReturnValue(healthyData);
      
      const { result } = renderHook(() => useSystemHealth());
      
      expect(result.current.isHealthy).toBe(true);
      expect(result.current.hasIssues).toBe(false);
    });

    it('should correctly identify degraded status', () => {
      const degradedData = {
        status: 'degraded' as const,
        timestamp: Date.now(),
        error: 'Database slow'
      };
      
      mockUseQuery.mockReturnValue(degradedData);
      
      const { result } = renderHook(() => useSystemHealth());
      
      expect(result.current.isHealthy).toBe(false);
      expect(result.current.hasIssues).toBe(true);
    });
  });

  describe('useAdminData (consolidated)', () => {
    it('should aggregate loading states correctly', () => {
      // Mock different loading states
      mockUseQuery
        .mockReturnValueOnce(undefined) // metrics loading
        .mockReturnValueOnce([])        // activity loaded
        .mockReturnValueOnce({ status: 'healthy' }); // health loaded
      
      const { result } = renderHook(() => useAdminData());
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.allDataLoaded).toBe(false);
    });

    it('should indicate when all data is loaded successfully', () => {
      const mockMetrics = { totalGames: 5, totalUsers: 50 };
      const mockActivity = [{ id: '1', type: 'game_update' }];
      const mockHealth = { status: 'healthy' };
      
      mockUseQuery
        .mockReturnValueOnce(mockMetrics)
        .mockReturnValueOnce(mockActivity)
        .mockReturnValueOnce(mockHealth);
      
      const { result } = renderHook(() => useAdminData());
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBeNull();
      expect(result.current.allDataLoaded).toBe(true);
      expect(result.current.metrics).toEqual(mockMetrics);
      expect(result.current.activity).toEqual(mockActivity);
      expect(result.current.health).toEqual(mockHealth);
    });
  });
});

describe('Admin Content Mutations', () => {
  describe('useAdminContentMutations', () => {
    it('should handle successful content update', async () => {
      const mockMutation = jest.fn().mockResolvedValue({
        success: true,
        contentId: 'content-123',
        newStatus: 'published',
        timestamp: Date.now()
      });
      
      mockUseMutation.mockReturnValue(mockMutation);
      
      const { result } = renderHook(() => useAdminContentMutations());
      
      const updateRequest = {
        contentId: 'content-123' as any,
        status: 'published' as const,
        reason: 'Ready for publication'
      };
      
      const response = await result.current.updateContent(updateRequest);
      
      expect(mockMutation).toHaveBeenCalledWith({
        contentId: 'content-123',
        status: 'published',
        reason: 'Ready for publication'
      });
      expect(response.success).toBe(true);
    });

    it('should handle content update errors', async () => {
      const mockMutation = jest.fn().mockRejectedValue(new Error('Unauthorized'));
      mockUseMutation.mockReturnValue(mockMutation);
      
      const { result } = renderHook(() => useAdminContentMutations());
      
      const updateRequest = {
        contentId: 'content-123' as any,
        status: 'published' as const
      };
      
      await expect(result.current.updateContent(updateRequest)).rejects.toThrow('Unauthorized');
    });
  });
});

describe('Error Handling', () => {
  it('should handle network errors gracefully', () => {
    mockUseQuery.mockImplementation(() => {
      throw new Error('Network error');
    });
    
    expect(() => {
      renderHook(() => useAdminDashboardMetrics());
    }).toThrow('Network error');
  });

  it('should handle malformed data gracefully', () => {
    mockUseQuery.mockReturnValue({ invalid: 'data' });
    
    const { result } = renderHook(() => useAdminDashboardMetrics());
    
    // Should not crash, should return the data as-is
    expect(result.current.data).toEqual({ invalid: 'data' });
    expect(result.current.isLoading).toBe(false);
  });
});

describe('Real-time Updates', () => {
  it('should handle real-time data changes', async () => {
    const initialData = { totalGames: 5 };
    const updatedData = { totalGames: 6 };
    
    mockUseQuery.mockReturnValueOnce(initialData);
    
    const { result, rerender } = renderHook(() => useAdminDashboardMetrics());
    
    expect(result.current.data).toEqual(initialData);
    
    // Simulate real-time update
    mockUseQuery.mockReturnValueOnce(updatedData);
    rerender();
    
    expect(result.current.data).toEqual(updatedData);
  });
});