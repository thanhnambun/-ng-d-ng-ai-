import { courseService } from '../../services/index.js';

const state = {
  courses: [],
  loading: false,
  error: null,
  totalPages: 0,
};

const mutations = {
  SET_PAGES(state, totalPages) {
    state.totalPages = totalPages;
  },
  SET_COURSES(state, courses) {
    state.courses = courses;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_COURSE(state, course) {
    state.courses.push(course);
  },
  UPDATE_COURSE(state, updatedCourse) {
    const index = state.courses.findIndex(course => course.id === updatedCourse.id);
    if (index !== -1) {
      state.courses.splice(index, 1, updatedCourse);
    }
  },
  DELETE_COURSE(state, courseId) {
    state.courses = state.courses.filter(course => course.id !== courseId);
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  async fetchCourses({ commit }, { id } = {}) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = id ? await courseService.getById(id) : await courseService.getAll();
    
    if (result.success) {
      commit('SET_COURSES', result.data);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async fetchPaginatedCourses({ commit }, { page = 1, limit = 10 }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await courseService.getPaginated(page, limit);
    
    if (result.success) {
      commit('SET_COURSES', result.data);
      commit('SET_PAGES', result.totalPages);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async addCourse({ commit }, courseData) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await courseService.create(courseData);
    
    if (result.success) {
      commit('ADD_COURSE', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async updateCourse({ commit }, course) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await courseService.update(course.id, course);
    
    if (result.success) {
      commit('UPDATE_COURSE', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async deleteCourse({ commit }, courseId) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await courseService.delete(courseId);
    
    if (result.success) {
      commit('DELETE_COURSE', courseId);
      return { success: true };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },
};

const getters = {
  allCourses: (state) => state.courses,
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