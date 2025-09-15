<template>
  <BaseModal
    :show="isOpen && modalType === 'subjectModal'"
    :title="modalData ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'"
    :loading="loading"
    size="lg"
    @close="handleCloseModal"
    @confirm="handleSaveSubject"
    confirm-text="Lưu"
    cancel-text="Hủy"
  >
    <BaseForm
      v-model="subjectForm"
      :validation-schema="validationSchema"
      :loading="loading"
      :show-buttons="false"
      @submit="handleSaveSubject"
      ref="formRef"
    >
      <template #default="{ errors }">
        <!-- Subject Name -->
        <BaseInput
          v-model="subjectForm.name"
          label="Tên môn học"
          placeholder="Nhập tên môn học"
          required
          :error="errors.name"
          maxlength="100"
          show-char-count
        />

        <!-- Course (Display Only) -->
        <BaseInput
          :model-value="courseName"
          label="Khóa học"
          disabled
          readonly
        />

        <!-- Image Upload -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Ảnh môn học
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { BaseModal, BaseForm, BaseInput } from '../../common/index.js';
import { validationSchemas, fileUtils } from '../../../utils/index.js';
import Swal from 'sweetalert2';

const store = useStore();
const route = useRoute();
const formRef = ref(null);

// Route params
const courseId = computed(() => route.params.id);

// Computed properties
const isOpen = computed(() => store.state.modal.isOpen);
const modalType = computed(() => store.state.modal.modalType);
const modalData = computed(() => store.state.modal.modalData);
const courses = computed(() => store.state.course.courses);
const loading = computed(() => store.state.subject.loading);

// Form data
const subjectForm = ref({
  name: '',
  idCourse: courseId.value,
  image: null,
});

const imagePreview = ref(null);

// Computed values
const courseName = computed(() => {
  const course = courses.value.find((c) => c.id === courseId.value);
  return course ? course.name : 'Đang tải...';
});

// Validation schema
const validationSchema = computed(() => validationSchemas.subject);

// Lifecycle
onMounted(() => {
  // Fetch course data to display course name
  store.dispatch('course/fetchCourses', { id: courseId.value });
});

// Watch for modal data changes
watch(modalData, (newData) => {
  if (newData) {
    subjectForm.value = { ...newData };
    imagePreview.value = newData.image || null;
  } else {
    resetForm();
  }
});

// Methods
const resetForm = () => {
  subjectForm.value = {
    name: '',
    idCourse: courseId.value,
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
    subjectForm.value.image = base64;
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
  subjectForm.value.image = null;
  imagePreview.value = null;
};

const handleSaveSubject = async () => {
  // Validate form first
  if (!formRef.value?.validate()) {
    return;
  }

  try {
    let result;
    if (modalData.value) {
      // Update existing subject
      result = await store.dispatch('subject/updateSubject', {
        ...subjectForm.value,
        id: modalData.value.id,
      });
    } else {
      // Create new subject
      result = await store.dispatch('subject/addSubject', subjectForm.value);
    }

    if (result?.success !== false) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: modalData.value ? 'Cập nhật môn học thành công' : 'Thêm môn học thành công',
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh subject list
      store.dispatch('subject/fetchPaginatedSubjects', { 
        page: 1, 
        limit: 10, 
        courseId: courseId.value 
      });
      handleCloseModal();
    }
  } catch (error) {
    console.error('Error saving subject:', error);
    Swal.fire({
      icon: 'error',
      title: 'Có lỗi xảy ra',
      text: 'Không thể lưu môn học. Vui lòng thử lại.',
    });
  }
};

const handleCloseModal = () => {
  store.dispatch('modal/closeModal');
  resetForm();
};
</script>