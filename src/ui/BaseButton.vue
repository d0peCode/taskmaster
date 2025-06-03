<script setup lang="ts">
import { computed, defineProps, defineEmits, withDefaults } from 'vue';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'info';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  pill?: boolean;
  outline?: boolean;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  isLoading: false,
  pill: false,
  outline: false,
  block: false,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const onClick = (event: MouseEvent) => {
  if (!props.disabled && !props.isLoading) {
    emit('click', event);
  }
};

const baseClasses = 'border focus:ring-2 focus:ring-opacity-50';

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'px-2.5 py-1.5 text-xs';
    case 'sm':
      return 'px-3 py-2 text-sm leading-4';
    case 'lg':
      return 'px-4 py-2 text-lg';
    case 'xl':
      return 'px-6 py-3 text-xl';
    case 'md':
    default:
      return 'px-4 py-2 text-sm';
  }
});

const isLoadingTextClass = computed(() => {
  if (props.outline) {
    switch (props.variant) {
      case 'primary': return 'text-sky-700';
      case 'secondary': return 'text-gray-700';
      case 'danger': return 'text-red-600';
      case 'success': return 'text-green-700';
      case 'warning': return 'text-yellow-700';
      case 'info': return 'text-blue-700';
      case 'ghost': return 'text-gray-700';
      default: return 'text-sky-700';
    }
  }
  switch (props.variant) {
    case 'warning': return 'text-black';
    default: return 'text-white';
  }
});

const variantClasses = computed(() => {
  const { variant, outline } = props;

  if (outline) {
    switch (variant) {
      case 'primary':
        return 'border-sky-700 text-sky-700 hover:bg-sky-50 focus:ring-sky-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'secondary':
        return 'border-gray-600 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'danger':
        return 'border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'success':
        return 'border-green-700 text-green-700 hover:bg-green-50 focus:ring-green-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'warning':
        return 'border-yellow-700 text-yellow-700 hover:bg-yellow-50 focus:ring-yellow-600 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'info':
        return 'border-blue-700 text-blue-700 hover:bg-blue-50 focus:ring-blue-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'ghost':
        return 'border-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:hover:bg-transparent disabled:text-gray-400';
      default:
        return 'border-sky-700 text-sky-700 hover:bg-sky-50 focus:ring-sky-500';
    }
  }

  switch (variant) {
    case 'primary':
      return 'bg-sky-700 hover:bg-sky-800 text-white border-sky-700 focus:ring-sky-500 disabled:bg-sky-400 disabled:border-sky-400';
    case 'secondary':
      return 'bg-gray-700 hover:bg-gray-800 text-white border-gray-700 focus:ring-gray-600 disabled:bg-gray-400 disabled:border-gray-400';
    case 'danger':
      return 'bg-red-700 hover:bg-red-800 text-white border-red-700 focus:ring-red-600 disabled:bg-red-400 disabled:border-red-400';
    case 'success':
      return 'bg-green-800 hover:bg-green-900 text-white border-green-800 focus:ring-green-600 disabled:bg-green-400 disabled:border-green-400';
    case 'warning':
      return 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500 focus:ring-yellow-400 disabled:bg-yellow-300 disabled:border-yellow-300 disabled:text-gray-500';
    case 'info':
      return 'bg-blue-700 hover:bg-blue-800 text-white border-blue-700 focus:ring-blue-500 disabled:bg-blue-400 disabled:border-blue-400';
    case 'ghost':
      return 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent focus:ring-gray-500 disabled:bg-transparent disabled:text-gray-400';
    default:
      return 'bg-sky-700 hover:bg-sky-800 text-white border-sky-700 focus:ring-sky-500 disabled:bg-sky-400 disabled:border-sky-400';
  }
});

const roundedClasses = computed(() => {
  return props.pill ? 'rounded-full' : 'rounded-md';
});

const disabledClasses = 'disabled:opacity-70 disabled:cursor-not-allowed';

const blockClasses = computed(() => {
  return props.block ? 'w-full' : '';
});

const buttonClasses = computed(() => [
  baseClasses,
  sizeClasses.value,
  variantClasses.value,
  roundedClasses.value,
  disabledClasses,
  blockClasses.value,
]);
</script>
<template>
  <button
      :type="type"
      :class="buttonClasses"
      :disabled="disabled || isLoading"
      @click="onClick"
      class="inline-flex items-center justify-center font-medium focus:outline-none transition-colors duration-150 ease-in-out"
  >
    <slot v-if="!isLoading" />
    <span v-if="isLoading" class="flex items-center">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5" :class="isLoadingTextClass" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span :class="isLoadingTextClass">Processing...</span>
    </span>
  </button>
</template>