import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

const getCsrfToken = (): string | undefined => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match?.[1];
};

// Call /api/csrf to mint or refresh the CSRF cookie
const fetchCsrfToken = async (): Promise<void> => {
  await api.get('/csrf'); // No need to handle token here, cookie is set automatically
};

// Track whether we’ve already initialized CSRF in this session
let csrfInitialized = false;

// Request interceptor — ensures CSRF token exists before state-changing requests
api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();

  // Only for non-GET (state-changing) requests
  if (method !== 'get') {
    if (!getCsrfToken() || !csrfInitialized) {
      await fetchCsrfToken();
      csrfInitialized = true;
    }
    const token = getCsrfToken();
    if (token) {
      config.headers['X-XSRF-TOKEN'] = token;
    }
  }

  return config;
});

// Response interceptor — if we hit a 403, refresh CSRF and retry once
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig: any = error.config;
    if (error.response?.status === 403 && !originalConfig?._csrfRetry) {
      try {
        await fetchCsrfToken();
        originalConfig._csrfRetry = true;
        const token = getCsrfToken();
        if (token) {
          originalConfig.headers['X-XSRF-TOKEN'] = token;
        }
        return api(originalConfig);
      } catch (csrfErr) {
        return Promise.reject(csrfErr);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
