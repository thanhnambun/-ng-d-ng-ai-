import { commentService } from '../../services/index.js';

const state = {
  comments: [],
  loading: false,
  error: null,
  totalPages: 0,
};

const mutations = {
  SET_PAGES(state, totalPages) {
    state.totalPages = totalPages;
  },
  SET_COMMENTS(state, comments) {
    state.comments = comments;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_COMMENT(state, comment) {
    state.comments.push(comment);
  },
  UPDATE_COMMENT(state, updatedComment) {
    const index = state.comments.findIndex(comment => comment.id === updatedComment.id);
    if (index !== -1) {
      state.comments.splice(index, 1, updatedComment);
    }
  },
  DELETE_COMMENT(state, commentId) {
    state.comments = state.comments.filter(comment => comment.id !== commentId);
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  async fetchComments({ commit }, { examId } = {}) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = examId 
      ? await commentService.getByExamId(examId)
      : await commentService.getAll();
    
    if (result.success) {
      commit('SET_COMMENTS', result.data);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async fetchPaginatedComments({ commit }, { page = 1, limit = 10, examId = null }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await commentService.getPaginated(page, limit, examId);
    
    if (result.success) {
      commit('SET_COMMENTS', result.data);
      commit('SET_PAGES', result.totalPages);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async addComment({ commit }, commentData) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await commentService.create(commentData);
    
    if (result.success) {
      commit('ADD_COMMENT', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async updateComment({ commit }, comment) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await commentService.update(comment.id, comment);
    
    if (result.success) {
      commit('UPDATE_COMMENT', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async deleteComment({ commit }, commentId) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await commentService.delete(commentId);
    
    if (result.success) {
      commit('DELETE_COMMENT', commentId);
      return { success: true };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },
};

const getters = {
  allComments: (state) => state.comments,
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