/**
 * Admin Authorization Tests
 * Tests admin security functions and role-based access control
 * Addresses critical security risk SEC-001 from QA assessment
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/jest';

// Mock Clerk auth
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { 
  validateCsnOrganization, 
  validateAdminRole, 
  hasPermission, 
  authorizeAdmin,
  logAdminAction,
  ADMIN_ROLES,
  ADMIN_PERMISSIONS 
} from '@/lib/auth/adminAuth';

const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe('Admin Authorization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set default environment
    process.env.CSN_ORGANIZATION_ID = 'test-csn-org';
  });

  afterEach(() => {
    delete process.env.CSN_ORGANIZATION_ID;
  });

  describe('validateCsnOrganization', () => {
    it('should return true for valid CSN organization member', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        orgId: 'test-csn-org',
        orgRole: 'admin'
      });

      const result = await validateCsnOrganization();
      expect(result).toBe(true);
    });

    it('should return false for wrong organization', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        orgId: 'wrong-org',
        orgRole: 'admin'
      });

      const result = await validateCsnOrganization();
      expect(result).toBe(false);
    });

    it('should return false for insufficient org role', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        orgId: 'test-csn-org',
        orgRole: 'member'
      });

      const result = await validateCsnOrganization();
      expect(result).toBe(false);
    });

    it('should return false when not authenticated', async () => {
      mockAuth.mockResolvedValue({
        userId: null,
        orgId: null,
        orgRole: null
      });

      const result = await validateCsnOrganization();
      expect(result).toBe(false);
    });

    it('should handle auth errors gracefully', async () => {
      mockAuth.mockRejectedValue(new Error('Auth service down'));

      const result = await validateCsnOrganization();
      expect(result).toBe(false);
    });
  });

  describe('validateAdminRole', () => {
    it('should validate system administrator role', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.SYSTEM_ADMINISTRATOR
          }
        }
      });

      const result = await validateAdminRole();
      expect(result.isValid).toBe(true);
      expect(result.userRole).toBe(ADMIN_ROLES.SYSTEM_ADMINISTRATOR);
      expect(result.userId).toBe('user-123');
    });

    it('should validate specific role requirement', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.CONTENT_MANAGER
          }
        }
      });

      const result = await validateAdminRole(ADMIN_ROLES.CONTENT_MANAGER);
      expect(result.isValid).toBe(true);
    });

    it('should reject insufficient role', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.CONTENT_MANAGER
          }
        }
      });

      const result = await validateAdminRole(ADMIN_ROLES.SYSTEM_ADMINISTRATOR);
      expect(result.isValid).toBe(false);
    });

    it('should allow system administrator for any role requirement', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.SYSTEM_ADMINISTRATOR
          }
        }
      });

      const result = await validateAdminRole(ADMIN_ROLES.CONTENT_MANAGER);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid role', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: 'invalid-role'
          }
        }
      });

      const result = await validateAdminRole();
      expect(result.isValid).toBe(false);
    });

    it('should reject missing role', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {}
        }
      });

      const result = await validateAdminRole();
      expect(result.isValid).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should grant permission for system administrator', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.SYSTEM_ADMINISTRATOR
          }
        }
      });

      const result = await hasPermission('write:system');
      expect(result).toBe(true);
    });

    it('should grant appropriate permissions for content manager', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.CONTENT_MANAGER
          }
        }
      });

      const canWriteContent = await hasPermission('write:content');
      const canWriteSystem = await hasPermission('write:system');
      
      expect(canWriteContent).toBe(true);
      expect(canWriteSystem).toBe(false);
    });

    it('should deny permission for invalid role', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: 'invalid-role'
          }
        }
      });

      const result = await hasPermission('read:dashboard');
      expect(result).toBe(false);
    });
  });

  describe('authorizeAdmin', () => {
    beforeEach(() => {
      // Mock validateCsnOrganization to return true by default
      jest.spyOn(require('@/lib/auth/adminAuth'), 'validateCsnOrganization')
        .mockResolvedValue(true);
    });

    it('should authorize valid admin with all checks', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.SYSTEM_ADMINISTRATOR
          }
        }
      });

      const result = await authorizeAdmin('write:system');
      
      expect(result.authorized).toBe(true);
      expect(result.userId).toBe('user-123');
      expect(result.userRole).toBe(ADMIN_ROLES.SYSTEM_ADMINISTRATOR);
      expect(result.error).toBeUndefined();
    });

    it('should reject user not in CSN organization', async () => {
      jest.spyOn(require('@/lib/auth/adminAuth'), 'validateCsnOrganization')
        .mockResolvedValue(false);

      const result = await authorizeAdmin();
      
      expect(result.authorized).toBe(false);
      expect(result.error).toBe('User not authorized for CSN organization');
    });

    it('should reject user without admin role', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {}
        }
      });

      const result = await authorizeAdmin();
      
      expect(result.authorized).toBe(false);
      expect(result.error).toBe('User does not have valid admin role');
    });

    it('should reject user without required permission', async () => {
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.CONTENT_MANAGER
          }
        }
      });

      const result = await authorizeAdmin('write:system');
      
      expect(result.authorized).toBe(false);
      expect(result.error).toBe('User lacks required permission: write:system');
    });
  });

  describe('logAdminAction', () => {
    it('should log admin action with proper structure', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      mockAuth.mockResolvedValue({
        userId: 'user-123',
        sessionClaims: {
          metadata: {
            adminRole: ADMIN_ROLES.CONTENT_MANAGER
          }
        }
      });

      jest.spyOn(require('@/lib/auth/adminAuth'), 'validateCsnOrganization')
        .mockResolvedValue(true);

      await logAdminAction({
        type: 'content_update',
        description: 'Published article',
        entityId: 'content-456',
        entityType: 'content',
        metadata: { status: 'published' }
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'ADMIN_AUDIT:',
        expect.stringContaining('"action":"content_update"')
      );
      
      consoleSpy.mockRestore();
    });

    it('should not throw on logging errors', async () => {
      mockAuth.mockRejectedValue(new Error('Auth failure'));

      await expect(logAdminAction({
        type: 'test_action',
        description: 'Test action'
      })).resolves.not.toThrow();
    });
  });

  describe('ADMIN_PERMISSIONS matrix', () => {
    it('should have consistent permission structure', () => {
      // Verify all roles have required base permissions
      Object.values(ADMIN_ROLES).forEach(role => {
        const permissions = ADMIN_PERMISSIONS[role];
        expect(permissions).toContain('read:dashboard');
      });

      // Verify system administrator has all permissions
      const sysAdminPerms = ADMIN_PERMISSIONS[ADMIN_ROLES.SYSTEM_ADMINISTRATOR];
      expect(sysAdminPerms).toContain('write:system');
      expect(sysAdminPerms).toContain('write:users');
      
      // Verify content manager has appropriate permissions
      const contentManagerPerms = ADMIN_PERMISSIONS[ADMIN_ROLES.CONTENT_MANAGER];
      expect(contentManagerPerms).toContain('write:content');
      expect(contentManagerPerms).not.toContain('write:system');
    });
  });
});