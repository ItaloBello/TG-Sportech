import axios from 'axios'

export const api = axios.create({
    baseURL:"http://localhost:8081"
});

api.interceptors.request.use(
  async (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const userData = JSON.parse(userString);
      // Assuming the token is stored as 'token' in the user object
      if (userData && userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);