'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/widgets/layout/main-layout';
import { noteService } from '@/shared/api';
import { NoteEditor } from '@/features/notes/note-editor';
import { withAuth } from '@/shared/lib/auth';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

function NoteEditorPageContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const noteId = params?.id as string | undefined;

  // Fetch note
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => noteService.getById(noteId!),
    enabled: !!noteId,
  });

  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => noteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully');
      router.push(ROUTES.NOTES);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete note');
    },
  });

  const handleDelete = () => {
    if (noteId) {
      deleteMutation.mutate(noteId);
    }
  };

  // Early return if no noteId
  if (!noteId) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-destructive mb-4">Invalid note ID</p>
            <Button onClick={() => router.push(ROUTES.NOTES)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notes
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !note) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-destructive mb-4">Note not found</p>
            <Button onClick={() => router.push(ROUTES.NOTES)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notes
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.NOTES)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
          
          <ConfirmDialog
            title="Delete Note"
            description="Are you sure you want to delete this note? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            variant="destructive"
            onConfirm={handleDelete}
          >
            {(open) => (
              <Button
                variant="destructive"
                size="sm"
                onClick={open}
                disabled={deleteMutation.isPending}
                className="mb-4"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Note'}
              </Button>
            )}
          </ConfirmDialog>
        </div>

        {/* Editor */}
        <div className="border rounded-lg bg-card h-[calc(100vh-200px)] flex flex-col">
          <NoteEditor note={note} />
        </div>
      </div>
    </MainLayout>
  );
}

export default withAuth(NoteEditorPageContent);

