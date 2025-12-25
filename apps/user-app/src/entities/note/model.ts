// Note entity model

export interface Note {
  id: string;
  title: string | null;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

