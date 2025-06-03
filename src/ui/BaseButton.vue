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
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
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

const variantClasses = computed(() => {
  const { variant, outline } = props;

  if (outline) {
    switch (variant) {
      case 'primary':
        return 'border-sky-600 text-sky-600 hover:bg-sky-50 focus:ring-sky-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'secondary':
        return 'border-gray-600 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'danger':
        return 'border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'success':
        return 'border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'warning':
        return 'border-yellow-500 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-400 disabled:hover:bg-transparent disabled:text-gray-400 disabled:border-gray-300';
      case 'ghost':
        return 'border-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 disabled:hover:bg-transparent disabled:text-gray-400';
      default:
        return 'border-sky-600 text-sky-600 hover:bg-sky-50 focus:ring-sky-500';
    }
  }

  switch (variant) {
    case 'primary':
      return 'bg-sky-600 hover:bg-sky-700 text-white border-sky-600 focus:ring-sky-500 disabled:bg-sky-300';
    case 'secondary':
      return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600 focus:ring-gray-500 disabled:bg-gray-300';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500 disabled:bg-red-300';
    case 'success':
      return 'bg-green-600 hover:bg-green-700 text-white border-green-600 focus:ring-green-500 disabled:bg-green-300';
    case 'warning':
      return 'bg-yellow-500 hover:bg-yellow-600 text-yellow-800 border-yellow-500 focus:ring-yellow-400 disabled:bg-yellow-300';
    case 'ghost':
      return 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent focus:ring-gray-500 disabled:bg-transparent disabled:text-gray-400';
    default:
      return 'bg-sky-600 hover:bg-sky-700 text-white border-sky-600 focus:ring-sky-500';
  }
});

const roundedClasses = computed(() => {
  return props.pill ? 'rounded-full' : 'rounded-md';
});

const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

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