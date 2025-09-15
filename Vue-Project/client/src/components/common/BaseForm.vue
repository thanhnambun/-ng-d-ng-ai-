<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <slot :errors="errors" :isValid="isValid" />
    
    <!-- Error Summary -->
    <div v-if="showErrorSummary && hasErrors" class="bg-red-50 border border-red-200 rounded-md p-3">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            Vui lòng kiểm tra lại thông tin:
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(error, field) in errors" :key="field" v-show="error">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit buttons -->
    <div v-if="showButtons" class="flex justify-end space-x-3 pt-4">
      <button
        v-if="showCancelButton"
        type="button"
        @click="handleCancel"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ cancelText }}
      </button>
      
      <button
        type="submit"
        :disabled="loading || (!allowInvalidSubmit && !isValid)"
        :class="[
          'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          submitButtonClass
        ]"
      >
        <svg 
          v-if="loading" 
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ loading ? loadingText : submitText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { FormValidator } from '../../utils/validation.js';

// Props
const props = defineProps({
  // Form data
  modelValue: {
    type: Object,
    required: true,
  },
  
  // Validation
  validationSchema: {
    type: Object,
    default: () => ({}),
  },
  
  // Button configuration
  showButtons: {
    type: Boolean,
    default: true,
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  
  // Button texts
  submitText: {
    type: String,
    default: 'Lưu',
  },
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  loadingText: {
    type: String,
    default: 'Đang xử lý...',
  },
  
  // Button styles
  submitButtonClass: {
    type: String,
    default: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  },
  
  // Behavior
  validateOnChange: {
    type: Boolean,
    default: true,
  },
  showErrorSummary: {
    type: Boolean,
    default: false,
  },
  allowInvalidSubmit: {
    type: Boolean,
    default: false,
  },
  
  // States
  loading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'validate']);

// Reactive data
const validator = new FormValidator();
const errors = reactive({});

// Computed
const isValid = computed(() => {
  return !validator.hasErrors();
});

const hasErrors = computed(() => {
  return Object.values(errors).some(error => error !== null && error !== undefined);
});

// Methods
const validateForm = () => {
  const isFormValid = validator.validateForm(props.modelValue, props.validationSchema);
  
  // Copy errors to reactive object
  Object.keys(errors).forEach(key => {
    delete errors[key];
  });
  Object.assign(errors, validator.getAllErrors());
  
  emit('validate', { isValid: isFormValid, errors: { ...errors } });
  
  return isFormValid;
};

const validateField = (fieldName) => {
  if (props.validationSchema[fieldName]) {
    const rules = props.validationSchema[fieldName];
    const fieldValue = props.modelValue[fieldName];
    
    validator.validateField(fieldName, fieldValue, rules);
    errors[fieldName] = validator.getFieldError(fieldName);
  }
};

const handleSubmit = () => {
  const isFormValid = validateForm();
  
  if (isFormValid || props.allowInvalidSubmit) {
    emit('submit', { 
      data: props.modelValue, 
      isValid: isFormValid 
    });
  }
};

const handleCancel = () => {
  emit('cancel');
};

// Watch for form changes
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (props.validateOnChange && oldValue) {
      // Validate only changed fields
      Object.keys(newValue).forEach(key => {
        if (newValue[key] !== oldValue[key]) {
          validateField(key);
        }
      });
    }
  },
  { deep: true }
);

// Expose methods for parent components
defineExpose({
  validate: validateForm,
  validateField,
  clearErrors: () => {
    validator.clearErrors();
    Object.keys(errors).forEach(key => {
      delete errors[key];
    });
  },
  clearFieldError: (fieldName) => {
    validator.clearFieldError(fieldName);
    delete errors[fieldName];
  },
  isValid,
  errors,
});
</script>
