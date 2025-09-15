<template>
  <BaseModal
    :show="isOpen && modalType === 'questionModal'"
    :title="modalData ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'"
    :loading="loading"
    size="xl"
    @close="handleCloseModal"
    @confirm="handleSaveQuestion"
    confirm-text="Lưu"
    cancel-text="Hủy"
  >
    <BaseForm
      v-model="questionForm"
      :validation-schema="validationSchema"
      :loading="loading"
      :show-buttons="false"
      @submit="handleSaveQuestion"
      ref="formRef"
    >
      <template #default="{ errors }">
        <!-- Question Text -->
        <BaseInput
          v-model="questionForm.text"
          type="textarea"
          label="Câu hỏi"
          placeholder="Nhập nội dung câu hỏi"
          required
          :error="errors.text"
          :rows="4"
          maxlength="1000"
          show-char-count
        />

        <!-- Exam (Display Only) -->
        <BaseInput
          :model-value="examName"
          label="Bài thi"
          disabled
          readonly
        />

        <!-- Question Sequence -->
        <BaseInput
          v-model.number="questionForm.sequence"
          type="number"
          label="Thứ tự câu hỏi"
          placeholder="Nhập thứ tự câu hỏi"
          :min="1"
          :error="errors.sequence"
        />

        <!-- Answer Options -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900">Các đáp án</h4>
          
          <div 
            v-for="(answer, index) in questionForm.answerList" 
            :key="index"
            class="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg"
          >
            <!-- Radio button for correct answer -->
            <div class="flex items-center h-10">
              <input
                :id="`answer-${index}`"
                type="radio"
                :value="index"
                v-model="selectedAnswer"
                class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
            </div>
            
            <!-- Answer input -->
            <div class="flex-1">
              <label 
                :for="`answer-input-${index}`"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Đáp án {{ String.fromCharCode(65 + index) }}
                <span v-if="selectedAnswer === index" class="text-green-600 font-semibold"> (Đúng)</span>
              </label>
              <BaseInput
                :id="`answer-input-${index}`"
                v-model="answer.answer"
                placeholder="Nhập nội dung đáp án"
                :error="answerErrors[index]"
                maxlength="200"
              />
            </div>
          </div>

          <!-- Answer validation errors -->
          <div v-if="answerValidationError" class="text-red-600 text-sm">
            {{ answerValidationError }}
          </div>
        </div>

        <!-- Instructions -->
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Hướng dẫn
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>Nhập nội dung cho tất cả 4 đáp án</li>
                  <li>Chọn radio button để đánh dấu đáp án đúng</li>
                  <li>Mỗi câu hỏi phải có đúng 1 đáp án đúng</li>
                </ul>
              </div>
            </div>
          </div>
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
import { validationSchemas, validateAnswerList, DEFAULT_VALUES } from '../../../utils/index.js';
import Swal from 'sweetalert2';

const store = useStore();
const route = useRoute();
const formRef = ref(null);

// Route params
const examId = computed(() => route.params.id);

// Computed properties
const isOpen = computed(() => store.state.modal.isOpen);
const modalType = computed(() => store.state.modal.modalType);
const modalData = computed(() => store.state.modal.modalData);
const exams = computed(() => store.state.exam.exams);
const loading = computed(() => store.state.question.loading);

// Form data
const questionForm = ref({
  text: '',
  idExam: examId.value,
  sequence: 0,
  answerList: [...DEFAULT_VALUES.QUESTION.answerList],
});

const selectedAnswer = ref(null);
const answerErrors = ref({});
const answerValidationError = ref('');

// Computed values
const examName = computed(() => {
  const exam = exams.value.find((e) => e.id === examId.value);
  return exam ? exam.name : 'Đang tải...';
});

// Validation schema
const validationSchema = computed(() => validationSchemas.question);

// Lifecycle
onMounted(() => {
  // Fetch exam data to display exam name
  if (!exams.value || exams.value.length === 0) {
    store.dispatch('exam/fetchExams', { id: examId.value });
  }
});

// Watch for modal data changes
watch([modalData, exams], ([newData, newExams]) => {
  if (newData) {
    questionForm.value = { ...newData };
    const correctAnswerIndex = questionForm.value.answerList.findIndex(answer => answer.status === 1);
    selectedAnswer.value = correctAnswerIndex !== -1 ? correctAnswerIndex : null;
  } else {
    resetForm();
    questionForm.value.idExam = examId.value;
  }
});

// Watch for selected answer changes
watch(selectedAnswer, (newIndex) => {
  if (newIndex !== null) {
    questionForm.value.answerList.forEach((answer, index) => {
      answer.status = index === newIndex ? 1 : 0;
    });
  }
});

// Methods
const resetForm = () => {
  questionForm.value = {
    text: '',
    idExam: examId.value,
    sequence: 0,
    answerList: [...DEFAULT_VALUES.QUESTION.answerList],
  };
  selectedAnswer.value = null;
  answerErrors.value = {};
  answerValidationError.value = '';
  formRef.value?.clearErrors();
};

const validateAnswers = () => {
  const validation = validateAnswerList(questionForm.value.answerList, selectedAnswer.value);
  
  answerErrors.value = {};
  answerValidationError.value = '';
  
  if (!validation.isValid) {
    if (validation.errors.answerList) {
      answerValidationError.value = validation.errors.answerList;
      // Mark empty answers with error
      questionForm.value.answerList.forEach((answer, index) => {
        if (!answer.answer || !answer.answer.trim()) {
          answerErrors.value[index] = 'Đáp án không được để trống';
        }
      });
    }
    
    if (validation.errors.correctAnswer) {
      answerValidationError.value = validation.errors.correctAnswer;
    }
  }
  
  return validation.isValid;
};

const handleSaveQuestion = async () => {
  // Validate form first
  const formValid = formRef.value?.validate();
  const answersValid = validateAnswers();
  
  if (!formValid || !answersValid) {
    return;
  }

  try {
    let result;
    if (modalData.value) {
      // Update existing question
      result = await store.dispatch('question/updateQuestion', {
        ...questionForm.value,
        id: modalData.value.id,
      });
    } else {
      // Create new question
      result = await store.dispatch('question/addQuestion', questionForm.value);
    }

    if (result?.success !== false) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: modalData.value ? 'Cập nhật câu hỏi thành công' : 'Thêm câu hỏi thành công',
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh question list
      store.dispatch('question/fetchPaginatedQuestions', { 
        page: 1, 
        limit: 10, 
        examId: examId.value 
      });
      handleCloseModal();
    }
  } catch (error) {
    console.error('Error saving question:', error);
    Swal.fire({
      icon: 'error',
      title: 'Có lỗi xảy ra',
      text: 'Không thể lưu câu hỏi. Vui lòng thử lại.',
    });
  }
};

const handleCloseModal = () => {
  store.dispatch('modal/closeModal');
  resetForm();
};
</script>