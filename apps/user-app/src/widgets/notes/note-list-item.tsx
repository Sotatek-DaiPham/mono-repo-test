'use client';

import { Note } from '@/entities/note';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NoteListItemProps {
  note: Note;
  isSelected?: boolean;
  onClick: () => void;
}

export function NoteListItem({ note, isSelected, onClick }: NoteListItemProps) {
  const title = note.title || 'Untitled';
  const relativeTime = formatDistanceToNow(new Date(note.updatedAt), {
    addSuffix: true,
  });

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow',
        isSelected && 'ring-2 ring-primary',
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground">{relativeTime}</p>
        </div>
      </CardContent>
    </Card>
  );
}

