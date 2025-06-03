<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue';
import { useTaskStore } from '@/stores/task.store';
import TaskCard from '@/components/TaskCard.vue';
import BaseInput from '@/ui/BaseInput.vue';
import BaseSelect from '@/ui/BaseSelect.vue';
import type { SelectOption } from '@/ui/BaseSelect.vue';
import type { Task, TaskStatus } from '@/types/Task';

type SortCriteriaValue =
    | 'createdAtDesc'
    | 'createdAtAsc'
    | 'dueDateAsc'
    | 'dueDateDesc'
    | 'titleAsc'
    | 'titleDesc';

const taskStore = useTaskStore();

const emit = defineEmits<{
  (e: 'request-edit-task', taskId: string): void;
}>();

const searchQuery = ref('');
const selectedStatusFilter = ref<TaskStatus | 'all'>('all');
const selectedSortCriteria = ref<SortCriteriaValue>('createdAtDesc');

const statusFilterOptions = ref<SelectOption[]>([
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]);

const sortCriteriaOptions = ref<SelectOption[]>([
  { value: 'createdAtDesc', label: 'Created (Newest)' },
  { value: 'createdAtAsc', label: 'Created (Oldest)' },
  { value: 'dueDateAsc', label: 'Due Date (Soonest)' },
  { value: 'dueDateDesc', label: 'Due Date (Latest)' },
  { value: 'titleAsc', label: 'Title (A-Z)' },
  { value: 'titleDesc', label: 'Title (Z-A)' },
]);

const tasksToDisplay = computed(() => {
  let displayedTasks: Task[] = [...taskStore.tasks];

  if (selectedStatusFilter.value !== 'all') {
    displayedTasks = displayedTasks.filter(task => task.status === selectedStatusFilter.value);
  }

  if (searchQuery.value.trim() !== '') {
    const lowerSearchQuery = searchQuery.value.toLowerCase();
    displayedTasks = displayedTasks.filter(task =>
        task.title.toLowerCase().includes(lowerSearchQuery) ||
        task.description.toLowerCase().includes(lowerSearchQuery)
    );
  }

  return [...displayedTasks].sort((a, b) => {
    switch (selectedSortCriteria.value) {
      case 'createdAtAsc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'createdAtDesc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'dueDateAsc':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'dueDateDesc':
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      case 'titleAsc':
        return a.title.localeCompare(b.title);
      case 'titleDesc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
});

const handleEditTaskRequest = (taskId: string) => {
  emit('request-edit-task', taskId);
};

const handleDeleteTask = (taskId: string) => {
  if (window.confirm('Are you sure you want to delete this task?')) {
    taskStore.deleteTask(taskId);
  }
};

const handleToggleCompleteTask = (taskId: string) => {
  taskStore.updateTaskStatus(taskId, 'completed');
};

const handleTogglePendingTask = (taskId: string) => {
  taskStore.updateTaskStatus(taskId, 'pending');
};

const handleToggleInProgressTask = (taskId: string) => {
  taskStore.updateTaskStatus(taskId, 'in-progress');
};
</script>
<template>
  <div class="task-list-container space-y-6 p-4">
    <div class="controls-bar flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg shadow mb-6">
      <div class="search-tasks flex-grow sm:flex-grow-0 sm:mr-4 w-full sm:w-auto">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search by title or description..."
          type="search"
          id="task-search"
          label="Search Tasks"
        />
      </div>
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div class="filter-status">
          <BaseSelect
            v-model="selectedStatusFilter"
            label="Filter by Status:"
            id="status-filter"
            :options="statusFilterOptions"
            option-value-key="value"
            option-text-key="label"
            class="w-full"
          />
        </div>

        <div class="sort-tasks">
          <BaseSelect
            v-model="selectedSortCriteria"
            label="Sort by:"
            id="sort-criteria"
            :options="sortCriteriaOptions"
            option-value-key="value"
            option-text-key="label"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <div v-if="taskStore.isLoading" class="text-center py-10">
      <p class="text-gray-500">Loading tasks...</p>
    </div>
    <div v-else-if="taskStore.error" class="text-center py-10">
      <p class="text-red-500">Error loading tasks: {{ taskStore.error }}</p>
    </div>
    <div v-else-if="tasksToDisplay.length === 0" class="text-center py-10">
      <p class="text-gray-500">
        No tasks match your current filters or search query.
      </p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TaskCard
        v-for="task in tasksToDisplay"
        :key="task.id"
        :task="task"
        @edit="handleEditTaskRequest"
        @delete="handleDeleteTask"
        @toggle-complete="handleToggleCompleteTask"
        @toggle-pending="handleTogglePendingTask"
        @toggle-in-progress="handleToggleInProgressTask"
        class="transform hover:scale-105 transition-transform duration-200 ease-in-out"
      />
    </div>
  </div>
</template>
