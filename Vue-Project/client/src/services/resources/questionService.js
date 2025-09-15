import { api } from '../api.js';

export const questionService = {
  // Lấy tất cả câu hỏi
  async getAll() {
    return await api.get('/questions');
  },

  // Lấy câu hỏi theo exam ID
  async getByExamId(examId) {
    return await api.get('/questions', { idExam: examId });
  },

  // Lấy câu hỏi theo ID
  async getById(id) {
    return await api.get(`/questions/${id}`);
  },

  // Lấy câu hỏi với pagination
  async getPaginated(page = 1, limit = 10, examId = null) {
    const additionalParams = examId ? { idExam: examId } : {};
    return await api.getPaginated('/questions', page, limit, additionalParams);
  },

  // Tạo câu hỏi mới
  async create(questionData) {
    return await api.post('/questions', questionData);
  },

  // Cập nhật câu hỏi
  async update(id, questionData) {
    return await api.put(`/questions/${id}`, questionData);
  },

  // Xóa câu hỏi
  async delete(id) {
    return await api.delete(`/questions/${id}`);
  },
};
