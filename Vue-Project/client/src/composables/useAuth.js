import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { STORAGE_KEYS, USER_ROLES } from '../utils/constants.js';
import Swal from 'sweetalert2';

export function useAuth() {
  const router = useRouter();
  const store = useStore();
  
  const loading = ref(false);

  // Computed properties
  const isAuthenticated = computed(() => {
    return !!localStorage.getItem(STORAGE_KEYS.LOGIN_KEY);
  });

  const currentUser = computed(() => {
    const userId = localStorage.getItem(STORAGE_KEYS.LOGIN_KEY);
    if (!userId) return null;
    
    // Get user data from store or localStorage
    return store.state.account.accounts.find(user => user.id === userId) || null;
  });

  const isAdmin = computed(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE) === USER_ROLES.ADMIN;
  });

  const userRole = computed(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  });

  // Methods
  const login = async (credentials) => {
    loading.value = true;
    
    try {
      const result = await store.dispatch('account/loginUser', credentials);
      
      if (result.success) {
        // Store user data
        localStorage.setItem(STORAGE_KEYS.LOGIN_KEY, result.user.id);
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, result.user.role);
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: `Chào mừng ${result.user.fullName}`,
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect based on role
        const redirectPath = result.user.role === USER_ROLES.ADMIN 
          ? '/admin/account' 
          : '/user/home';
        
        router.push(redirectPath);
        
        return { success: true, user: result.user };
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: result.error || 'Email hoặc mật khẩu không đúng',
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Không thể đăng nhập. Vui lòng thử lại.',
      });
      
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn đăng xuất?',
      text: 'Bạn sẽ cần phải đăng nhập lại để sử dụng các chức năng khác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      // Clear storage
      localStorage.removeItem(STORAGE_KEYS.LOGIN_KEY);
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      
      // Clear store data if needed
      // store.commit('account/CLEAR_USER_DATA');
      
      await Swal.fire({
        icon: 'success',
        title: 'Đã đăng xuất!',
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect to login
      router.push('/login');
      
      return true;
    }
    
    return false;
  };

  const register = async (userData) => {
    loading.value = true;
    
    try {
      // Check if email already exists
      const emailCheck = await store.dispatch('account/checkEmailExists', userData.email);
      
      if (emailCheck.exists) {
        await Swal.fire({
          icon: 'error',
          title: 'Email đã tồn tại',
          text: 'Email này đã được sử dụng. Vui lòng chọn email khác.',
        });
        
        return { success: false, error: 'Email đã tồn tại' };
      }

      // Create account
      const result = await store.dispatch('account/addAccount', {
        ...userData,
        role: USER_ROLES.USER, // Default role for registration
        createdAt: new Date().toISOString(),
      });
      
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Đăng ký thành công!',
          text: 'Bạn có thể đăng nhập ngay bây giờ.',
          timer: 2000,
          showConfirmButton: false,
        });

        router.push('/login');
        
        return { success: true, user: result.data };
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Đăng ký thất bại',
          text: result.error || 'Có lỗi xảy ra khi tạo tài khoản',
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Không thể tạo tài khoản. Vui lòng thử lại.',
      });
      
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (profileData) => {
    loading.value = true;
    
    try {
      const userId = localStorage.getItem(STORAGE_KEYS.LOGIN_KEY);
      if (!userId) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      const result = await store.dispatch('account/updateAccount', {
        ...profileData,
        id: userId,
      });
      
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          text: 'Thông tin cá nhân đã được cập nhật.',
          timer: 2000,
          showConfirmButton: false,
        });
        
        return { success: true, user: result.data };
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại',
          text: result.error || 'Có lỗi xảy ra khi cập nhật thông tin',
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
      });
      
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    loading.value = true;
    
    try {
      const userId = localStorage.getItem(STORAGE_KEYS.LOGIN_KEY);
      const user = currentUser.value;
      
      if (!user) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Verify old password
      if (user.password !== oldPassword) {
        await Swal.fire({
          icon: 'error',
          title: 'Mật khẩu cũ không đúng',
          text: 'Vui lòng nhập đúng mật khẩu hiện tại.',
        });
        
        return { success: false, error: 'Mật khẩu cũ không đúng' };
      }

      // Update password
      const result = await store.dispatch('account/updateAccount', {
        ...user,
        password: newPassword,
      });
      
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Đổi mật khẩu thành công!',
          text: 'Mật khẩu của bạn đã được cập nhật.',
          timer: 2000,
          showConfirmButton: false,
        });
        
        return { success: true };
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Đổi mật khẩu thất bại',
          text: result.error || 'Có lỗi xảy ra khi đổi mật khẩu',
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Change password error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Không thể đổi mật khẩu. Vui lòng thử lại.',
      });
      
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const checkPermission = (requiredRole) => {
    if (!isAuthenticated.value) return false;
    
    if (requiredRole === USER_ROLES.ADMIN) {
      return isAdmin.value;
    }
    
    return true; // Basic user permissions
  };

  return {
    // State
    loading,
    
    // Computed
    isAuthenticated,
    currentUser,
    isAdmin,
    userRole,
    
    // Methods
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    checkPermission,
  };
}
