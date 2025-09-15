import { api } from '../api.js';

export const accountService = {
  // Lấy tất cả tài khoản
  async getAll() {
    return await api.get('/accounts');
  },

  // Lấy tài khoản với pagination
  async getPaginated(page = 1, limit = 10) {
    return await api.getPaginated('/accounts', page, limit);
  },

  // Lấy tài khoản theo ID
  async getById(id) {
    return await api.get(`/accounts/${id}`);
  },

  // Tạo tài khoản mới
  async create(accountData) {
    return await api.post('/accounts', accountData);
  },

  // Cập nhật tài khoản
  async update(id, accountData) {
    return await api.put(`/accounts/${id}`, accountData);
  },

  // Xóa tài khoản
  async delete(id) {
    return await api.delete(`/accounts/${id}`);
  },

  // Đăng nhập
  async login(credentials) {
    const result = await this.getAll();
    if (result.success) {
      const user = result.data.find(
        account => 
          account.email === credentials.email && 
          account.password === credentials.password
      );
      
      if (user) {
        return {
          success: true,
          data: user,
        };
      } else {
        return {
          success: false,
          error: 'Email hoặc mật khẩu không đúng',
        };
      }
    }
    return result;
  },

  // Kiểm tra email đã tồn tại
  async checkEmailExists(email) {
    const result = await this.getAll();
    if (result.success) {
      const exists = result.data.some(account => account.email === email);
      return {
        success: true,
        exists,
      };
    }
    return result;
  },
};
