// Todo API service

import { apiClient } from '../client';
import { Todo } from '@/entities/todo';
import { CreateTodoRequest, UpdateTodoRequest } from '../../lib/types';
import { API_ENDPOINTS } from '../../constants';

export const todoService = {
  getAll: async (): Promise<Todo[]> => {
    const response = await apiClient.get<Todo[]>(API_ENDPOINTS.TODOS.BASE);
    return response.data;
  },

  getById: async (id: string): Promise<Todo> => {
    const response = await apiClient.get<Todo>(API_ENDPOINTS.TODOS.BY_ID(id));
    return response.data;
  },

  create: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await apiClient.post<Todo>(API_ENDPOINTS.TODOS.BASE, data);
    return response.data;
  },

  update: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await apiClient.put<Todo>(API_ENDPOINTS.TODOS.BY_ID(id), data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.TODOS.BY_ID(id));
  },
};

