'use client';

import { MainLayout } from '@/widgets/layout/main-layout';
import { withAuth } from '@/shared/lib/auth';
import { useAuthStore } from '@/shared/lib/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTierDisplayName } from '@/shared/lib/utils/tier';
import { User, Mail, Shield, Crown } from 'lucide-react';

function ProfilePageContent() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">View and manage your account information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your account details and subscription tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base font-semibold">{user.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-base font-semibold capitalize">{user.role}</p>
              </div>
            </div>

            {/* Tier */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Subscription Tier</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-3 py-1 text-sm font-semibold rounded-md bg-primary/10 text-primary border border-primary/20">
                    {getTierDisplayName(user.tier)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

// Protect this page with authentication
export default withAuth(ProfilePageContent);

