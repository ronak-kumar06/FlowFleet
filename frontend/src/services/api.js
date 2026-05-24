import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5000/api', // HTTPS as requested
});

// Intercept requests to add the auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('auth-storage'))?.state?.user;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
