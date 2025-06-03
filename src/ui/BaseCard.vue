<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || headerText" :class="headerClasses">
      <slot name="header">
        <h3 v-if="headerText" class="text-lg font-semibold text-gray-700">{{ headerText }}</h3>
      </slot>
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults, useSlots } from 'vue';

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  borderColor?: string;
  headerText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: 'md',
  rounded: 'lg',
  borderColor: 'border-gray-200',
  headerText: '',
});

const slots = useSlots();

const cardClasses = computed(() => [
  'bg-white',
  'border',
  props.borderColor,
  {
    'shadow-none': props.shadow === 'none',
    'shadow-sm': props.shadow === 'sm',
    'shadow-md': props.shadow === 'md',
    'shadow-lg': props.shadow === 'lg',
    'shadow-xl': props.shadow === 'xl',
    'rounded-none': props.rounded === 'none',
    'rounded-sm': props.rounded === 'sm',
    'rounded-md': props.rounded === 'md',
    'rounded-lg': props.rounded === 'lg',
    'rounded-full': props.rounded === 'full',
  }
]);

const headerClasses = computed(() => [
  'border-b',
  props.borderColor,
  {
    'p-0': props.padding === 'none' && !slots.header,
    'px-4 py-3 sm:px-6': props.padding !== 'none' || slots.header,
  }
]);

const bodyClasses = computed(() => {
  const classes = [];
  switch (props.padding) {
    case 'none': classes.push('p-0'); break;
    case 'sm': classes.push('p-2 sm:p-3'); break;
    case 'lg': classes.push('p-6 sm:p-8'); break;
    case 'md':
    default: classes.push('p-4 sm:p-6'); break;
  }
  return classes;
});

const footerClasses = computed(() => [
  'border-t',
  props.borderColor,
  {
    'p-0': props.padding === 'none' && !slots.footer,
    'px-4 py-3 sm:px-6': props.padding !== 'none' || slots.footer,
  }
]);

</script>