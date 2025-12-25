'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { MainLayout } from '@/widgets/layout/main-layout';
import { noteService } from '@/shared/api';
import { Note } from '@/entities/note';
import { CreateNoteRequest } from '@/shared/lib/types';
import { withAuth } from '@/shared/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { NoteListItem } from '@/widgets/notes/note-list-item';
import { ROUTES } from '@/shared/constants/routes';
import { useDebounce } from '@/shared/lib/hooks/use-debounce';
import { CreateNoteDialog } from '@/features/notes/create-note-dialog';
import { useAuthStore } from '@/shared/lib/store/auth.store';
import { hasReachedNoteLimit, getTierLimits } from '@/shared/lib/utils/tier';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function NotesPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  // Get user from auth store
  const user = useAuthStore((state) => state.user);

  // Fetch notes with search
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', debouncedSearch],
    queryFn: () => noteService.getAll(debouncedSearch || undefined),
  });

  // Fetch note count for tier limit check
  const { data: noteCountData } = useQuery({
    queryKey: ['notes', 'count'],
    queryFn: () => noteService.getCount(),
  });

  const noteCount = noteCountData?.count || 0;

  // Check tier limit
  const tier = user?.tier;
  const isAtLimit = tier ? hasReachedNoteLimit(tier, noteCount) : false;
  const maxNotes = tier ? getTierLimits(tier).maxNotes : 10;
  const limitMessage = tier && maxNotes !== Infinity
    ? `You've reached the limit of ${maxNotes} notes for ${tier} tier. Upgrade to create more notes.`
    : '';

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateNoteRequest) => noteService.create(data),
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'count'] });
      toast.success('Note created successfully');
      router.push(`${ROUTES.NOTES}/${newNote.id}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create note');
    },
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => noteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'count'] });
      toast.success('Note deleted successfully');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete note');
    },
  });

  const handleCreateNote = (title: string, content: string) => {
    createMutation.mutate({
      title,
      content,
    });
  };

  const handleNoteClick = (noteId: string) => {
    router.push(`${ROUTES.NOTES}/${noteId}`);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notes</h1>
            <p className="text-muted-foreground mt-1">
              Your personal thinking space
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    disabled={createMutation.isPending || isAtLimit}
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        New Note
                      </>
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {isAtLimit && (
                <TooltipContent>
                  <p>{limitMessage}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Notes List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {debouncedSearch ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {debouncedSearch
                ? 'Try a different search term'
                : 'Create your first note to get started'}
            </p>
            {!debouncedSearch && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        onClick={() => setCreateDialogOpen(true)}
                        disabled={isAtLimit}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Note
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {isAtLimit && (
                    <TooltipContent>
                      <p>{limitMessage}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                onClick={() => handleNoteClick(note.id)}
                onDelete={handleDeleteNote}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}

        {/* Create Note Dialog */}
        <CreateNoteDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onConfirm={handleCreateNote}
          isLoading={createMutation.isPending}
        />
      </div>
    </MainLayout>
  );
}

export default withAuth(NotesPageContent);

