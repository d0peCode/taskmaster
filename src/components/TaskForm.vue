<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Task, TaskStatus } from '@/types/Task';
import BaseButton from '@/ui/BaseButton.vue';
import { format as formatDateFn, parseISO } from 'date-fns';

interface FormData {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
}

interface Props {
  taskToEdit?: Task | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'submit-task', taskData: Omit<Task, 'id' | 'createdAt'> | Task): void;
  (e: 'cancel'): void;
}>();

const isEditMode = computed(() => !!props.taskToEdit);

const initialFormData = (): FormData => ({
  title: '',
  description: '',
  dueDate: formatDateFn(new Date(), 'yyyy-MM-dd'),
  status: 'pending' as TaskStatus,
});

const formData = ref<FormData>(initialFormData());
const errors = ref<{ title?: string; dueDate?: string }>({});

watch(() => props.taskToEdit, (task) => {
  if (task) {
    formData.value = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? formatDateFn(parseISO(task.dueDate), 'yyyy-MM-dd') : formatDateFn(new Date(), 'yyyy-MM-dd'),
      status: task.status,
    };
  } else {
    formData.value = initialFormData();
  }
}, { immediate: true });

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required.';
    isValid = false;
  }
  if (!formData.value.dueDate) {
    errors.value.dueDate = 'Due date is required.';
    isValid = false;
  }
  return isValid;
};

const handleSubmit = () => {
  if (validateForm()) {
    if (isEditMode.value && props.taskToEdit) {
      emit('submit-task', {
        ...props.taskToEdit,
        ...formData.value,
        dueDate: formData.value.dueDate
      });
    } else {
      const taskDataToSubmit: Omit<Task, 'id' | 'createdAt'> = {
        title: formData.value.title,
        description: formData.value.description,
        dueDate: formData.value.dueDate,
        status: formData.value.status,
      };
      emit('submit-task', taskDataToSubmit);
    }
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 p-4 bg-white shadow-md rounded-lg border border-gray-200">
    <div>
      <label for="task-title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
          type="text"
          id="task-title"
          v-model="formData.title"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          :class="{ 'border-red-500': errors.title }"
      />
      <p v-if="errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
    </div>

    <div>
      <label for="task-description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
          id="task-description"
          v-model="formData.description"
          rows="4"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
      ></textarea>
    </div>

    <div>
      <label for="task-dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
      <input
          type="date"
          id="task-dueDate"
          v-model="formData.dueDate"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          :class="{ 'border-red-500': errors.dueDate }"
      />
      <p v-if="errors.dueDate" class="mt-1 text-xs text-red-600">{{ errors.dueDate }}</p>
    </div>

    <div v-if="isEditMode" class="col-span-full">
      <label for="task-status" class="block text-sm font-medium text-gray-700">Status</label>
      <select
          id="task-status"
          v-model="formData.status"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>


    <div class="flex justify-end space-x-3 pt-4">
      <BaseButton type="button" variant="secondary" @click="handleCancel">
        Cancel
      </BaseButton>
      <BaseButton type="submit" variant="primary">
        {{ isEditMode ? 'Save Changes' : 'Add Task' }}
      </BaseButton>
    </div>
  </form>
</template>
