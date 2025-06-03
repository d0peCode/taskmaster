<script setup lang="ts">
import type { Task, TaskStatus } from '@/types/Task';
import { computed, defineProps, defineEmits } from 'vue';
import { format as formatDateFn, parseISO } from 'date-fns';
import BaseCard from '@/ui/BaseCard.vue';
import BaseButton from '@/ui/BaseButton.vue';

const props = defineProps<{
  task: Task;
}>();

const emit = defineEmits<{
  (e: 'edit', taskId: string): void;
  (e: 'delete', taskId: string): void;
  (e: 'toggleComplete', taskId: string): void;
  (e: 'togglePending', taskId: string): void;
}>();

const formatDate = (dateInput: string | Date | undefined | null, outputFormat: string = 'MMMM d, yyyy'): string => {
  if (!dateInput) return 'N/A';
  let date: Date;
  if (typeof dateInput === 'string') {
    date = parseISO(dateInput);
  } else {
    date = dateInput;
  }
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return formatDateFn(date, outputFormat);
};

const statusBadgeClasses = (status: TaskStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const statusBorderColor = computed(() => {
  switch (props.task.status) {
    case 'pending':
      return 'border-yellow-300';
    case 'in-progress':
      return 'border-blue-300';
    case 'completed':
      return 'border-green-300';
    default:
      return 'border-gray-200';
  }
});

const onEdit = () => emit('edit', props.task.id);
const onDelete = () => emit('delete', props.task.id);
const onToggleComplete = () => emit('toggleComplete', props.task.id);
const onTogglePending = () => emit('togglePending', props.task.id);
</script>

<template>
  <BaseCard :border-color="statusBorderColor" class="hover:shadow-lg transition-shadow duration-300 ease-in-out">
    <template #header>
      <div class="flex justify-between items-start">
        <h3 class="text-xl font-semibold text-gray-800">{{ task.title }}</h3>
        <span
            :class="statusBadgeClasses(task.status)"
            class="px-2 py-1 text-xs font-bold rounded-full"
        >
          {{ task.status.replace('-', ' ') }}
        </span>
      </div>
    </template>

    <p class="text-gray-600 mb-3 text-sm">{{ task.description }}</p>
    <div class="text-sm text-gray-500 mb-4">
      <p><strong>Due:</strong> {{ formatDate(task.dueDate) }}</p>
      <p class="mt-1"><strong>Created:</strong> {{ formatDate(task.createdAt) }}</p>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <BaseButton variant="secondary" size="sm" outline @click="onEdit">Edit</BaseButton>
        <BaseButton variant="danger" size="sm" outline @click="onDelete">Delete</BaseButton>
        <BaseButton
            v-if="task.status !== 'completed'"
            variant="success"
            size="sm"
            outline
            @click="onToggleComplete"
        >
          Mark Completed
        </BaseButton>
        <BaseButton
            v-if="task.status === 'completed'"
            variant="warning"
            size="sm"
            outline
            @click="onTogglePending"
        >
          Mark Pending
        </BaseButton>
      </div>
    </template>
  </BaseCard>
</template>
