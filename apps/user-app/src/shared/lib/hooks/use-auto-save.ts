import { useEffect, useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseAutoSaveOptions<TData, TVariables> {
  saveFn: (variables: TVariables) => Promise<TData>;
  queryKeys: string[][];
  debounceMs?: number;
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  save: (variables: any) => void;
}

/**
 * Auto-save hook with debounce
 * Handles saving state, debouncing, and query invalidation
 */
export function useAutoSave<TData, TVariables>({
  saveFn,
  queryKeys,
  debounceMs = 2000,
  enabled = true,
  onSuccess,
  onError,
}: UseAutoSaveOptions<TData, TVariables>): UseAutoSaveReturn {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingVariablesRef = useRef<TVariables | null>(null);

  const saveMutation = useMutation({
    mutationFn: saveFn,
    onSuccess: () => {
      // Invalidate all provided query keys
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      setIsSaving(false);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      pendingVariablesRef.current = null;
      onSuccess?.();
    },
    onError: (error) => {
      setIsSaving(false);
      onError?.(error as Error);
    },
  });

  const save = (variables: TVariables) => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Store pending variables
    pendingVariablesRef.current = variables;
    setIsSaving(true);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (pendingVariablesRef.current) {
        saveMutation.mutate(pendingVariablesRef.current);
      }
    }, debounceMs);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    save,
  };
}

