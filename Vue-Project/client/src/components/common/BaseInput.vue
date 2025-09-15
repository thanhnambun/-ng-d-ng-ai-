<template>
  <div class="form-group">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId"
      :class="[
        'block text-sm font-medium mb-1',
        error ? 'text-red-700' : 'text-gray-700'
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Prefix icon -->
      <div 
        v-if="prefixIcon" 
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component :is="prefixIcon" class="h-5 w-5 text-gray-400" />
      </div>

      <!-- Main input -->
      <component
        :is="inputComponent"
        :id="inputId"
        v-model="inputValue"
        :type="computedType"
        :class="inputClasses"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        :rows="rows"
        :cols="cols"
        :autocomplete="autocomplete"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
        @change="handleChange"
        v-bind="$attrs"
      />

      <!-- Suffix icon -->
      <div 
        v-if="suffixIcon || (type === 'password' && showPasswordToggle)" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <!-- Password toggle -->
        <button
          v-if="type === 'password' && showPasswordToggle"
          type="button"
          @click="togglePasswordVisibility"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L15 15" />
          </svg>
        </button>
        
        <!-- Custom suffix icon -->
        <component 
          v-else-if="suffixIcon" 
          :is="suffixIcon" 
          class="h-5 w-5 text-gray-400" 
        />
      </div>
    </div>

    <!-- Help text -->
    <p v-if="helpText && !error" class="mt-1 text-sm text-gray-500">
      {{ helpText }}
    </p>

    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Character count -->
    <p 
      v-if="maxlength && showCharCount" 
      :class="[
        'mt-1 text-sm text-right',
        currentLength > maxlength ? 'text-red-600' : 'text-gray-500'
      ]"
    >
      {{ currentLength }}/{{ maxlength }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue';

// Props
const props = defineProps({
  // Value
  modelValue: {
    type: [String, Number],
    default: '',
  },
  
  // Basic properties
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search',
      'textarea', 'select', 'date', 'datetime-local', 'time', 'file'
    ].includes(value),
  },
  
  // Label and placeholder
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  
  // Validation
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  
  // Help text
  helpText: {
    type: String,
    default: '',
  },
  
  // States
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  
  // Size and appearance
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  
  // Icons
  prefixIcon: {
    type: [String, Object],
    default: null,
  },
  suffixIcon: {
    type: [String, Object],
    default: null,
  },
  
  // Input constraints
  maxlength: {
    type: Number,
    default: null,
  },
  minlength: {
    type: Number,
    default: null,
  },
  min: {
    type: [Number, String],
    default: null,
  },
  max: {
    type: [Number, String],
    default: null,
  },
  step: {
    type: [Number, String],
    default: null,
  },
  
  // Textarea specific
  rows: {
    type: Number,
    default: 4,
  },
  cols: {
    type: Number,
    default: null,
  },
  
  // Features
  showCharCount: {
    type: Boolean,
    default: false,
  },
  showPasswordToggle: {
    type: Boolean,
    default: true,
  },
  autocomplete: {
    type: String,
    default: null,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change', 'input']);

// Reactive data
const showPassword = ref(false);

// Computed
const inputId = computed(() => {
  return `input-${Math.random().toString(36).substr(2, 9)}`;
});

const inputComponent = computed(() => {
  return props.type === 'textarea' ? 'textarea' : 'input';
});

const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type === 'textarea' ? undefined : props.type;
});

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentLength = computed(() => {
  return String(props.modelValue || '').length;
});

const inputClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-md border-gray-300 shadow-sm',
    'focus:border-indigo-500 focus:ring-indigo-500',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    'transition-colors duration-200',
  ];

  // Size classes
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-3 px-4',
  };
  baseClasses.push(sizeClasses[props.size]);

  // Error state
  if (props.error) {
    baseClasses.push('border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500');
  }

  // Icon padding
  if (props.prefixIcon) {
    baseClasses.push('pl-10');
  }
  if (props.suffixIcon || (props.type === 'password' && props.showPasswordToggle)) {
    baseClasses.push('pr-10');
  }

  return baseClasses.join(' ');
});

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleFocus = (event) => {
  emit('focus', event);
};

const handleBlur = (event) => {
  emit('blur', event);
};

const handleInput = (event) => {
  emit('input', event);
};

const handleChange = (event) => {
  emit('change', event);
};

// Focus method for external use
const focus = async () => {
  await nextTick();
  document.getElementById(inputId.value)?.focus();
};

// Expose methods
defineExpose({
  focus,
});
</script>

<style scoped>
/* Custom styles if needed */
.form-group {
  @apply space-y-1;
}
</style>
