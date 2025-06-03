<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative rounded-md shadow-sm">
      <select
          :id="selectId"
          :value="modelValue"
          @change="onChange"
          :disabled="disabled"
          :required="required"
          :class="[
          'block w-full pl-3 pr-10 py-2 border rounded-md sm:text-sm',
          'focus:outline-none focus:ring-sky-500 focus:border-sky-500',
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300',
          { 'border-red-500 focus:ring-red-500 focus:border-red-500': !!errorMessage }
        ]"
      >
        <option v-if="placeholder" value="" disabled :selected="!modelValue">{{ placeholder }}</option>
        <option
            v-for="option in options"
            :key="option[optionValueKey]"
            :value="option[optionValueKey]"
            :disabled="option.disabled"
        >
          {{ option[optionTextKey] }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </div>
    </div>
    <p v-if="errorMessage" class="mt-1 text-xs text-red-600" :id="`${selectId}-error`">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, withDefaults, getCurrentInstance } from 'vue';

export interface SelectOption {
  [key: string]: any;
  disabled?: boolean;
}

interface Props {
  modelValue: string | number | null | undefined;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string | null;
  id?: string;
  optionValueKey?: string;
  optionTextKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  disabled: false,
  required: false,
  errorMessage: null,
  id: undefined,
  optionValueKey: 'value',
  optionTextKey: 'text',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null | undefined): void;
}>();

const instance = getCurrentInstance();
const selectId = computed(() => props.id || `base-select-${instance?.uid}`);

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
}
</style>