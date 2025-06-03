<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Task, TaskStatus } from '@/types/Task';
import BaseButton from '@/ui/BaseButton.vue';
import BaseInput from '@/ui/BaseInput.vue';
import BaseSelect from '@/ui/BaseSelect.vue';
import type { SelectOption } from '@/ui/BaseSelect.vue';
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

const statusOptions = ref<SelectOption[]>([
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]);

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
      <BaseInput
        v-model="formData.title"
        label="Title"
        id="task-title"
        type="text"
        :required="true"
        :error-message="errors.title"
        placeholder="e.g., Buy groceries"
      />
    </div>

    <div>
      <label for="task-description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        id="task-description"
        v-model="formData.description"
        rows="4"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
        placeholder="e.g., Milk, eggs, bread, and cheese"
      ></textarea>
    </div>

    <div>
      <BaseInput
        v-model="formData.dueDate"
        label="Due Date"
        id="task-dueDate"
        type="date"
        :required="true"
        :error-message="errors.dueDate"
      />
    </div>

    <div v-if="isEditMode">
      <BaseSelect
        v-model="formData.status"
        label="Status"
        id="task-status"
        :options="statusOptions"
        option-value-key="value"
        option-text-key="label"
      />
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
