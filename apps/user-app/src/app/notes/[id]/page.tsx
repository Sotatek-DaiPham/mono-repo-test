'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/widgets/layout/main-layout';
import { noteService } from '@/shared/api';
import { NoteEditor } from '@/features/notes/note-editor';
import { withAuth } from '@/shared/lib/auth';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

function NoteEditorPageContent() {
  const params = useParams();
  const router = useRouter();
  const noteId = params?.id as string | undefined;

  // Fetch note
  const { data: note, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => noteService.getById(noteId!),
    enabled: !!noteId,
  });

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
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.NOTES)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
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

