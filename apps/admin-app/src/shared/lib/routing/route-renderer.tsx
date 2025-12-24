import { Suspense, ReactNode } from 'react';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { AdminLayout } from '@/widgets/layout/admin-layout';
import { RouteConfig } from '@/shared/config/routes.config';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export function renderRoute(route: RouteConfig): ReactNode {
  const { element: Component, protected: isProtected, requireAdmin, layout } = route;

  let element: ReactNode = (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );

  // Apply layout
  if (layout === 'admin') {
    element = <AdminLayout>{element}</AdminLayout>;
  }

  // Apply protection
  if (isProtected) {
    element = (
      <ProtectedRoute requireAdmin={requireAdmin}>
        {element}
      </ProtectedRoute>
    );
  }

  return element;
}

