import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { LayoutDashboard } from 'lucide-react';

export function HomePage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <CardTitle>Admin Dashboard</CardTitle>
          </div>
          <CardDescription>Welcome to the Admin Panel</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage users, view statistics, and configure system settings from this dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

