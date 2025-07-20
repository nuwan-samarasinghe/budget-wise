import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

const getCsrfToken = (): string | undefined => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match?.[1];
};

api.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken && config.method !== 'get') {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }
  return config;
});

export default api;
