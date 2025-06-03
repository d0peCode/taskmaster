<script setup lang="ts">
import { ref } from 'vue';
import TaskList from '@/components/TaskList.vue';
import TaskForm from '@/components/TaskForm.vue';
import BaseButton from '@/ui/BaseButton.vue';
import { useTaskStore } from '@/stores/task.store';
import type { Task } from '@/types/Task';

const taskStore = useTaskStore();
const showTaskForm = ref(false);
const taskToEdit = ref<Task | null>(null);

const openAddTaskForm = () => {
  taskToEdit.value = null;
  showTaskForm.value = true;
};

const prepareTaskForEdit = (taskId: string) => {
  const task = taskStore.getTaskById(taskId);
  if (task) {
    taskToEdit.value = { ...task };
    showTaskForm.value = true;
  } else {
    console.warn(`Task with ID ${taskId} not found for editing.`);
  }
};

const closeTaskForm = () => {
  showTaskForm.value = false;
  taskToEdit.value = null;
};

const handleTaskSubmit = (taskDataFromForm: Omit<Task, 'id' | 'createdAt'> | Task) => {
  if (taskToEdit.value && 'id' in taskDataFromForm && taskDataFromForm.id === taskToEdit.value.id) {
    taskStore.updateTask(taskDataFromForm as Task);
  } else {
    const newPayload = {
      title: (taskDataFromForm as any).title,
      description: (taskDataFromForm as any).description,
      dueDate: (taskDataFromForm as any).dueDate,
    };
    taskStore.addTask(newPayload as Omit<Task, 'id' | 'createdAt' | 'status'>);
  }
  closeTaskForm();
};
</script>
<template>
  <div class="container mx-auto p-4">
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-sky-700">TaskMaster</h1>
    </header>

    <main>
      <div class="mb-6 text-right">
        <BaseButton v-if="!showTaskForm" @click="openAddTaskForm" variant="primary">
          Add New Task
        </BaseButton>
      </div>

      <Transition name="form-slide-fade">
        <section v-if="showTaskForm" class="mb-8 form-wrapper">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700">
            {{ taskToEdit ? 'Edit Task' : 'Create a New Task' }}
          </h2>
          <TaskForm
              :task-to-edit="taskToEdit"
              @submit-task="handleTaskSubmit"
              @cancel="closeTaskForm"
          />
        </section>
      </Transition>

      <TaskList @request-edit-task="prepareTaskForEdit" />
    </main>

    <footer class="mt-12 text-center text-sm text-gray-500">
      <p>&copy; {{ new Date().getFullYear() }} TaskMaster. Built with Vue 3 & Love.</p>
    </footer>
  </div>
</template>
<style>
body {
  background-color: #f7fafc;
  font-family: 'Inter', sans-serif;
}

.form-slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.form-slide-fade-leave-active {
  transition: all 0.3s ease-in;
}
.form-slide-fade-enter-from,
.form-slide-fade-leave-to {
  transform: translateY(-400px);
  opacity: 0;
}
.form-slide-fade-enter-to,
.form-slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>