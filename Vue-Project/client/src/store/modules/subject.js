import { subjectService } from '../../services/index.js';

const state = {
  subjects: [],
  loading: false,
  error: null,
  totalPages: 0,
};

const mutations = {
  SET_PAGES(state, totalPages) {
    state.totalPages = totalPages;
  },
  SET_SUBJECTS(state, subjects) {
    state.subjects = subjects;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_SUBJECT(state, subject) {
    state.subjects.push(subject);
  },
  UPDATE_SUBJECT(state, updatedSubject) {
    const index = state.subjects.findIndex(subject => subject.id === updatedSubject.id);
    if (index !== -1) {
      state.subjects.splice(index, 1, updatedSubject);
    }
  },
  DELETE_SUBJECT(state, subjectId) {
    state.subjects = state.subjects.filter(subject => subject.id !== subjectId);
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  async fetchSubjects({ commit }, { id, courseId } = {}) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    let result;
    if (id) {
      result = await subjectService.getById(id);
    } else if (courseId) {
      result = await subjectService.getByCourseId(courseId);
    } else {
      result = await subjectService.getAll();
    }
    
    if (result.success) {
      commit('SET_SUBJECTS', result.data);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async fetchPaginatedSubjects({ commit }, { page = 1, limit = 10, courseId = null }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await subjectService.getPaginated(page, limit, courseId);
    
    if (result.success) {
      commit('SET_SUBJECTS', result.data);
      commit('SET_PAGES', result.totalPages);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async addSubject({ commit }, subjectData) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await subjectService.create(subjectData);
    
    if (result.success) {
      commit('ADD_SUBJECT', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async updateSubject({ commit }, subject) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await subjectService.update(subject.id, subject);
    
    if (result.success) {
      commit('UPDATE_SUBJECT', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async deleteSubject({ commit }, subjectId) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await subjectService.delete(subjectId);
    
    if (result.success) {
      commit('DELETE_SUBJECT', subjectId);
      return { success: true };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },
};

const getters = {
  allSubjects: (state) => state.subjects,
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