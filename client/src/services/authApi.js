import axiosClient from './axiosClient';

export const authApi = {
  register: (userData) => axiosClient.post('/auth/register', userData),
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  getMe: () => axiosClient.get('/auth/me'),
  updateProfile: (profileData) => axiosClient.put('/auth/profile', profileData),
  updatePassword: (passwordData) => axiosClient.put('/auth/update-password', passwordData),
  logout: () => axiosClient.post('/auth/logout')
};
