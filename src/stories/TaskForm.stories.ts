import type { Meta, StoryObj } from '@storybook/vue3';
import TaskForm from '../components/TaskForm.vue';
import type { Task, TaskStatus } from '@/types/Task';
import { fn, userEvent, within, expect } from '@storybook/test';
import { format as formatDateFn } from 'date-fns';

type SubmitTaskPayload = Omit<Task, 'id' | 'createdAt'> | Task;

type OnSubmitTaskArgsTuple = [taskData: SubmitTaskPayload];
type OnCancelArgsTuple = [];

const createSampleTaskForEdit = (overrides: Partial<Task> = {}): Task => ({
    id: 'edit-task-123',
    title: 'Existing Task Title',
    description: 'This is an existing task description that we want to edit.',
    dueDate: formatDateFn(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd'),
    status: 'pending' as TaskStatus,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    ...overrides,
});

const meta: Meta<typeof TaskForm> = {
    title: 'AppComponents/TaskForm',
    component: TaskForm,
    tags: ['autodocs'],
    argTypes: {
        taskToEdit: {
            control: 'object',
            description: 'Task object to pre-fill the form for editing. Null for add mode.',
        }
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AddMode: Story = {
    name: 'Add New Task Mode',
    args: {
        taskToEdit: null,
        'onSubmit-task': fn<OnSubmitTaskArgsTuple, void>(),
        onCancel: fn<OnCancelArgsTuple, void>(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const titleInput = canvas.getByLabelText(/Title/i);
        const descriptionInput = canvas.getByLabelText(/Description/i);
        const dueDateInput = canvas.getByLabelText(/Due Date/i);
        const submitButton = canvas.getByRole('button', { name: /Add Task/i });

        const onSubmitTaskMock = args['onSubmit-task'] as ReturnType<typeof fn<OnSubmitTaskArgsTuple, void>>;
        onSubmitTaskMock.mockClear();

        await userEvent.type(titleInput, 'New Task via Storybook');
        await userEvent.type(descriptionInput, 'A cool description.');
        const futureDate = formatDateFn(new Date(new Date().setDate(new Date().getDate() + 3)), 'yyyy-MM-dd');

        await userEvent.clear(dueDateInput);
        await userEvent.type(dueDateInput, futureDate);

        await userEvent.click(submitButton);

        await expect(onSubmitTaskMock).toHaveBeenCalledTimes(1);
        await expect(onSubmitTaskMock.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                title: 'New Task via Storybook',
                description: 'A cool description.',
                dueDate: futureDate,
                status: 'pending',
            })
        );
    },
};

export const EditMode: Story = {
    name: 'Edit Existing Task Mode',
    args: {
        taskToEdit: createSampleTaskForEdit({
            title: 'Task to Be Edited',
            description: 'Initial description for editing.',
            status: 'in-progress',
        }),
        'onSubmit-task': fn<OnSubmitTaskArgsTuple, void>(),
        onCancel: fn<OnCancelArgsTuple, void>(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const titleInput = canvas.getByLabelText(/Title/i) as HTMLInputElement;
        const statusSelect = canvas.getByLabelText(/Status/i) as HTMLSelectElement;
        const submitButton = canvas.getByRole('button', { name: /Save Changes/i });

        const onSubmitTaskMock = args['onSubmit-task'] as ReturnType<typeof fn<OnSubmitTaskArgsTuple, void>>;
        onSubmitTaskMock.mockClear();

        expect(titleInput.value).toBe('Task to Be Edited');
        expect(statusSelect.value).toBe('in-progress');

        await userEvent.clear(titleInput);
        await userEvent.type(titleInput, 'Updated Task Title via Storybook');
        await userEvent.selectOptions(statusSelect, 'completed');

        await userEvent.click(submitButton);

        await expect(onSubmitTaskMock).toHaveBeenCalledTimes(1);
        const emittedTask = onSubmitTaskMock.mock.calls[0][0] as Task;
        expect(emittedTask.title).toBe('Updated Task Title via Storybook');
        expect(emittedTask.id).toBe((args.taskToEdit as Task).id);
        expect(emittedTask.status).toBe('completed');
    },
};

export const WithValidationErrors: Story = {
    name: 'Native Validation Handling',
    args: {
        taskToEdit: null,
        'onSubmit-task': fn<OnSubmitTaskArgsTuple, void>(),
        onCancel: fn<OnCancelArgsTuple, void>(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const submitButton = canvas.getByRole('button', { name: /Add Task/i });
        const titleInput = canvas.getByLabelText(/Title/i) as HTMLInputElement;
        const dueDateInput = canvas.getByLabelText(/Due Date/i) as HTMLInputElement;

        const onSubmitTaskMock = args['onSubmit-task'] as ReturnType<typeof fn<OnSubmitTaskArgsTuple, void>>;
        onSubmitTaskMock.mockClear();

        await userEvent.clear(titleInput);
        await userEvent.clear(dueDateInput);

        await userEvent.click(submitButton);

        await expect(onSubmitTaskMock).not.toHaveBeenCalled();

        expect(titleInput.checkValidity()).toBe(false);
        expect(titleInput.validity.valueMissing).toBe(true);

        expect(dueDateInput.checkValidity()).toBe(false);
        expect(dueDateInput.validity.valueMissing).toBe(true);

        expect(canvas.queryByText('Title is required.')).not.toBeInTheDocument();
        expect(canvas.queryByText('Due date is required.')).not.toBeInTheDocument();

        await userEvent.type(titleInput, 'Valid Title');
        const validDate = formatDateFn(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd');

        await userEvent.clear(dueDateInput);
        await userEvent.type(dueDateInput, validDate);

        await userEvent.click(submitButton);

        await expect(onSubmitTaskMock).toHaveBeenCalledTimes(1);
        await expect(onSubmitTaskMock.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                title: 'Valid Title',
                dueDate: validDate,
            })
        );
    },
};

export const CancelButton: Story = {
    name: 'Cancel Button Interaction',
    args: {
        taskToEdit: null,
        'onSubmit-task': fn<OnSubmitTaskArgsTuple, void>(),
        onCancel: fn<OnCancelArgsTuple, void>(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const cancelButton = canvas.getByRole('button', { name: /Cancel/i });

        const onCancelMock = args.onCancel as ReturnType<typeof fn<OnCancelArgsTuple, void>>;
        const onSubmitTaskMock = args['onSubmit-task'] as ReturnType<typeof fn<OnSubmitTaskArgsTuple, void>>;
        onCancelMock.mockClear();
        onSubmitTaskMock.mockClear();

        await userEvent.click(cancelButton);

        await expect(onCancelMock).toHaveBeenCalledTimes(1);
        await expect(onSubmitTaskMock).not.toHaveBeenCalled();
    },
};
