import axiosClient from './axiosClient';

export const blogApi = {
  getAll: (params) => axiosClient.get('/blogs', { params }),
  getBySlug: (slug) => axiosClient.get(`/blogs/${slug}`),
  create: (data) => axiosClient.post('/blogs', data),
  update: (id, data) => axiosClient.put(`/blogs/${id}`, data),
  delete: (id) => axiosClient.delete(`/blogs/${id}`)
};
