import axios from 'axios';

const defaultBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://vista-tour-travel-api.onrender.com' : '/api');
let rawApiUrl = defaultBaseUrl.trim().replace(/\/+$/, '');
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor to attach bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vtt_token') || localStorage.getItem('rtt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Remove default Content-Type if payload is FormData so the browser automatically sets multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
      status: error.response?.status || 500,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;
