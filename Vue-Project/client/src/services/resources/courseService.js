import { api } from '../api.js';

export const courseService = {
  // Lấy tất cả khóa học
  async getAll() {
    return await api.get('/courses');
  },

  // Lấy khóa học theo ID
  async getById(id) {
    return await api.get('/courses', { id });
  },

  // Lấy khóa học với pagination
  async getPaginated(page = 1, limit = 10) {
    return await api.getPaginated('/courses', page, limit);
  },

  // Tạo khóa học mới
  async create(courseData) {
    return await api.post('/courses', courseData);
  },

  // Cập nhật khóa học
  async update(id, courseData) {
    return await api.put(`/courses/${id}`, courseData);
  },

  // Xóa khóa học
  async delete(id) {
    return await api.delete(`/courses/${id}`);
  },
};
