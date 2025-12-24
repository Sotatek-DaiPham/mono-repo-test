'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/widgets/layout/main-layout';
import { todoService } from '@/shared/api';
import { Todo, TodoStatus, TodoPriority } from '@/entities/todo';
import { CreateTodoRequest, UpdateTodoRequest } from '@/shared/lib/types';
import { withAuth } from '@/shared/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/shared/lib/store/auth.store';
import { canUserUseFeature, getRequiredTierForFeature, getTierDisplayName } from '@/shared/lib/utils/tier';
import { Plus, Trash2, Loader2, Calendar as CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';

function TodosPageContent() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | undefined>(undefined);
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority | null>(null);
  const [newTodoStatus, setNewTodoStatus] = useState<TodoStatus>(TodoStatus.TODO);

  // Tier permissions
  const canSetDueDate = user ? canUserUseFeature(user.tier, 'canSetDueDate') : false;
  const canSetPriority = user ? canUserUseFeature(user.tier, 'canSetPriority') : false;

  // Fetch todos
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => todoService.getAll(),
  });

  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTodoRequest) => todoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
      setNewTodoDueDate(undefined);
      setNewTodoPriority(null);
      setNewTodoStatus(TodoStatus.TODO);
      toast.success('Todo created successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create todo');
    },
  });

  // Update todo mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) =>
      todoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo updated successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update todo');
    },
  });

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => todoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete todo');
    },
  });

  const handleCreate = () => {
    if (!newTodoTitle.trim()) return;
    createMutation.mutate({ 
      title: newTodoTitle.trim(),
      dueDate: newTodoDueDate ? newTodoDueDate.toISOString() : null,
      priority: newTodoPriority,
      status: newTodoStatus,
    });
  };

  const handleDueDateChange = (todo: Todo, date: Date | undefined) => {
    updateMutation.mutate({ 
      id: todo.id, 
      data: { dueDate: date ? date.toISOString() : null } 
    });
  };

  const handleToggleStatus = (todo: Todo) => {
    const newStatus = todo.status === TodoStatus.DONE 
      ? TodoStatus.TODO 
      : TodoStatus.DONE;
    updateMutation.mutate({ id: todo.id, data: { status: newStatus } });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePriorityChange = (todo: Todo, priority: string) => {
    if (priority === 'none') {
      updateMutation.mutate({ id: todo.id, data: { priority: null } });
    } else {
      updateMutation.mutate({ id: todo.id, data: { priority: priority as TodoPriority } });
    }
  };

  const todosByStatus = {
    [TodoStatus.TODO]: todos.filter(t => t.status === TodoStatus.TODO),
    [TodoStatus.DOING]: todos.filter(t => t.status === TodoStatus.DOING),
    [TodoStatus.DONE]: todos.filter(t => t.status === TodoStatus.DONE),
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Todos</h1>
          <p className="text-muted-foreground">Manage your tasks and stay organized</p>
        </div>

        {/* Create Todo Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-2 block">Title *</label>
                <Input
                  placeholder="Enter todo title..."
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  disabled={createMutation.isPending}
                />
              </div>

              {/* Status and Priority Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={newTodoStatus}
                    onValueChange={(value) => setNewTodoStatus(value as TodoStatus)}
                    disabled={createMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TodoStatus.TODO}>Todo</SelectItem>
                      <SelectItem value={TodoStatus.DOING}>Doing</SelectItem>
                      <SelectItem value={TodoStatus.DONE}>Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Select
                          value={newTodoPriority || 'none'}
                          onValueChange={(value) => 
                            setNewTodoPriority(value === 'none' ? null : value as TodoPriority)
                          }
                          disabled={createMutation.isPending || !canSetPriority}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Priority</SelectItem>
                            <SelectItem value={TodoPriority.LOW}>Low</SelectItem>
                            <SelectItem value={TodoPriority.MEDIUM}>Medium</SelectItem>
                            <SelectItem value={TodoPriority.HIGH}>High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipTrigger>
                    {!canSetPriority && (
                      <TooltipContent>
                        <p>This feature is available for {getTierDisplayName(getRequiredTierForFeature('canSetPriority'))} tier and above</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium mb-2 block">Due Date</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled={createMutation.isPending || !canSetDueDate}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newTodoDueDate ? format(newTodoDueDate, 'PPP') : 'Select due date (optional)'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newTodoDueDate}
                            onSelect={setNewTodoDueDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {newTodoDueDate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setNewTodoDueDate(undefined)}
                          disabled={createMutation.isPending || !canSetDueDate}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TooltipTrigger>
                  {!canSetDueDate && (
                    <TooltipContent>
                      <p>This feature is available for {getTierDisplayName(getRequiredTierForFeature('canSetDueDate'))} tier and above</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleCreate}
                disabled={createMutation.isPending || !newTodoTitle.trim()}
                className="w-full"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Todo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todos List */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No todos yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(todosByStatus).map(([status, statusTodos]) => (
              <div key={status}>
                <h2 className="text-lg font-semibold mb-4 capitalize">
                  {status} ({statusTodos.length})
                </h2>
                <div className="space-y-3">
                  {statusTodos.map((todo) => (
                    <Card key={todo.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={todo.status === TodoStatus.DONE}
                            onCheckedChange={() => handleToggleStatus(todo)}
                            className="mt-1"
                            disabled={updateMutation.isPending}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${todo.status === TodoStatus.DONE ? 'line-through text-muted-foreground' : ''}`}>
                              {todo.title}
                            </p>
                            {todo.dueDate && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <CalendarIcon className="h-3 w-3" />
                                {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 px-2 text-xs"
                                          disabled={updateMutation.isPending || !canSetDueDate}
                                        >
                                          <CalendarIcon className="h-3 w-3" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={todo.dueDate ? new Date(todo.dueDate) : undefined}
                                          onSelect={(date) => handleDueDateChange(todo, date)}
                                          initialFocus
                                        />
                                        {todo.dueDate && (
                                          <div className="p-2 border-t">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full"
                                              onClick={() => handleDueDateChange(todo, undefined)}
                                              disabled={!canSetDueDate}
                                            >
                                              <X className="h-3 w-3 mr-2" />
                                              Clear due date
                                            </Button>
                                          </div>
                                        )}
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </TooltipTrigger>
                                {!canSetDueDate && (
                                  <TooltipContent>
                                    <p>This feature is available for {getTierDisplayName(getRequiredTierForFeature('canSetDueDate'))} tier and above</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Select
                                      value={todo.priority || 'none'}
                                      onValueChange={(value) => 
                                        handlePriorityChange(todo, value)
                                      }
                                      disabled={updateMutation.isPending || !canSetPriority}
                                    >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No Priority</SelectItem>
                                  <SelectItem value={TodoPriority.LOW}>Low</SelectItem>
                                  <SelectItem value={TodoPriority.MEDIUM}>Medium</SelectItem>
                                  <SelectItem value={TodoPriority.HIGH}>High</SelectItem>
                                </SelectContent>
                              </Select>
                                  </div>
                                </TooltipTrigger>
                                {!canSetPriority && (
                                  <TooltipContent>
                                    <p>This feature is available for {getTierDisplayName(getRequiredTierForFeature('canSetPriority'))} tier and above</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(todo.id)}
                                className="h-7 px-2"
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin text-destructive" />
                                ) : (
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Protect this page with authentication
export default withAuth(TodosPageContent);

