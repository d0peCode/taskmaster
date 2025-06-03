<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative rounded-md shadow-sm">
      <input
          :id="inputId"
          :type="type"
          :value="modelValue"
          @input="onInput"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :autocomplete="autocomplete"
          :class="[
          'block w-full px-3 py-2 border rounded-md sm:text-sm',
          'focus:outline-none focus:ring-sky-500 focus:border-sky-500',
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300',
          { 'border-red-500 focus:ring-red-500 focus:border-red-500': !!errorMessage }
        ]"
      />
    </div>
    <p v-if="errorMessage" class="mt-1 text-xs text-red-600" :id="`${inputId}-error`">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';

type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url' | 'search';

interface Props {
  modelValue: string | number | null | undefined;
  label?: string;
  type?: InputType;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string | null;
  autocomplete?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  label: '',
  placeholder: '',
  disabled: false,
  required: false,
  errorMessage: null,
  autocomplete: 'off',
  id: undefined, // Will be auto-generated if not provided
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null | undefined): void;
}>();

const instance = getCurrentInstance();
const inputId = computed(() => props.id || `base-input-${instance?.uid}`);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>