<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
        
        <!-- Search Box -->
        <div class="flex items-center max-w-md">
          <div class="relative flex-1">
            <SearchOutlined class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            @click="openCreateModal"
            class="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            Thêm mới
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">Tổng tài khoản</p>
              <p class="text-2xl font-bold">{{ totalAccounts }}</p>
            </div>
            <i class="fas fa-users text-2xl text-blue-200"></i>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">Đang hoạt động</p>
              <p class="text-2xl font-bold">{{ activeAccounts }}</p>
            </div>
            <i class="fas fa-check-circle text-2xl text-green-200"></i>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm">Bị khóa</p>
              <p class="text-2xl font-bold">{{ blockedAccounts }}</p>
            </div>
            <i class="fas fa-ban text-2xl text-red-200"></i>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm">Quản trị viên</p>
              <p class="text-2xl font-bold">{{ adminAccounts }}</p>
            </div>
            <i class="fas fa-crown text-2xl text-purple-200"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Table Controls -->
      <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <select 
            v-model="itemsPerPage" 
            @change="handlePageSizeChange"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option :value="5">5 / trang</option>
            <option :value="10">10 / trang</option>
            <option :value="20">20 / trang</option>
            <option :value="50">50 / trang</option>
          </select>
          
          <select 
            v-model="statusFilter"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="blocked">Bị khóa</option>
          </select>
          
          <select 
            v-model="roleFilter"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="user">Người dùng</option>
          </select>
        </div>
        
        <div class="text-sm text-gray-700">
          Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - 
          {{ Math.min(currentPage * itemsPerPage, totalAccounts) }} 
          trong tổng số {{ totalAccounts }} tài khoản
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span class="ml-2 text-gray-600">Đang tải...</span>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                v-for="column in tableColumns" 
                :key="column.key"
                @click="toggleSort(column.key)"
                :class="[
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                ]"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ column.label }}</span>
                  <div v-if="column.sortable" class="flex flex-col">
                    <CaretUpOutlined 
                      :class="[
                        'h-3 w-3 text-gray-400',
                        sortField === column.key && sortDirection === 'asc' ? 'text-indigo-600' : ''
                      ]" 
                    />
                    <CaretDownOutlined 
                      :class="[
                        'h-3 w-3 text-gray-400 -mt-1',
                        sortField === column.key && sortDirection === 'desc' ? 'text-indigo-600' : ''
                      ]" 
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="account in paginatedAccounts" 
              :key="account.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ account.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img 
                      :src="account.avatar || defaultAvatar" 
                      :alt="account.name"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ account.name }}</div>
                    <div class="text-sm text-gray-500">{{ account.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ account.phone || 'Chưa cập nhật' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusBadgeClass(account.status)
                  ]"
                >
                  {{ getStatusText(account.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getRoleBadgeClass(account.role)
                  ]"
                >
                  {{ getRoleText(account.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(account.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="openEditModal(account)"
                    class="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="toggleAccountStatus(account)"
                    :class="[
                      'p-1 rounded transition-colors',
                      account.status 
                        ? 'text-red-600 hover:text-red-900' 
                        : 'text-green-600 hover:text-green-900'
                    ]"
                    :title="account.status ? 'Khóa tài khoản' : 'Mở khóa tài khoản'"
                  >
                    <i :class="account.status ? 'fas fa-ban' : 'fas fa-check'"></i>
                  </button>
                  <button
                    @click="toggleAccountRole(account)"
                    :class="[
                      'p-1 rounded transition-colors',
                      account.role 
                        ? 'text-yellow-600 hover:text-yellow-900' 
                        : 'text-purple-600 hover:text-purple-900'
                    ]"
                    :title="account.role ? 'Hạ quyền về User' : 'Nâng quyền lên Admin'"
                  >
                    <i :class="account.role ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
                  </button>
                  <button
                    @click="deleteAccount(account)"
                    class="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                    title="Xóa tài khoản"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="paginatedAccounts.length === 0" class="text-center py-12">
          <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tài khoản</h3>
          <p class="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <p class="text-sm text-gray-700">
              Hiển thị <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              đến <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalAccounts) }}</span>
              trong tổng số <span class="font-medium">{{ totalAccounts }}</span> kết quả
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page === '...'"
                disabled
                class="px-3 py-2 text-sm font-medium text-gray-500"
              >
                ...
              </button>
              <button
                v-else
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 rounded-md text-sm font-medium',
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </template>
            
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              ]"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Modal -->
    <BaseModal
      :show="showModal"
      :title="modalData ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'"
      :loading="saving"
      size="lg"
      @close="closeModal"
      @confirm="saveAccount"
      confirm-text="Lưu"
      cancel-text="Hủy"
    >
      <BaseForm
        v-model="accountForm"
        :validation-schema="accountValidationSchema"
        :loading="saving"
        :show-buttons="false"
        @submit="saveAccount"
        ref="formRef"
      >
        <template #default="{ errors }">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Basic Information -->
            <div class="md:col-span-2">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
            </div>
            
            <BaseInput
              v-model="accountForm.name"
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập"
              required
              :error="errors.name"
            />

            <BaseInput
              v-model="accountForm.email"
              type="email"
              label="Email"
              placeholder="Nhập địa chỉ email"
              required
              :error="errors.email"
            />

            <BaseInput
              v-model="accountForm.phone"
              type="tel"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              :error="errors.phone"
            />

            <BaseInput
              v-model="accountForm.address"
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              :error="errors.address"
            />

            <!-- Password (only for new accounts) -->
            <div v-if="!modalData" class="md:col-span-2">
              <BaseInput
                v-model="accountForm.password"
                type="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                required
                :error="errors.password"
                show-password-toggle
              />
            </div>

            <!-- Account Settings -->
            <div class="md:col-span-2 mt-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Cài đặt tài khoản</h3>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                v-model="accountForm.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option :value="true">Hoạt động</option>
                <option :value="false">Bị khóa</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <select
                v-model="accountForm.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option :value="false">Người dùng</option>
                <option :value="true">Quản trị viên</option>
              </select>
            </div>
          </div>
        </template>
      </BaseForm>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import { BaseModal, BaseForm, BaseInput } from '@/components/common'
import { validationSchemas, stringUtils, arrayUtils } from '@/utils'
import Swal from 'sweetalert2'

// Store
const store = useStore()

// Reactive data
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortField = ref('id')
const sortDirection = ref('asc')
const statusFilter = ref('')
const roleFilter = ref('')
const showModal = ref(false)
const modalData = ref(null)
const formRef = ref(null)
const saving = ref(false)

// Default avatar
const defaultAvatar = 'https://via.placeholder.com/40x40?text=U'

// Account form
const accountForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  status: true,
  role: false,
})

