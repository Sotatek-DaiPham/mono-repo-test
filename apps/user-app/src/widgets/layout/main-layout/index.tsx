'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/shared/lib/store/auth.store';
import { ThemeToggle } from '@/shared/ui';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants/routes';
import { getTierDisplayName } from '@/shared/lib/utils/tier';
import { LogOut, User, CheckSquare } from 'lucide-react';
import { NotificationBell } from '@/widgets/notifications/notification-bell';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
              <CheckSquare className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-foreground">
                TaskFlow
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href={ROUTES.TODOS}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Todos
                  </Link>
                  <Link
                    href={ROUTES.PROFILE}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {user?.email}
                  </Link>
                  {user?.tier && (
                    <div className="px-2 py-1 text-xs font-semibold rounded-md bg-primary/10 text-primary border border-primary/20">
                      {getTierDisplayName(user.tier)}
                    </div>
                  )}
                  <NotificationBell />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm">
                      Sign in
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER}>
                    <Button size="sm" className="btn-primary">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-auto py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

