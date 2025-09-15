import { accountService } from '../../services/index.js';

const state = {
  accounts: [], 
  loading: false,
  error: null,
  totalPages: 0,
};

const mutations = {
  SET_PAGES(state, totalPages) {
    state.totalPages = totalPages;
  },
  SET_ACCOUNTS(state, accounts) {
    state.accounts = accounts;
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  ADD_ACCOUNT(state, account) {
    state.accounts.push(account);
  },
  UPDATE_ACCOUNT(state, updatedAccount) {
    const index = state.accounts.findIndex(account => account.id === updatedAccount.id);
    if (index !== -1) {
      state.accounts.splice(index, 1, updatedAccount);
    }
  },
  DELETE_ACCOUNT(state, accountId) {
    state.accounts = state.accounts.filter(account => account.id !== accountId);
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  async fetchAccounts({ commit }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await accountService.getAll();
    
    if (result.success) {
      commit('SET_ACCOUNTS', result.data);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async fetchPaginatedAccounts({ commit }, { page = 1, limit = 10 }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await accountService.getPaginated(page, limit);
    
    if (result.success) {
      commit('SET_ACCOUNTS', result.data);
      commit('SET_PAGES', result.totalPages);
    } else {
      commit('SET_ERROR', result.error);
    }
    
    commit('SET_LOADING', false);
  },

  async addAccount({ commit }, accountData) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await accountService.create(accountData);
    
    if (result.success) {
      commit('ADD_ACCOUNT', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async updateAccount({ commit }, account) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await accountService.update(account.id, account);
    
    if (result.success) {
      commit('UPDATE_ACCOUNT', result.data);
      return { success: true, data: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async deleteAccount({ commit }, accountId) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await accountService.delete(accountId);
    
    if (result.success) {
      commit('DELETE_ACCOUNT', accountId);
      return { success: true };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
    
    commit('SET_LOADING', false);
  },

  async loginUser({ commit }, credentials) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    const result = await accountService.login(credentials);
    
    commit('SET_LOADING', false);
    
    if (result.success) {
      return { success: true, user: result.data };
    } else {
      commit('SET_ERROR', result.error);
      return { success: false, error: result.error };
    }
  },
};

const getters = {
  allAccounts: (state) => state.accounts,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error,
  totalPages: (state) => state.totalPages,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
