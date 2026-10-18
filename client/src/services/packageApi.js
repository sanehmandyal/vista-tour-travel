import axiosClient from './axiosClient';

export const packageApi = {
  getAll: (params) => axiosClient.get('/packages', { params }),
  getBySlug: (slug) => axiosClient.get(`/packages/${slug}`),
  create: (data) => axiosClient.post('/packages', data),
  update: (id, data) => axiosClient.put(`/packages/${id}`, data),
  delete: (id) => axiosClient.delete(`/packages/${id}`)
};
