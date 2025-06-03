import type { Meta, StoryObj } from '@storybook/vue3';
import TaskCard from '../components/TaskCard.vue';
import type { Task, TaskStatus } from '@/types/Task';
import { fn, userEvent, within, expect } from '@storybook/test';
import { format as formatDateFn } from 'date-fns';

type TaskIdArgs = [taskId: string];

const createSampleTask = (overrides: Partial<Task> = {}): Task => ({
    id: 'task-storybook-1',
    title: 'Sample Storybook Task',
    description: 'This is a detailed description for the sample task to see how it renders in the card.',
    dueDate: formatDateFn(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd'),
    status: 'pending' as TaskStatus,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    ...overrides,
});

const meta: Meta<typeof TaskCard> = {
    title: 'AppComponents/TaskCard',
    component: TaskCard,
    tags: ['autodocs'],
    argTypes: {
        task: {
            control: 'object',
            description: 'The task object to display.',
        },
        onEdit: { action: 'editClicked' },
        onDelete: { action: 'deleteClicked' },
        onToggleComplete: { action: 'toggleCompleteClicked' },
        onTogglePending: { action: 'togglePendingClicked' },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const PendingTask: Story = {
    name: 'Pending Task',
    args: {
        task: createSampleTask({
            id: 'pending-task-001',
            title: 'A Standard Pending Task',
            status: 'pending',
        }),
        onEdit: fn<TaskIdArgs, void>(),
        onDelete: fn<TaskIdArgs, void>(),
        onToggleComplete: fn<TaskIdArgs, void>(),
        onTogglePending: fn<TaskIdArgs, void>(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const taskArg = args.task as Task;

        const editButton = canvas.getByRole('button', { name: /Edit/i });
        const deleteButton = canvas.getByRole('button', { name: /Delete/i });
        const markCompleteButton = canvas.getByRole('button', { name: /Mark Completed/i });

        const onEditMock = args.onEdit as ReturnType<typeof fn<TaskIdArgs, void>>;
        const onDeleteMock = args.onDelete as ReturnType<typeof fn<TaskIdArgs, void>>;
        const onToggleCompleteMock = args.onToggleComplete as ReturnType<typeof fn<TaskIdArgs, void>>;

        onEditMock.mockClear();
        await userEvent.click(editButton);
        expect(onEditMock).toHaveBeenCalledTimes(1);
        expect(onEditMock).toHaveBeenCalledWith(taskArg.id);

        onDeleteMock.mockClear();
        await userEvent.click(deleteButton);
        expect(onDeleteMock).toHaveBeenCalledTimes(1);
        expect(onDeleteMock).toHaveBeenCalledWith(taskArg.id);

        onToggleCompleteMock.mockClear();
        await userEvent.click(markCompleteButton);
        expect(onToggleCompleteMock).toHaveBeenCalledTimes(1);
        expect(onToggleCompleteMock).toHaveBeenCalledWith(taskArg.id);

        expect(canvas.queryByRole('button', { name: /Mark Pending/i })).not.toBeInTheDocument();
    },
};

export const InProgressTask: Story = {
    name: 'In-Progress Task',
    args: {
        task: createSampleTask({
            id: 'inprogress-task-002',
            title: 'Task Currently In Progress',
            status: 'in-progress',
            description: 'Working diligently on this one.'
        }),
        onEdit: fn<TaskIdArgs, void>(),
        onDelete: fn<TaskIdArgs, void>(),
        onToggleComplete: fn<TaskIdArgs, void>(),
        onTogglePending: fn<TaskIdArgs, void>(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const taskArg = args.task as Task;

        const markCompleteButton = canvas.getByRole('button', { name: /Mark Completed/i });
        const onToggleCompleteMock = args.onToggleComplete as ReturnType<typeof fn<TaskIdArgs, void>>;

        onToggleCompleteMock.mockClear();
        await userEvent.click(markCompleteButton);
        expect(onToggleCompleteMock).toHaveBeenCalledTimes(1);
        expect(onToggleCompleteMock).toHaveBeenCalledWith(taskArg.id);

        expect(canvas.queryByRole('button', { name: /Mark Pending/i })).not.toBeInTheDocument();
    }
};

export const CompletedTaskStory: Story = {
    name: 'Completed Task',
    args: {
        task: createSampleTask({
            id: 'completed-task-003',
            title: 'A Finished Task',
            status: 'completed',
            description: 'This one is all done!',
            dueDate: formatDateFn(new Date(new Date().setDate(new Date().getDate() - 3)), 'yyyy-MM-dd'),
        }),
        onEdit: fn<TaskIdArgs, void>(),
        onDelete: fn<TaskIdArgs, void>(),
        onToggleComplete: fn<TaskIdArgs, void>(),
        onTogglePending: fn<TaskIdArgs, void>(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const taskArg = args.task as Task;

        const markPendingButton = canvas.getByRole('button', { name: /Mark Pending/i });
        const onTogglePendingMock = args.onTogglePending as ReturnType<typeof fn<TaskIdArgs, void>>;

        onTogglePendingMock.mockClear();
        await userEvent.click(markPendingButton);
        expect(onTogglePendingMock).toHaveBeenCalledTimes(1);
        expect(onTogglePendingMock).toHaveBeenCalledWith(taskArg.id);

        expect(canvas.queryByRole('button', { name: /Mark Completed/i })).not.toBeInTheDocument();
    },
};

export const LongDescriptionTask: Story = {
    name: 'Task with Long Description',
    args: {
        task: createSampleTask({
            id: 'long-desc-task-004',
            title: 'Task With A Very Long Description To Test Text Wrapping',
            description: 'This is an exceptionally long description designed to test how the text wraps within the card layout. It should demonstrate multiple lines of text and how the card handles overflow or expands to accommodate the content while maintaining a good visual appearance. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. This should definitely be enough text to cause wrapping.',
        }),
    },
};

export const MinimalContentTask: Story = {
    name: 'Task with Minimal Content',
    args: {
        task: createSampleTask({
            id: 'minimal-task-005',
            title: 'Quick Note',
            description: '',
            dueDate: formatDateFn(new Date(), 'yyyy-MM-dd'),
            status: 'pending',
        }),
    },
};