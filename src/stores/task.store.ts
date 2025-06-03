import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Task, TaskStatus } from '@/types/Task';
import { v4 as uuidv4 } from 'uuid';
import { useCookies } from '@vueuse/integrations/useCookies';

const COOKIE_NAME = 'taskmaster-tasks';

export const useTaskStore = defineStore('tasks', () => {
    const cookies = useCookies();

    const getTasksFromCookie = (): Task[] => {
        const tasksFromCookie = cookies.get<Task[] | undefined>(COOKIE_NAME);
        if (tasksFromCookie && Array.isArray(tasksFromCookie)) {
            return tasksFromCookie.map(task => ({
                ...task,
                createdAt: new Date(task.createdAt),
            }));
        }
        return [];
    };

    const tasks = ref<Task[]>(getTasksFromCookie());
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    watch(
        tasks,
        (newTasks) => {
            cookies.set(COOKIE_NAME, newTasks, {
                path: '/',
                sameSite: 'lax',
            });
        },
        { deep: true }
    );

    const allTasksSortedByCreationDate = computed<Task[]>(() =>
        [...tasks.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );

    const tasksByStatus = computed(() => (status: TaskStatus): Task[] =>
        tasks.value
            .filter(task => task.status === status)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );

    const pendingTasks = computed<Task[]>(() =>
        tasks.value.filter(task => task.status === 'pending')
    );

    const inProgressTasks = computed<Task[]>(() =>
        tasks.value.filter(task => task.status === 'in-progress')
    );

    const completedTasks = computed<Task[]>(() =>
        tasks.value.filter(task => task.status === 'completed')
    );

    const getTaskById = computed(() => (id: string): Task | undefined =>
        tasks.value.find(task => task.id === id)
    );

    function addTask(newTaskData: Omit<Task, 'id' | 'createdAt' | 'status'>) {
        const task: Task = {
            id: uuidv4(),
            title: newTaskData.title,
            description: newTaskData.description,
            dueDate: newTaskData.dueDate,
            status: 'pending',
            createdAt: new Date(),
        };
        tasks.value.push(task);
    }

    function updateTask(updatedTaskData: Partial<Omit<Task, 'id' | 'createdAt'>> & { id: string }) {
        const index = tasks.value.findIndex(task => task.id === updatedTaskData.id);
        if (index !== -1) {
            const existingTask = tasks.value[index];
            tasks.value[index] = {
                ...existingTask,
                ...updatedTaskData,
                createdAt: existingTask.createdAt
            };
        }
    }

    function deleteTask(taskId: string) {
        tasks.value = tasks.value.filter(task => task.id !== taskId);
    }

    function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
        const task = tasks.value.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
        }
    }

    function setLoading(loadingState: boolean) {
        isLoading.value = loadingState;
    }

    function setError(errorMessage: string | null) {
        error.value = errorMessage;
    }

    return {
        tasks,
        isLoading,
        error,
        allTasksSortedByCreationDate,
        tasksByStatus,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        getTaskById,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        setLoading,
        setError,
    };
});
