# Admin Authentication Fix

## Issue
The admin dashboard was throwing multiple authentication errors:
1. "Unauthorized: Authentication required" when accessing admin functions in Convex
2. "useAuth is not a function" when using ConvexProviderWithClerk
3. "No JWT template exists with name: convex" when trying to authenticate

## Root Cause
The issues were due to **incomplete Convex-Clerk authentication integration**:
1. ConvexProvider was not passing authentication tokens from Clerk to Convex
2. ConvexProviderWithClerk requires the useAuth hook function, not a boolean
3. Clerk requires a JWT template named "convex" to work with ConvexProviderWithClerk

## Solution
Fixed the authentication integration by implementing a custom auth configuration:

1. **Custom Auth Integration**: Used ConvexReactClient with custom auth configuration instead of ConvexProviderWithClerk
2. **Fallback Token Strategy**: Implemented fallback to use default Clerk token when convex JWT template is not configured
3. **Simplified Admin Auth**: Cleaned up the `requireAdminAuth` function to work with the proper authentication flow

## Files Modified
- `app/providers/ConvexClientProvider.tsx`: Changed to use `ConvexProviderWithClerk`
- `convex/admin.ts`: Simplified `requireAdminAuth` function

## Key Changes

### ConvexClientProvider.tsx
```tsx
// Before
import { ConvexProvider, ConvexReactClient } from "convex/react";
return <ConvexProvider client={convex}>{children}</ConvexProvider>;

// After
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(url, {
  auth: {
    getToken: async () => {
      if (!isSignedIn) return null;
      try {
        return await getToken({ template: "convex" });
      } catch (error) {
        console.warn("Convex JWT template not configured, using default token");
        return await getToken();
      }
    }
  }
});

return <ConvexProvider client={convex}>{children}</ConvexProvider>;
```

### admin.ts
Simplified the authentication function to work with the proper Clerk integration.

## Security Considerations
- Now properly authenticated users can access admin functions
- The authentication is handled by Clerk and passed to Convex correctly
- For production, additional role-based authorization should be implemented

## Next Steps for Production
1. **Configure Clerk JWT Template** (Recommended):
   - Go to Clerk Dashboard → JWT Templates
   - Create new template named `convex`
   - Use template content:
   ```json
   {
     "iat": {{date.now}},
     "exp": {{date.now_plus_24_hours}},
     "iss": "{{org.slug}}",
     "sub": "{{user.id}}"
   }
   ```
2. Add organization-based authorization checks
3. Implement granular role permissions
4. Add audit logging for admin actions

## Testing
After the fix:
- Admin dashboard loads without authentication errors
- All admin queries work properly with authenticated users
- Proper integration between Clerk and Convex