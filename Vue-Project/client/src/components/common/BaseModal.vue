<template>
  <div 
    v-if="show"
    class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
    @click.self="handleOverlayClick"
  >
    <div 
      :class="[
        'bg-white rounded-lg shadow-xl transform transition-all',
        'w-full max-w-md mx-auto',
        sizeClasses
      ]"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ title }}
        </h3>
        <button
          v-if="closable"
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="showFooter" class="flex justify-end space-x-3 p-6 bg-gray-50 border-t border-gray-200">
        <slot name="footer">
          <button
            v-if="showCancelButton"
            @click="handleCancel"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancelText }}
          </button>
          <button
            v-if="showConfirmButton"
            @click="handleConfirm"
            :disabled="loading || confirmDisabled"
            :class="[
              'px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
              confirmButtonClass
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
            {{ loading ? loadingText : confirmText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  // Visibility
  show: {
    type: Boolean,
    default: false,
  },
  
  // Modal content
  title: {
    type: String,
    default: 'Modal Title',
  },
  
  // Size options
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(value),
  },
  
  // Behavior
  closable: {
    type: Boolean,
    default: true,
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  
  // Footer
  showFooter: {
    type: Boolean,
    default: true,
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  showConfirmButton: {
    type: Boolean,
    default: true,
  },
  
  // Button texts
  cancelText: {
    type: String,
    default: 'Hủy',
  },
  confirmText: {
    type: String,
    default: 'Xác nhận',
  },
  loadingText: {
    type: String,
    default: 'Đang xử lý...',
  },
  
  // Button styles
  confirmButtonClass: {
    type: String,
    default: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  },
  
  // States
  loading: {
    type: Boolean,
    default: false,
  },
  confirmDisabled: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['close', 'cancel', 'confirm']);

// Computed
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };
  return sizes[props.size] || sizes.md;
});

// Methods
const handleClose = () => {
  if (!props.loading) {
    emit('close');
  }
};

const handleCancel = () => {
  if (!props.loading) {
    emit('cancel');
  }
};

const handleConfirm = () => {
  if (!props.loading && !props.confirmDisabled) {
    emit('confirm');
  }
};

const handleOverlayClick = () => {
  if (props.closeOnOverlay && props.closable) {
    handleClose();
  }
};
</script>

<style scoped>
/* Custom animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
