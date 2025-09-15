import { questionService } from '../../services/index.js';

const state = {
  questions: [],
  loading: false,
  error: null,
  totalPages: 0,
};

const mutations = {
  SET_PAGES(state, totalPages) {
    state.totalPages = totalPages;
  },
  SET_QUESTIONS(state, questions) {
    state.questions = questions;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_QUESTION(state, question) {
    state.questions.push(question);
  },
  UPDATE_QUESTION(state, updatedQuestion) {
    const index = state.questions.findIndex(question => question.id === updatedQuestion.id);
    if (index !== -1) {
      state.questions.splice(index, 1, updatedQuestion);
    }
  },
  DELETE_QUESTION(state, questionId) {
    state.questions = state.questions.filter(question => question.id !== questionId);
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  async fetchQuestions({ commit }, { examId } = {}) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = examId 
      ? await questionService.getByExamId(examId)
      : await questionService.getAll();
    
    if (result.success) {
      commit('SET_QUESTIONS', result.data);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async fetchPaginatedQuestions({ commit }, { page = 1, limit = 10, examId = null }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await questionService.getPaginated(page, limit, examId);
    
    if (result.success) {
      commit('SET_QUESTIONS', result.data);
      commit('SET_PAGES', result.totalPages);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async addQuestion({ commit }, questionData) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await questionService.create(questionData);
    
    if (result.success) {
      commit('ADD_QUESTION', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async updateQuestion({ commit }, question) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await questionService.update(question.id, question);
    
    if (result.success) {
      commit('UPDATE_QUESTION', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async deleteQuestion({ commit }, questionId) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await questionService.delete(questionId);
    
    if (result.success) {
      commit('DELETE_QUESTION', questionId);
      return { success: true };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },
};

const getters = {
  allQuestions: (state) => state.questions,
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