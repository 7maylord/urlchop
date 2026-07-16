import axios from 'axios';
import config from "../config"

const axiosInstance = axios.create({
    baseURL: config.Api.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the auth token (stored under 'token') to every request.
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default axiosInstance;
