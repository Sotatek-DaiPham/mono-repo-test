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

function NotesPageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Fetch notes with search
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', debouncedSearch],
    queryFn: () => noteService.getAll(debouncedSearch || undefined),
  });

  // Create note mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateNoteRequest) => noteService.create(data),
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      // Navigate to note editor (will be implemented in Phase 4)
      // For now, just show success
      toast.success('Note created successfully');
      // TODO: Navigate to note editor when Phase 4 is ready
      // router.push(`${ROUTES.NOTES}/${newNote.id}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create note');
    },
  });

  const handleCreateNote = () => {
    createMutation.mutate({
      title: null,
      content: '',
    });
  };

  const handleNoteClick = (noteId: string) => {
    // Navigate to note editor (will be implemented in Phase 4)
    // router.push(`${ROUTES.NOTES}/${noteId}`);
    toast.info('Note editor will be available in Phase 4');
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
          <Button onClick={handleCreateNote} disabled={createMutation.isPending}>
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
              <Button onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                onClick={() => handleNoteClick(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default withAuth(NotesPageContent);

