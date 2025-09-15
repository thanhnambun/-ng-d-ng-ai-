import { api } from '../api.js';

export const subjectService = {
  // Lấy tất cả môn học
  async getAll() {
    return await api.get('/subjects');
  },

  // Lấy môn học theo course ID
  async getByCourseId(courseId) {
    return await api.get('/subjects', { idCourse: courseId });
  },

  // Lấy môn học theo ID
  async getById(id) {
    return await api.get('/subjects', { id });
  },

  // Lấy môn học với pagination
  async getPaginated(page = 1, limit = 10, courseId = null) {
    const additionalParams = courseId ? { idCourse: courseId } : {};
    return await api.getPaginated('/subjects', page, limit, additionalParams);
  },

  // Tạo môn học mới
  async create(subjectData) {
    return await api.post('/subjects', subjectData);
  },

  // Cập nhật môn học
  async update(id, subjectData) {
    return await api.put(`/subjects/${id}`, subjectData);
  },

  // Xóa môn học
  async delete(id) {
    return await api.delete(`/subjects/${id}`);
  },
};
