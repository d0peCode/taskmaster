// src/components/TaskList.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import { createPinia, setActivePinia } from 'pinia';
import TaskList from '../components/TaskList.vue';
import { useTaskStore } from '@/stores/task.store';
import type { Task } from '@/types/Task';
import { userEvent, within, expect } from '@storybook/test';

const createSampleTask = (id: string, overrides: Partial<Task> = {}): Task => ({
    id,
    title: `Task ${id}`, // Default title pattern
    description: `Description for task ${id}. Lorem ipsum dolor sit amet.`,
    dueDate: new Date(new Date().setDate(new Date().getDate() + parseInt(id))).toISOString(),
    status: 'pending',
    createdAt: new Date(new Date().setDate(new Date().getDate() - parseInt(id))),
    ...overrides,
});

const meta: Meta<typeof TaskList> = {
    title: 'AppComponents/TaskList',
    component: TaskList,
    tags: ['autodocs'],
    decorators: [
        (storyFn, context) => {
            const pinia = createPinia();
            setActivePinia(pinia);
            const mockInitialState = context.parameters.mockStoreState;
            const taskStoreInstance = useTaskStore();

            if (mockInitialState) {
                taskStoreInstance.$patch({
                    tasks: mockInitialState.tasks || [],
                    isLoading: mockInitialState.isLoading !== undefined ? mockInitialState.isLoading : false,
                    error: mockInitialState.error !== undefined ? mockInitialState.error : null,
                });
            } else {
                taskStoreInstance.$patch({
                    tasks: [],
                    isLoading: false,
                    error: null,
                });
            }
            return storyFn();
        },
    ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithTasksAndFiltering: Story = {
    parameters: {
        mockStoreState: {
            tasks: [
                createSampleTask('1', { title: 'Pending Task 1', status: 'pending', dueDate: '2025-07-01T00:00:00.000Z' }),
                createSampleTask('2', { title: 'In Progress Task', status: 'in-progress', dueDate: '2025-07-05T00:00:00.000Z' }),
                createSampleTask('3', { title: 'Completed Task 1', status: 'completed', dueDate: '2025-06-20T00:00:00.000Z' }),
                createSampleTask('4', { title: 'Pending Task 2', status: 'pending', dueDate: '2025-07-03T00:00:00.000Z' }),
            ],
            isLoading: false,
            error: null,
        },
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect((await canvas.findAllByRole('heading', { level: 3 })).length).toBe(4);

        const statusFilterDropdown = canvas.getByLabelText(/Filter by Status:/i);

        await userEvent.selectOptions(statusFilterDropdown, 'pending');
        const pendingTaskHeadings = await canvas.findAllByRole('heading', { level: 3, name: /Pending Task/i });
        await expect(pendingTaskHeadings.length).toBe(2);
        await expect(canvas.queryByRole('heading', { level: 3, name: /In Progress Task/i })).not.toBeInTheDocument();
        await expect(canvas.queryByRole('heading', { level: 3, name: /Completed Task 1/i })).not.toBeInTheDocument();

        await userEvent.selectOptions(statusFilterDropdown, 'completed');
        const completedTaskHeadings = await canvas.findAllByRole('heading', { level: 3, name: /Completed Task 1/i });
        await expect(completedTaskHeadings.length).toBe(1);
        await expect(canvas.queryByRole('heading', { level: 3, name: /Pending Task/i })).not.toBeInTheDocument();

        await userEvent.selectOptions(statusFilterDropdown, 'all');
        await expect((await canvas.findAllByRole('heading', { level: 3 })).length).toBe(4);

        const sortDropdown = canvas.getByLabelText(/Sort by:/i);

        await userEvent.selectOptions(statusFilterDropdown, 'pending');
        await userEvent.selectOptions(sortDropdown, 'titleAsc');

        const sortedPendingTaskHeadingsAsc = await canvas.findAllByRole('heading', { level: 3, name: /Pending Task/i });
        expect(sortedPendingTaskHeadingsAsc[0].textContent).toContain('Pending Task 1');
        expect(sortedPendingTaskHeadingsAsc[1].textContent).toContain('Pending Task 2');

        await userEvent.selectOptions(sortDropdown, 'titleDesc');
        const sortedPendingTaskHeadingsDesc = await canvas.findAllByRole('heading', { level: 3, name: /Pending Task/i });
        expect(sortedPendingTaskHeadingsDesc[0].textContent).toContain('Pending Task 2');
        expect(sortedPendingTaskHeadingsDesc[1].textContent).toContain('Pending Task 1');
    },
};

export const WithTasks: Story = {
    parameters: {
        mockStoreState: {
            tasks: [
                createSampleTask('1', { title: 'Buy groceries', status: 'pending' }),
                createSampleTask('2', { title: 'Book flight to Storybook Land', status: 'in-progress' }),
                createSampleTask('3', { title: 'Write epic documentation', status: 'completed' }),
                createSampleTask('4', { title: 'Review PRs', status: 'pending' }),
            ],
            isLoading: false,
            error: null,
        },
    },
};

export const EmptyList: Story = {
    parameters: {
        mockStoreState: {
            tasks: [],
            isLoading: false,
            error: null,
        },
    },
};

export const Loading: Story = {
    parameters: {
        mockStoreState: {
            tasks: [],
            isLoading: true,
            error: null,
        },
    },
};

export const ErrorState: Story = {
    parameters: {
        mockStoreState: {
            tasks: [],
            isLoading: false,
            error: 'Failed to fetch tasks from the server. Please try again later.',
        },
    },
};