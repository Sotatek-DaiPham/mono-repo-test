import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/shared/api';
import { UserTier } from '@/entities/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Badge } from '@/shared/ui/badge';
import { Loader2, Ban, Unlock, Save } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface UserDetailDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({
  userId,
  open,
  onOpenChange,
}: UserDetailDialogProps) {
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => adminService.getUserById(userId!),
    enabled: !!userId && open,
  });

  // Initialize selectedTier when user data loads
  useEffect(() => {
    if (user) {
      setSelectedTier(user.tier);
    }
  }, [user]);

  const updateTierMutation = useMutation({
    mutationFn: (tier: UserTier) =>
      adminService.updateUserTier(userId!, { tier }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', userId] });
      toast.success('User tier updated successfully');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user tier');
    },
  });

  const banUserMutation = useMutation({
    mutationFn: () => adminService.banUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', userId] });
      toast.success('User banned successfully');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to ban user');
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: () => adminService.unbanUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', userId] });
      toast.success('User unbanned successfully');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unban user');
    },
  });

  const handleUpdateTier = () => {
    if (selectedTier && selectedTier !== user?.tier) {
      updateTierMutation.mutate(selectedTier);
    }
  };

  const handleBan = () => {
    if (confirm('Are you sure you want to ban this user?')) {
      banUserMutation.mutate();
    }
  };

  const handleUnban = () => {
    if (confirm('Are you sure you want to unban this user?')) {
      unbanUserMutation.mutate();
    }
  };

  if (!userId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>View and manage user information</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="mt-1 text-sm font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="mt-1">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tier</label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {user.tier}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  {user.isBanned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              {user.todosCount !== undefined && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Todos Count</label>
                  <p className="mt-1 text-sm font-medium">{user.todosCount}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <p className="mt-1 text-sm">
                  {format(new Date(user.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                <p className="mt-1 text-sm">
                  {format(new Date(user.updatedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>

            {/* Update Tier */}
            <div className="space-y-2 border-t pt-4">
              <label className="text-sm font-medium">Update Tier</label>
              <div className="flex gap-2">
                <Select
                  value={selectedTier || user.tier}
                  onValueChange={(value) => setSelectedTier(value as UserTier)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserTier.NORMAL}>Normal</SelectItem>
                    <SelectItem value={UserTier.PREMIUM}>Premium</SelectItem>
                    <SelectItem value={UserTier.PRO}>Pro</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleUpdateTier}
                  disabled={
                    updateTierMutation.isPending ||
                    selectedTier === user.tier ||
                    !selectedTier
                  }
                >
                  {updateTierMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update Tier
                </Button>
              </div>
            </div>

            {/* Ban/Unban Actions */}
            <div className="flex gap-2 border-t pt-4">
              {user.isBanned ? (
                <Button
                  variant="outline"
                  onClick={handleUnban}
                  disabled={unbanUserMutation.isPending}
                  className="flex-1"
                >
                  {unbanUserMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlock className="h-4 w-4 mr-2" />
                  )}
                  Unban User
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleBan}
                  disabled={banUserMutation.isPending}
                  className="flex-1"
                >
                  {banUserMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Ban className="h-4 w-4 mr-2" />
                  )}
                  Ban User
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

