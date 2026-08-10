import axios from 'axios';

/**
 * Unified axiosInstance: Direct backend communication with HTTP-only cookies.
 * Configured with `withCredentials: true` to ensure HTTP-only session cookies
 * are automatically sent with all requests to NEXT_PUBLIC_API_BASE_URL.
 */
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://collabden-backend.onrender.com',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @deprecated Deprecated in favor of direct API calls using `axiosInstance` with `withCredentials: true`.
 */
export const localApi = axiosInstance;

export default axiosInstance;
