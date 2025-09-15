import { examService } from '../../services/index.js';

const state = {
  exams: [],
  loading: false,
  error: null,
  totalPages: 0,
};

const mutations = {
  SET_PAGES(state, totalPages) {
    state.totalPages = totalPages;
  },
  SET_EXAMS(state, exams) {
    state.exams = exams;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_EXAM(state, exam) {
    state.exams.push(exam);
  },
  UPDATE_EXAM(state, updatedExam) {
    const index = state.exams.findIndex(exam => exam.id === updatedExam.id);
    if (index !== -1) {
      state.exams.splice(index, 1, updatedExam);
    }
  },
  DELETE_EXAM(state, examId) {
    state.exams = state.exams.filter(exam => exam.id !== examId);
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  async fetchExams({ commit }, { id, subjectId } = {}) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    let result;
    if (id) {
      result = await examService.getById(id);
    } else if (subjectId) {
      result = await examService.getBySubjectId(subjectId);
    } else {
      result = await examService.getAll();
    }
    
    if (result.success) {
      commit('SET_EXAMS', result.data);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async fetchPaginatedExams({ commit }, { page = 1, limit = 10, subjectId = null }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await examService.getPaginated(page, limit, subjectId);
    
    if (result.success) {
      commit('SET_EXAMS', result.data);
      commit('SET_PAGES', result.totalPages);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async addExam({ commit }, examData) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await examService.create(examData);
    
    if (result.success) {
      commit('ADD_EXAM', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async updateExam({ commit }, exam) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await examService.update(exam.id, exam);
    
    if (result.success) {
      commit('UPDATE_EXAM', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async deleteExam({ commit }, examId) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await examService.delete(examId);
    
    if (result.success) {
      commit('DELETE_EXAM', examId);
      return { success: true };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },
};

const getters = {
  allExams: (state) => state.exams,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error,
  totalPages: (state) => state.totalPages,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};