// Table columns configuration
const tableColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Thông tin', sortable: true },
  { key: 'phone', label: 'Số điện thoại', sortable: true },
  { key: 'status', label: 'Trạng thái', sortable: true },
  { key: 'role', label: 'Vai trò', sortable: true },
  { key: 'created_at', label: 'Ngày tạo', sortable: true },
  { key: 'actions', label: 'Thao tác', sortable: false },
]

// Computed properties
const accounts = computed(() => store.state.account.accounts || [])
const loading = computed(() => store.state.account.loading)
const totalPages = computed(() => store.state.account.totalPages || 1)

const totalAccounts = computed(() => accounts.value.length)
const activeAccounts = computed(() => accounts.value.filter(acc => acc.status).length)
const blockedAccounts = computed(() => accounts.value.filter(acc => !acc.status).length)
const adminAccounts = computed(() => accounts.value.filter(acc => acc.role).length)

// Validation schema
const accountValidationSchema = computed(() => {
  const schema = { ...validationSchemas.register }
  if (modalData.value) {
    // Remove password requirement for editing
    delete schema.password
    delete schema.confirmPassword
  }
  return schema
})

// Filtered and sorted accounts
const filteredAccounts = computed(() => {
  let filtered = [...accounts.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(account => 
      account.name?.toLowerCase().includes(query) ||
      account.email?.toLowerCase().includes(query) ||
      account.phone?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(account => {
      if (statusFilter.value === 'active') return account.status
      if (statusFilter.value === 'blocked') return !account.status
      return true
    })
  }

  // Role filter
  if (roleFilter.value) {
    filtered = filtered.filter(account => {
      if (roleFilter.value === 'admin') return account.role
      if (roleFilter.value === 'user') return !account.role
      return true
    })
  }

  // Sort
  if (sortField.value) {
    filtered = arrayUtils.sortBy(filtered, [sortField.value])
    if (sortDirection.value === 'desc') {
      filtered.reverse()
    }
  }

  return filtered
})

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAccounts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = Math.ceil(filteredAccounts.value.length / itemsPerPage.value)
  const current = currentPage.value
  const delta = 2

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i)
    } else if (i === current - delta - 1 || i === current + delta + 1) {
      pages.push('...')
    }
  }

  return pages
})

