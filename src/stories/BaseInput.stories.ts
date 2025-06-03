import type { Meta, StoryObj } from '@storybook/vue3';
import BaseInput from '../ui/BaseInput.vue';
import { fn, userEvent, within, expect } from '@storybook/test';

const meta: Meta<typeof BaseInput> = {
    title: 'UI/BaseInput',
    component: BaseInput,
    tags: ['autodocs'],
    argTypes: {
        modelValue: { control: 'text', description: 'The input value (for v-model)' },
        label: { control: 'text' },
        type: {
            control: { type: 'select' },
            options: ['text', 'email', 'password', 'number', 'date', 'tel', 'url', 'search'],
        },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        errorMessage: { control: 'text' },
        autocomplete: { control: 'text' },
        id: { control: 'text' },
        'onUpdate:modelValue': { action: 'update:modelValue' },
    },
    args: {
        label: 'Example Label',
        modelValue: '',
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default Input',
    args: {
        placeholder: 'Enter text here...',
        'onUpdate:modelValue': fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const inputElement = canvas.getByLabelText(args.label || 'Example Label');

        const onUpdateModelValueMock = args['onUpdate:modelValue'] as ReturnType<typeof fn>;
        onUpdateModelValueMock.mockClear();

        await userEvent.type(inputElement, 'Hello world');

        expect(onUpdateModelValueMock).toHaveBeenCalled();
        const lastCallIndex = onUpdateModelValueMock.mock.calls.length - 1;
        expect(onUpdateModelValueMock.mock.calls[lastCallIndex][0]).toBe('Hello world');
    },
};

export const WithInitialValue: Story = {
    name: 'With Initial Value',
    args: {
        modelValue: 'Initial text',
        placeholder: 'Enter text here...',
    },
};

export const PasswordType: Story = {
    name: 'Password Input',
    args: {
        type: 'password',
        label: 'Password',
        modelValue: 'secret',
        placeholder: 'Enter your password',
    },
};

export const DateType: Story = {
    name: 'Date Input',
    args: {
        type: 'date',
        label: 'Select Date',
        modelValue: '2025-12-31',
        'onUpdate:modelValue': fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const dateInput = canvas.getByLabelText(args.label!) as HTMLInputElement;

        const onUpdateModelValueMock = args['onUpdate:modelValue'] as ReturnType<typeof fn>;
        onUpdateModelValueMock.mockClear();

        expect(dateInput.value).toBe('2025-12-31');

        dateInput.value = '';
        await userEvent.type(dateInput, '2024-01-15');

        if (onUpdateModelValueMock.mock.calls.length > 0) {
            const lastCallIndex = onUpdateModelValueMock.mock.calls.length - 1;
            expect(onUpdateModelValueMock.mock.calls[lastCallIndex][0]).toBe('2024-01-15');
        } else {
            expect(dateInput.value).toBe('2024-01-15');
        }
    }
};

export const Disabled: Story = {
    name: 'Disabled Input',
    args: {
        label: 'Disabled Field',
        modelValue: 'Cannot change this',
        disabled: true,
        'onUpdate:modelValue': fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const inputElement = canvas.getByLabelText(args.label!) as HTMLInputElement;
        const onUpdateModelValueMock = args['onUpdate:modelValue'] as ReturnType<typeof fn>;

        expect(inputElement).toBeDisabled();
        onUpdateModelValueMock.mockClear();
        await userEvent.type(inputElement, 'Attempting to type');
        expect(inputElement.value).toBe('Cannot change this');
        expect(onUpdateModelValueMock).not.toHaveBeenCalled();
    },
};

export const WithErrorMessage: Story = {
    name: 'Input with Error',
    args: {
        label: 'Faulty Input',
        modelValue: 'Some value',
        errorMessage: 'This field has an error!',
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('This field has an error!')).toBeInTheDocument();
        const inputElement = canvas.getByLabelText(args.label!);
        expect(inputElement).toHaveClass('border-red-500');
    },
};

export const RequiredInput: Story = {
    name: 'Required Input',
    args: {
        label: 'Mandatory Field',
        required: true,
        placeholder: 'This field is required',
    },
};