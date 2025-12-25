'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState } from 'react';
import { noteService } from '@/shared/api';
import { UpdateNoteRequest } from '@/shared/lib/types';
import { Note } from '@/entities/note';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditorToolbar } from './toolbar';
import { useAutoSave } from '@/shared/lib/hooks/use-auto-save';
import { Input } from '@/components/ui/input';

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title || '');

  // Auto-save hook
  const {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
  } = useAutoSave({
    saveFn: (data: UpdateNoteRequest) =>
      noteService.partialUpdate(note.id, data),
    queryKeys: [['notes'], ['note', note.id]],
    debounceMs: 2000,
    enabled: true,
  });

  // Initialize editor with note content
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: note.content || '',
    immediatelyRender: false, // Prevent SSR hydration mismatch
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: () => {
      setHasUnsavedChanges(true);
    },
  });

  // Auto-save when title or content changes
  useEffect(() => {
    if (!editor) return;

    const html = editor.getHTML();
    const contentChanged = html !== (note.content || '');
    const titleChanged = title !== (note.title || '');

    if (contentChanged || titleChanged) {
      setHasUnsavedChanges(true);
    }
  }, [editor?.getHTML(), title, note.content, note.title, setHasUnsavedChanges]);

  // Auto-save with debounce
  useEffect(() => {
    if (!editor || !hasUnsavedChanges) return;

    const html = editor.getHTML();

    save({
      content: html,
      title: title || null,
    });
  }, [editor?.getHTML(), title, hasUnsavedChanges, save]);

  // Update editor content and title when note changes
  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content || '');
      setTitle(note.title || '');
      setHasUnsavedChanges(false);
    }
  }, [note.id]); // Only update when note ID changes (switching notes)

  if (!editor) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Title Input */}
      <div className="border-b px-4 py-3 bg-background">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="text-lg font-semibold border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      </div>

      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-2">
        <EditorToolbar editor={editor} />
      </div>

      {/* Save Status */}
      <div className="border-b px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-background">
        <div className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="h-3 w-3 text-green-600" />
              <span>
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

