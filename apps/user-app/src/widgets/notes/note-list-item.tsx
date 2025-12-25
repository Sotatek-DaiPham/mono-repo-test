'use client';

import { Note } from '@/entities/note';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteListItemProps {
  note: Note;
  isSelected?: boolean;
  onClick: () => void;
  onDelete?: (noteId: string) => void;
  isDeleting?: boolean;
}

export function NoteListItem({ 
  note, 
  isSelected, 
  onClick, 
  onDelete,
  isDeleting = false,
}: NoteListItemProps) {
  const title = note.title || 'Untitled';
  const relativeTime = formatDistanceToNow(new Date(note.updatedAt), {
    addSuffix: true,
  });

  const handleDelete = () => {
    if (onDelete) {
      onDelete(note.id);
    }
  };

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-shadow relative',
        isSelected && 'ring-2 ring-primary',
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium line-clamp-2 flex-1">{title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClick}
                className="h-7 w-7 p-0"
                title="Edit note"
              >
                <Edit className="h-3 w-3" />
              </Button>
              {onDelete && (
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
                      variant="ghost"
                      size="sm"
                      onClick={open}
                      className="h-7 w-7 p-0"
                      disabled={isDeleting}
                      title="Delete note"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </ConfirmDialog>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{relativeTime}</p>
        </div>
      </CardContent>
    </Card>
  );
}

