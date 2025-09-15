import { api } from '../api.js';

export const commentService = {
  // Lấy tất cả bình luận
  async getAll() {
    return await api.get('/comments');
  },

  // Lấy bình luận theo exam ID
  async getByExamId(examId) {
    return await api.get('/comments', { idExam: examId });
  },

  // Lấy bình luận theo ID
  async getById(id) {
    return await api.get(`/comments/${id}`);
  },

  // Lấy bình luận với pagination
  async getPaginated(page = 1, limit = 10, examId = null) {
    const additionalParams = examId ? { idExam: examId } : {};
    return await api.getPaginated('/comments', page, limit, additionalParams);
  },

  // Tạo bình luận mới
  async create(commentData) {
    return await api.post('/comments', commentData);
  },

  // Cập nhật bình luận
  async update(id, commentData) {
    return await api.put(`/comments/${id}`, commentData);
  },

  // Xóa bình luận
  async delete(id) {
    return await api.delete(`/comments/${id}`);
  },
};
