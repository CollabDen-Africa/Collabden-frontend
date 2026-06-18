import axios from 'axios';

/**
 * axiosInstance: Dedicated to direct backend communication.
 * Primarily used in Server Components or for initial data fetching 
 * where HTTP-only cookies are not yet involved or are handled manually.
 */
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://collabden-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * localApi: Dedicated to calling the frontend's local API routes (/api/*).
 * This is the standard for Client Components to ensure that the browser 
 * automatically attaches HTTP-only session cookies to requests.
 */
export const localApi = axios.create({
  baseURL: '', // Relative to the current domain
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
