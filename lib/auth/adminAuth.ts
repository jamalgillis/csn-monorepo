/**
 * Admin Authorization Utilities
 * Centralized security functions for admin role verification
 * Addresses critical security risk SEC-001 from QA assessment
 */

import { auth } from "@clerk/nextjs/server";

/**
 * Admin Roles Definition
 * Defines the hierarchy and permissions for admin users
 */
export const ADMIN_ROLES = {
  SYSTEM_ADMINISTRATOR: "System Administrator",
  SPORTS_ADMIN_COORDINATOR: "Sports Admin Coordinator", 
  CONTENT_MANAGER: "Content Manager"
} as const;

export type AdminRole = typeof ADMIN_ROLES[keyof typeof ADMIN_ROLES];

/**
 * Admin Permissions Matrix
 * Maps roles to specific permissions for granular access control
 */
export const ADMIN_PERMISSIONS = {
  [ADMIN_ROLES.SYSTEM_ADMINISTRATOR]: [
    "read:dashboard",
    "read:games", "write:games",
    "read:content", "write:content", 
    "read:users", "write:users",
    "read:analytics", "write:analytics",
    "read:system", "write:system"
  ],
  [ADMIN_ROLES.SPORTS_ADMIN_COORDINATOR]: [
    "read:dashboard",
    "read:games", "write:games",
    "read:content", "write:content",
    "read:analytics"
  ],
  [ADMIN_ROLES.CONTENT_MANAGER]: [
    "read:dashboard", 
    "read:content", "write:content",
    "read:analytics"
  ]
} as const;

/**
 * CSN Organization Validation
 * Verifies user belongs to the Community Sports Network organization
 */
export async function validateCsnOrganization(): Promise<boolean> {
  try {
    const { userId, orgId, orgRole } = await auth();
    
    if (!userId || !orgId) {
      return false;
    }

    // Check if user belongs to CSN organization
    // TODO: Replace with actual CSN organization ID from environment
    const CSN_ORG_ID = process.env.CSN_ORGANIZATION_ID || "csn-org-id";
    
    if (orgId !== CSN_ORG_ID) {
      console.warn(`Unauthorized organization access attempt: ${orgId} by user ${userId}`);
      return false;
    }

    // Verify user has admin role in organization
    if (!orgRole || !["admin", "org:admin"].includes(orgRole)) {
      console.warn(`Insufficient organization role: ${orgRole} for user ${userId}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Organization validation error:", error);
    return false;
  }
}

/**
 * Admin Role Verification
 * Validates user has required admin role for system access
 */
export async function validateAdminRole(requiredRole?: AdminRole): Promise<{
  isValid: boolean;
  userRole?: AdminRole;
  userId?: string;
}> {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return { isValid: false };
    }

    // Extract user role from session claims
    // TODO: Implement proper role extraction from Clerk metadata
    const userRole = sessionClaims?.metadata?.adminRole as AdminRole;
    
    if (!userRole || !Object.values(ADMIN_ROLES).includes(userRole)) {
      console.warn(`Invalid or missing admin role for user ${userId}: ${userRole}`);
      return { isValid: false, userId };
    }

    // If specific role required, validate it
    if (requiredRole && userRole !== requiredRole && userRole !== ADMIN_ROLES.SYSTEM_ADMINISTRATOR) {
      console.warn(`Insufficient role: ${userRole}, required: ${requiredRole} for user ${userId}`);
      return { isValid: false, userRole, userId };
    }

    return { isValid: true, userRole, userId };
  } catch (error) {
    console.error("Admin role validation error:", error);
    return { isValid: false };
  }
}

/**
 * Permission Check
 * Validates user has specific permission for granular access control
 */
export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const roleValidation = await validateAdminRole();
    
    if (!roleValidation.isValid || !roleValidation.userRole) {
      return false;
    }

    const userPermissions = ADMIN_PERMISSIONS[roleValidation.userRole];
    return userPermissions.includes(permission as any);
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}

/**
 * Comprehensive Admin Authorization
 * Single function for complete admin access validation
 * Used by all admin Convex functions for consistent security
 */
export async function authorizeAdmin(requiredPermission?: string): Promise<{
  authorized: boolean;
  userId?: string;
  userRole?: AdminRole;
  error?: string;
}> {
  try {
    // Step 1: Validate organization membership
    const orgValid = await validateCsnOrganization();
    if (!orgValid) {
      return { 
        authorized: false, 
        error: "User not authorized for CSN organization" 
      };
    }

    // Step 2: Validate admin role
    const roleValidation = await validateAdminRole();
    if (!roleValidation.isValid) {
      return { 
        authorized: false, 
        error: "User does not have valid admin role",
        userId: roleValidation.userId 
      };
    }

    // Step 3: Check specific permission if required
    if (requiredPermission) {
      const hasRequiredPermission = await hasPermission(requiredPermission);
      if (!hasRequiredPermission) {
        return { 
          authorized: false, 
          error: `User lacks required permission: ${requiredPermission}`,
          userId: roleValidation.userId,
          userRole: roleValidation.userRole 
        };
      }
    }

    return { 
      authorized: true, 
      userId: roleValidation.userId,
      userRole: roleValidation.userRole 
    };
  } catch (error) {
    console.error("Admin authorization error:", error);
    return { 
      authorized: false, 
      error: "Authorization check failed" 
    };
  }
}

/**
 * Audit Logging Function
 * Logs admin actions for security and compliance
 * Addresses critical risk DATA-001 from QA assessment
 */
export async function logAdminAction(action: {
  type: string;
  description: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const auth_result = await authorizeAdmin();
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: auth_result.userId,
      userRole: auth_result.userRole,
      action: action.type,
      description: action.description,
      entityId: action.entityId,
      entityType: action.entityType,
      metadata: action.metadata,
      ipAddress: "TODO", // Extract from request context
      userAgent: "TODO"   // Extract from request context
    };

    // TODO: Implement proper audit log storage
    // For now, log to console with structured format
    console.log("ADMIN_AUDIT:", JSON.stringify(logEntry));
    
    // TODO: Send to external audit system if required
    // await sendToAuditSystem(logEntry);
    
  } catch (error) {
    console.error("Audit logging error:", error);
    // Don't throw - audit logging failures shouldn't break operations
  }
}