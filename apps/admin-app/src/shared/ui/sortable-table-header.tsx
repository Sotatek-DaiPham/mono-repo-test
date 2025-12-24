import { ReactNode } from 'react';
import { TableHead } from './table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableTableHeaderProps {
  children: ReactNode;
  sortKey: string;
  currentSort?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSort: (key: string) => void;
  className?: string;
}

export function SortableTableHeader({
  children,
  sortKey,
  currentSort,
  sortOrder,
  onSort,
  className,
}: SortableTableHeaderProps) {
  const isActive = currentSort === sortKey;

  return (
    <TableHead
      className={cn('cursor-pointer select-none hover:bg-muted/50', className)}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        <span className="inline-flex">
          {isActive ? (
            sortOrder === 'ASC' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
      </div>
    </TableHead>
  );
}

