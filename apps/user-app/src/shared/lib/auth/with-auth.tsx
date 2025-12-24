'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { Loader2 } from 'lucide-react';

interface WithAuthOptions {
  redirectTo?: string;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasHydrated = useAuthStore((state) => state._hasHydrated);
    const [mounted, setMounted] = useState(false);

    // Mark as mounted on client-side
    useEffect(() => {
      setMounted(true);
    }, []);

    // Check hydration status
    useEffect(() => {
      if (mounted && !hasHydrated) {
        // If mounted but not hydrated, check persist status
        const checkHydration = () => {
          const state = useAuthStore.getState();
          if (!state._hasHydrated) {
            // Force set hydration after a short delay if persist hasn't fired
            setTimeout(() => {
              useAuthStore.setState({ _hasHydrated: true });
            }, 100);
          }
        };
        checkHydration();
      }
    }, [mounted, hasHydrated]);

    useEffect(() => {
      // Only redirect after hydration is complete
      if (hasHydrated && !isAuthenticated) {
        router.push(options.redirectTo || ROUTES.LOGIN);
      }
    }, [hasHydrated, isAuthenticated, router, options.redirectTo]);

    // Show loading while waiting for hydration
    if (!mounted || !hasHydrated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    // Show redirect message if not authenticated (after hydration)
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

