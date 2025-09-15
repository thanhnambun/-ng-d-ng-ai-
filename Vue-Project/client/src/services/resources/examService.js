import { api } from '../api.js';

export const examService = {
  // Lấy tất cả bài thi
  async getAll() {
    return await api.get('/exams');
  },

  // Lấy bài thi theo subject ID
  async getBySubjectId(subjectId) {
    return await api.get('/exams', { idSubject: subjectId });
  },

  // Lấy bài thi theo ID
  async getById(id) {
    return await api.get('/exams', { id });
  },

  // Lấy bài thi với pagination
  async getPaginated(page = 1, limit = 10, subjectId = null) {
    const additionalParams = subjectId ? { idSubject: subjectId } : {};
    return await api.getPaginated('/exams', page, limit, additionalParams);
  },

  // Tạo bài thi mới
  async create(examData) {
    return await api.post('/exams', examData);
  },

  // Cập nhật bài thi
  async update(id, examData) {
    return await api.put(`/exams/${id}`, examData);
  },

  // Xóa bài thi
  async delete(id) {
    return await api.delete(`/exams/${id}`);
  },
};