// Methods
const fetchAccounts = async () => {
  await store.dispatch('account/fetchPaginatedAccounts', {
    page: currentPage.value,
    limit: itemsPerPage.value,
  })
}

const toggleSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1
  fetchAccounts()
}

const applyFilters = () => {
  currentPage.value = 1
}

const openCreateModal = () => {
  modalData.value = null
  accountForm.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    status: true,
    role: false,
  }
  showModal.value = true
}

const openEditModal = (account) => {
  modalData.value = account
  accountForm.value = { ...account }
  delete accountForm.value.password // Don't include password in edit
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalData.value = null
  formRef.value?.clearErrors()
}

const saveAccount = async () => {
  if (!formRef.value?.validate()) {
    return
  }

  saving.value = true
  
  try {
    let result
    if (modalData.value) {
      // Update existing account
      result = await store.dispatch('account/updateAccount', {
        ...accountForm.value,
        id: modalData.value.id,
      })
    } else {
      // Create new account
      result = await store.dispatch('account/addAccount', accountForm.value)
    }

    if (result?.success !== false) {
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: modalData.value ? 'Cập nhật tài khoản thành công' : 'Thêm tài khoản thành công',
        timer: 2000,
        showConfirmButton: false,
      })
      
      closeModal()
      fetchAccounts()
    }
  } catch (error) {
    console.error('Error saving account:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Có lỗi xảy ra',
      text: 'Không thể lưu tài khoản. Vui lòng thử lại.',
    })
  } finally {
    saving.value = false
  }
}

const toggleAccountStatus = async (account) => {
  const action = account.status ? 'khóa' : 'mở khóa'
  
  const result = await Swal.fire({
    title: `Xác nhận ${action} tài khoản?`,
    text: `Bạn có chắc muốn ${action} tài khoản "${account.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `${stringUtils.capitalize(action)}`,
    cancelButtonText: 'Hủy',
    confirmButtonColor: account.status ? '#dc2626' : '#16a34a',
  })

  if (result.isConfirmed) {
    try {
      await store.dispatch('account/updateAccount', {
        ...account,
        status: !account.status,
      })
      
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Đã ${action} tài khoản thành công`,
        timer: 2000,
        showConfirmButton: false,
      })
      
      fetchAccounts()
    } catch (error) {
      console.error('Error toggling account status:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: `Không thể ${action} tài khoản. Vui lòng thử lại.`,
      })
    }
  }
}

const toggleAccountRole = async (account) => {
  const action = account.role ? 'hạ quyền về User' : 'nâng quyền lên Admin'
  
  const result = await Swal.fire({
    title: `Xác nhận thay đổi quyền?`,
    text: `Bạn có chắc muốn ${action} cho tài khoản "${account.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#8b5cf6',
  })

  if (result.isConfirmed) {
    try {
      await store.dispatch('account/updateAccount', {
        ...account,
        role: !account.role,
      })
      
      await Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Đã ${action} thành công`,
        timer: 2000,
        showConfirmButton: false,
      })
      
      fetchAccounts()
    } catch (error) {
      console.error('Error toggling account role:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Không thể thay đổi quyền. Vui lòng thử lại.',
      })
    }
  }
}

const deleteAccount = async (account) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa tài khoản?',
    text: `Bạn có chắc muốn xóa tài khoản "${account.name}"? Hành động này không thể hoàn tác.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#dc2626',
  })

  if (result.isConfirmed) {
    try {
      await store.dispatch('account/deleteAccount', account.id)
      
      await Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Tài khoản đã được xóa thành công',
        timer: 2000,
        showConfirmButton: false,
      })
      
      fetchAccounts()
    } catch (error) {
      console.error('Error deleting account:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Không thể xóa tài khoản. Vui lòng thử lại.',
      })
    }
  }
}

// Helper methods
const getStatusBadgeClass = (status) => {
  return status
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}

const getStatusText = (status) => {
  return status ? 'Hoạt động' : 'Bị khóa'
}

const getRoleBadgeClass = (role) => {
  return role
    ? 'bg-purple-100 text-purple-800'
    : 'bg-gray-100 text-gray-800'
}

const getRoleText = (role) => {
  return role ? 'Quản trị viên' : 'Người dùng'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

// Watchers
watch([searchQuery, statusFilter, roleFilter], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  fetchAccounts()
})
</script>