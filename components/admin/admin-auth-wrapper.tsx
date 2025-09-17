"use client";

import { useAuth, useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Building2, AlertCircle } from "lucide-react";

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const { isLoaded: authLoaded, userId } = useAuth();
  const { organization, isLoaded: orgLoaded, membership } = useOrganization();
  const { organizationList, setActive, isLoaded: orgListLoaded } = useOrganizationList();
  const { user } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (authLoaded && orgLoaded && orgListLoaded) {
      setIsChecking(false);
    }
  }, [authLoaded, orgLoaded, orgListLoaded]);

  // Loading state
  if (isChecking || !authLoaded || !orgLoaded || !orgListLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle>Checking Access</CardTitle>
            <CardDescription>Verifying your permissions...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check if user is in CSN organization
  const isCsnMember =
    organization?.slug === "csn-staff" ||
    organization?.name?.toLowerCase().includes("csn");

  // Find CSN organization
  const csnOrg = organizationList?.find(org => 
    org.organization.slug === "csn-staff" || 
    org.organization.name.toLowerCase().includes("csn")
  );

  // Check if user has admin role (optional - you can add role-based permissions)
  const isAdmin =
    membership?.role === "org:admin" || membership?.role === "org:member";

  if (!userId) {
    router.push("/sign-in");
    return null;
  }

  // TEMPORARY: Skip org check for development (REMOVE AFTER FIXING)
  const bypassOrgCheck = process.env.NODE_ENV === 'development';
  
  if (!bypassOrgCheck && (!organization || !isCsnMember)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Admin access requires CSN organization membership
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You need to be a member of the CSN organization to access this
                area.
              </p>
              {user?.emailAddresses[0] && (
                <p className="text-sm">
                  Signed in as:{" "}
                  <strong>{user.emailAddresses[0].emailAddress}</strong>
                </p>
              )}
              {organization && (
                <p className="text-sm">
                  Current organization: <strong>{organization.name}</strong>
                </p>
              )}
              {!organization && csnOrg && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Found CSN organization. Click to activate:
                  </p>
                  <Button
                    onClick={() => setActive({ organization: csnOrg.organization.id })}
                    className="w-full"
                  >
                    Switch to {csnOrg.organization.name}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/sign-out")}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and in CSN organization
  return <>{children}</>;
}
