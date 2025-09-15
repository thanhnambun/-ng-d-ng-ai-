// store/modules/modal.js
const state = {
    isOpen: false,      // Trạng thái mở hay đóng của modal
    modalType: null,    // Loại modal (ví dụ: "courseModal")
    modalData: null,    // Dữ liệu cụ thể được truyền vào modal, ví dụ cho "edit"
  };
  
  const mutations = {
    OPEN_MODAL(state, { type, data }) {
      state.isOpen = true;
      state.modalType = type;
      state.modalData = data || null;
    },
    CLOSE_MODAL(state) {
      state.isOpen = false;
      state.modalType = null;
      state.modalData = null;
    },
  };
  
  const actions = {
    openModal({ commit }, payload) {
      commit('OPEN_MODAL', payload);
    },
    closeModal({ commit }) {
      commit('CLOSE_MODAL');
    },
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
  };
  