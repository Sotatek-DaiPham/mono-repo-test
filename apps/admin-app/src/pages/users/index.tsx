import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/shared/api';
import { UserListQueryParams } from '@/shared/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Pagination } from '@/shared/ui/pagination';
import { SortableTableHeader } from '@/shared/ui/sortable-table-header';
import { Loader2, Eye, Search } from 'lucide-react';
import { format } from 'date-fns';

export function UsersPage() {
  const [params, setParams] = useState<UserListQueryParams>({
    page: 1,
    limit: 1,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setParams((prev) => ({ ...prev, page: 1, search: search || undefined }));
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      ...params,
      search: debouncedSearch || undefined,
    }),
    [params, debouncedSearch]
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', queryParams],
    queryFn: () => adminService.getUsers(queryParams),
  });

  const handleSort = (key: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: key as UserListQueryParams['sortBy'],
      sortOrder:
        prev.sortBy === key && prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-destructive">Failed to load users</p>
        </div>
      </div>
    );
  }

  const users = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users, their tiers, and account status
            {meta && ` • Total: ${meta.total} users`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={params.role || 'all'}
              onValueChange={(value) =>
                setParams({ ...params, role: value === 'all' ? undefined : value, page: 1 })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={params.tier || 'all'}
              onValueChange={(value) =>
                setParams({ ...params, tier: value === 'all' ? undefined : value, page: 1 })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={params.isBanned !== undefined ? String(params.isBanned) : 'all'}
              onValueChange={(value) => {
                let isBanned: boolean | undefined;
                if (value === 'all') {
                  isBanned = undefined;
                } else if (value === 'true') {
                  isBanned = true;
                } else {
                  isBanned = false;
                }
                setParams({
                  ...params,
                  isBanned,
                  page: 1,
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="false">Active</SelectItem>
                <SelectItem value="true">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users found</p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTableHeader
                        sortKey="email"
                        currentSort={params.sortBy}
                        sortOrder={params.sortOrder}
                        onSort={handleSort}
                      >
                        Email
                      </SortableTableHeader>
                      <SortableTableHeader
                        sortKey="role"
                        currentSort={params.sortBy}
                        sortOrder={params.sortOrder}
                        onSort={handleSort}
                      >
                        Role
                      </SortableTableHeader>
                      <SortableTableHeader
                        sortKey="tier"
                        currentSort={params.sortBy}
                        sortOrder={params.sortOrder}
                        onSort={handleSort}
                      >
                        Tier
                      </SortableTableHeader>
                      <TableHead>Status</TableHead>
                      <SortableTableHeader
                        sortKey="createdAt"
                        currentSort={params.sortBy}
                        sortOrder={params.sortOrder}
                        onSort={handleSort}
                      >
                        Created At
                      </SortableTableHeader>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(user.createdAt), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(user.updatedAt), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta && (
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  total={meta.total}
                  pageSize={params.limit || 10}
                  onPageChange={handlePageChange}
                  onPageSizeChange={(pageSize) => {
                    setParams({
                      ...params,
                      limit: pageSize,
                      page: 1,
                    });
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

