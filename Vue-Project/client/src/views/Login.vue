<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
          <i class="fas fa-graduation-cap text-white text-2xl"></i>
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900">
          Đăng nhập vào hệ thống
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Hoặc 
          <router-link 
            to="/register" 
            class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            tạo tài khoản mới
          </router-link>
        </p>
      </div>

      <!-- Social Login Buttons -->
      <div class="space-y-3">
        <button
          type="button"
          class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng nhập với Google
        </button>

        <button
          type="button" 
          class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg class="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Đăng nhập với Facebook
        </button>
      </div>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng email</span>
        </div>
      </div>

      <!-- Login Form -->
      <BaseForm
        v-model="loginForm"
        :validation-schema="loginValidationSchema"
        :loading="loading"
        :show-buttons="false"
        @submit="handleLogin"
        ref="formRef"
        class="space-y-6"
      >
        <template #default="{ errors }">
          <div class="space-y-4">
            <BaseInput
              v-model="loginForm.email"
              type="email"
              label="Địa chỉ email"
              placeholder="Nhập địa chỉ email của bạn"
              required
              :error="errors.email"
              autocomplete="email"
            >
              <template #prefix-icon>
                <i class="fas fa-envelope text-gray-400"></i>
              </template>
            </BaseInput>

            <BaseInput
              v-model="loginForm.password"
              type="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              required
              :error="errors.password"
              autocomplete="current-password"
              show-password-toggle
            >
              <template #prefix-icon>
                <i class="fas fa-lock text-gray-400"></i>
              </template>
            </BaseInput>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            :class="[
              'group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200',
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
            ]"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            </span>
            
            <span v-if="!loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-sign-in-alt group-hover:translate-x-1 transition-transform"></i>
            </span>
            
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </template>
      </BaseForm>

      <!-- Sign up link -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Chưa có tài khoản?
          <router-link 
            to="/register" 
            class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Đăng ký ngay
          </router-link>
        </p>
      </div>

      <!-- Demo accounts -->
      <div class="bg-gray-50 rounded-lg p-4 mt-6">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Tài khoản demo:</h3>
        <div class="space-y-2 text-xs text-gray-600">
          <div class="flex justify-between">
            <span>👤 Admin:</span>
            <button 
              @click="fillDemoAccount('admin')"
              class="text-indigo-600 hover:text-indigo-500 underline"
            >
              admin@demo.com / admin123
            </button>
          </div>
          <div class="flex justify-between">
            <span>👨‍🎓 User:</span>
            <button 
              @click="fillDemoAccount('user')"
              class="text-indigo-600 hover:text-indigo-500 underline"
            >
              user@demo.com / user123
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Background decoration -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute -top-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full opacity-50 animate-pulse"></div>
      <div class="absolute top-1/4 -right-10 w-32 h-32 bg-cyan-100 rounded-full opacity-50 animate-pulse delay-1000"></div>
      <div class="absolute -bottom-10 left-1/4 w-48 h-48 bg-purple-100 rounded-full opacity-50 animate-pulse delay-2000"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { BaseForm, BaseInput } from '@/components/common'
import { useAuth } from '@/composables'
import { validationSchemas } from '@/utils'

// Composables
const router = useRouter()
const { login, loading } = useAuth()

// Reactive data
const formRef = ref(null)
const rememberMe = ref(false)

const loginForm = ref({
  email: '',
  password: '',
})

// Validation schema
const loginValidationSchema = computed(() => validationSchemas.login)

// Demo accounts
const demoAccounts = {
  admin: {
    email: 'admin@demo.com',
    password: 'admin123'
  },
  user: {
    email: 'user@demo.com', 
    password: 'user123'
  }
}

// Methods
const handleLogin = async () => {
  if (!formRef.value?.validate()) {
    return
  }

  try {
    const result = await login(loginForm.value)
    
    if (result.success) {
      // Handle remember me
      if (rememberMe.value) {
        localStorage.setItem('rememberLogin', 'true')
      }
      
      // Navigation is handled in useAuth composable
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}

const fillDemoAccount = (type) => {
  const account = demoAccounts[type]
  if (account) {
    loginForm.value.email = account.email
    loginForm.value.password = account.password
  }
}

// Auto-fill from remember me
const checkRememberMe = () => {
  const remembered = localStorage.getItem('rememberLogin')
  if (remembered) {
    rememberMe.value = true
    // You could also restore email from localStorage here
  }
}

// Lifecycle
checkRememberMe()
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Gradient background enhancement */
.bg-gradient-to-br {
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Button hover effects */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Social button icons */
.social-icon {
  transition: transform 0.2s ease;
}

.social-icon:hover {
  transform: scale(1.05);
}
</style>