import axios, { AxiosError } from 'axios';

/**
 * Helper to extract error message from API response data object.
 */
const extractErrorFromData = (data: any): string | null => {
  if (!data) return null;
  if (typeof data === 'string') return data;
  
  // 1. Direct message/error checks
  const directMessage = data.message || data.error;
  if (directMessage) return directMessage;

  // 2. Nested data message/error checks
  const nestedMessage = data.data?.message || data.data?.error;
  if (nestedMessage) return nestedMessage;

  // 3. Array of errors (validation errors, etc.)
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const firstError = data.errors[0];
    if (typeof firstError === 'string') return firstError;
    return firstError?.message || firstError?.error || 'Validation error';
  }

  return null;
};

/**
 * Helper to handle axios-specific errors.
 */
const getAxiosErrorMessage = (error: AxiosError): string => {
  const data = error.response?.data;
  const extracted = extractErrorFromData(data);
  if (extracted) return extracted;

  // Fallback to axios top-level error message
  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  // Fallback to status text
  if (error.response?.statusText) {
    return `Server Error: ${error.response.statusText}`;
  }

  return error.message || 'An unexpected network error occurred';
};

/**
 * Standardizes error extraction from API responses.
 * Deeply searches for an error message in common backend response structures.
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return getAxiosErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Global error handler for logging and potential UI notification integration.
 */
export const handleApiError = (error: unknown): string => {
  const message = getErrorMessage(error);
  console.error('[API Error]:', {
    message,
    originalError: error
  });
  return message;
};
