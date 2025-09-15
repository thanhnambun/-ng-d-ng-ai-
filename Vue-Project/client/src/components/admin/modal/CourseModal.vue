<template>
  <BaseModal
    :show="isOpen && modalType === 'courseModal'"
    :title="modalData ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'"
    :loading="loading"
    size="lg"
    @close="handleCloseModal"
    @confirm="handleSaveCourse"
    confirm-text="Lưu"
    cancel-text="Hủy"
  >
    <BaseForm
      v-model="courseForm"
      :validation-schema="validationSchema"
      :loading="loading"
      :show-buttons="false"
      @submit="handleSaveCourse"
      ref="formRef"
    >
      <template #default="{ errors }">
        <!-- Course Name -->
        <BaseInput
          v-model="courseForm.name"
          label="Tên khóa học"
          placeholder="Nhập tên khóa học"
          required
          :error="errors.name"
          maxlength="100"
          show-char-count
        />

        <!-- Description -->
        <BaseInput
          v-model="courseForm.description"
          type="textarea"
          label="Mô tả"
          placeholder="Nhập mô tả cho khóa học"
          :error="errors.description"
          :rows="4"
          maxlength="500"
          show-char-count
        />

        <!-- Image Upload -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Ảnh khóa học
          </label>
          <input
            type="file"
            @change="handleImageUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            accept="image/*"
          />
          
          <!-- Image Preview -->
          <div v-if="imagePreview" class="mt-4">
            <img 
              :src="imagePreview" 
              class="w-32 h-32 object-cover mx-auto rounded-lg shadow-md" 
              alt="Preview" 
            />
            <button
              @click="removeImage"
              type="button"
              class="mt-2 text-sm text-red-600 hover:text-red-800 block mx-auto"
            >
              Xóa ảnh
            </button>
          </div>

          <!-- Upload Guidelines -->
          <p class="text-xs text-gray-500">
            Chấp nhận: JPG, PNG, GIF. Tối đa 5MB.
          </p>
        </div>
      </template>
    </BaseForm>
  </BaseModal>
</template>

<script setup>
import { useStore } from 'vuex';
import { ref, computed, watch } from 'vue';
import { BaseModal, BaseForm, BaseInput } from '../../common/index.js';
import { validationSchemas, fileUtils } from '../../../utils/index.js';
import Swal from 'sweetalert2';

const store = useStore();
const formRef = ref(null);

// Computed properties
const isOpen = computed(() => store.state.modal.isOpen);
const modalType = computed(() => store.state.modal.modalType);
const modalData = computed(() => store.state.modal.modalData);
const loading = computed(() => store.state.course.loading);

// Form data
const courseForm = ref({
  name: '',
  description: '',
  image: null,
});

const imagePreview = ref(null);

// Validation schema
const validationSchema = computed(() => validationSchemas.course);

// Watch for modal data changes
watch(modalData, (newData) => {
  if (newData) {
    courseForm.value = { ...newData };
    imagePreview.value = newData.image || null;
  } else {
    resetForm();
  }
});

// Methods
const resetForm = () => {
  courseForm.value = {
    name: '',
    description: '',
    image: null,
  };
  imagePreview.value = null;
  formRef.value?.clearErrors();
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file
  if (!fileUtils.isValidFileType(file)) {
    Swal.fire({
      icon: 'error',
      title: 'Định dạng file không hỗ trợ',
      text: 'Vui lòng chọn file ảnh (JPG, PNG, GIF, WebP)',
    });
    return;
  }

  if (!fileUtils.isValidFileSize(file)) {
    Swal.fire({
      icon: 'error', 
      title: 'File quá lớn',
      text: `Kích thước file không được vượt quá ${fileUtils.formatFileSize(5 * 1024 * 1024)}`,
    });
    return;
  }

  try {
    const base64 = await fileUtils.fileToBase64(file);
    courseForm.value.image = base64;
    imagePreview.value = base64;
  } catch (error) {
    console.error('Error uploading image:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi upload',
      text: 'Có lỗi xảy ra khi tải ảnh lên',
    });
  }
};

const removeImage = () => {
  courseForm.value.image = null;
  imagePreview.value = null;
};

const handleSaveCourse = async () => {
  // Validate form first
  if (!formRef.value?.validate()) {
    return;
  }

  try {
    let result;
    if (modalData.value) {
      // Update existing course
      result = await store.dispatch('course/updateCourse', {
        ...courseForm.value,
        id: modalData.value.id,
      });
    } else {
      // Create new course
      result = await store.dispatch('course/addCourse', courseForm.value);
    }

    if (result?.success !== false) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: modalData.value ? 'Cập nhật khóa học thành công' : 'Thêm khóa học thành công',
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh course list
      store.dispatch('course/fetchPaginatedCourses', { page: 1, limit: 10 });
      handleCloseModal();
    }
  } catch (error) {
    console.error('Error saving course:', error);
    Swal.fire({
      icon: 'error',
      title: 'Có lỗi xảy ra',
      text: 'Không thể lưu khóa học. Vui lòng thử lại.',
    });
  }
};

const handleCloseModal = () => {
  store.dispatch('modal/closeModal');
  resetForm();
};
</script>