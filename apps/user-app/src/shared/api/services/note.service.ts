// Note API service

import { apiClient } from '../client';
import { Note } from '@/entities/note';
import { CreateNoteRequest, UpdateNoteRequest } from '../../lib/types';
import { API_ENDPOINTS } from '../../constants';

export const noteService = {
  getAll: async (search?: string): Promise<Note[]> => {
    const params = search ? { search } : undefined;
    const response = await apiClient.get<Note[]>(API_ENDPOINTS.NOTES.BASE, { params });
    return response.data;
  },

  getById: async (id: string): Promise<Note> => {
    const response = await apiClient.get<Note>(API_ENDPOINTS.NOTES.BY_ID(id));
    return response.data;
  },

  getCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<{ count: number }>(API_ENDPOINTS.NOTES.COUNT);
    return response.data;
  },

  create: async (data: CreateNoteRequest): Promise<Note> => {
    const response = await apiClient.post<Note>(API_ENDPOINTS.NOTES.BASE, data);
    return response.data;
  },

  update: async (id: string, data: UpdateNoteRequest): Promise<Note> => {
    const response = await apiClient.put<Note>(API_ENDPOINTS.NOTES.BY_ID(id), data);
    return response.data;
  },

  partialUpdate: async (id: string, data: UpdateNoteRequest): Promise<Note> => {
    const response = await apiClient.patch<Note>(API_ENDPOINTS.NOTES.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.NOTES.BY_ID(id));
  },

  uploadImage: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ url: string; publicId: string }>(
      API_ENDPOINTS.NOTES.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

