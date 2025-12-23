// Error handling utilities

export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

export class ApiException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors?: string[],
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

export const handleApiError = (error: unknown): ApiException => {
  if (error instanceof ApiException) {
    return error;
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { data?: ApiError; status?: number } };
    const apiError = axiosError.response?.data;
    const statusCode = axiosError.response?.status || 500;

    if (apiError) {
      const message = Array.isArray(apiError.message)
        ? apiError.message.join(', ')
        : apiError.message || 'An error occurred';
      return new ApiException(message, statusCode, Array.isArray(apiError.message) ? apiError.message : undefined);
    }
  }

  if (error instanceof Error) {
    return new ApiException(error.message, 500);
  }

  return new ApiException('An unexpected error occurred', 500);
};

