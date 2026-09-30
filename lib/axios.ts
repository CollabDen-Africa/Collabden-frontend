import axios from 'axios';


export const proxyAxios = axios.create({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin + "/api/proxy"
      : "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

// proxyAxios 401 handler — session expired or cookie missing
proxyAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isPublicPage =
        currentPath.startsWith("/auth") ||
        currentPath === "/" ||
        currentPath === "/admin" ||
        currentPath.startsWith("/admin/verify") ||
        currentPath.startsWith("/admin/reset");

      if (!isPublicPage) {
        console.warn(
          "[proxyAxios] 401 – session expired. Redirecting to login."
        );
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * axiosInstance — Direct backend communication.
 * For all user-facing authenticated calls, use `proxyAxios` instead.
 */
export const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://collabden-backend.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance: attach Bearer token from localStorage (used for admin routes)
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// axiosInstance 401 handler (admin sessions)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isPublicPage =
        currentPath.startsWith("/auth") ||
        currentPath === "/" ||
        currentPath === "/admin" ||
        currentPath.startsWith("/admin/verify") ||
        currentPath.startsWith("/admin/reset");

      localStorage.removeItem("auth_token");
      localStorage.removeItem("collabden_admin_logged_in");

      if (!isPublicPage) {
        console.warn("[axiosInstance] 401 – redirecting to login.");
        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

/** @deprecated Use proxyAxios for user-facing calls. */
export const localApi = proxyAxios;

export default axiosInstance;

