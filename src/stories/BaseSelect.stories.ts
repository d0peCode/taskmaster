import type { Meta, StoryObj } from '@storybook/vue3';
import BaseSelect from '../ui/BaseSelect.vue';
import type { SelectOption } from '../ui/BaseSelect.vue';
import { fn, userEvent, within, expect } from '@storybook/test';

const sampleOptions: SelectOption[] = [
    { value: '', text: 'Please select an option', disabled: true },
    { value: 'opt1', text: 'Option 1' },
    { value: 'opt2', text: 'Option 2', disabled: true },
    { value: 'opt3', text: 'Option 3' },
];

const sampleOptionsCustomKeys: SelectOption[] = [
    { id: '', name: 'Select item...', disabled: true },
    { id: 'itemA', name: 'Item A' },
    { id: 'itemB', name: 'Item B' },
];

const meta: Meta<typeof BaseSelect> = {
    title: 'UI/BaseSelect',
    component: BaseSelect,
    tags: ['autodocs'],
    argTypes: {
        modelValue: { control: 'select', options: ['', ...sampleOptions.filter(o => !o.disabled).map(o => o.value)] },
        options: { control: 'object' },
        label: { control: 'text' },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        errorMessage: { control: 'text' },
        id: { control: 'text' },
        optionValueKey: { control: 'text' },
        optionTextKey: { control: 'text' },
        'onUpdate:modelValue': { action: 'update:modelValue' },
    },
    args: {
        label: 'Example Select',
        options: sampleOptions,
        modelValue: '',
        placeholder: 'Select one...',
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default Select',
    args: {
        'onUpdate:modelValue': fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const selectElement = canvas.getByLabelText(args.label!) as HTMLSelectElement;
        const onUpdateModelValueMock = args['onUpdate:modelValue'] as ReturnType<typeof fn>;

        onUpdateModelValueMock.mockClear();
        
        await userEvent.selectOptions(selectElement, 'opt1');

        expect(selectElement.value).toBe('opt1');
        expect(onUpdateModelValueMock).toHaveBeenCalledTimes(1);
        expect(onUpdateModelValueMock).toHaveBeenLastCalledWith('opt1');
    },
};

export const WithInitialValue: Story = {
    name: 'With Initial Value Selected',
    args: {
        modelValue: 'opt3',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const selectElement = canvas.getByLabelText('Example Select') as HTMLSelectElement;
        expect(selectElement.value).toBe('opt3');
    },
};

export const CustomKeys: Story = {
    name: 'Custom Option Keys',
    args: {
        label: 'Select Item',
        options: sampleOptionsCustomKeys,
        optionValueKey: 'id',
        optionTextKey: 'name',
        modelValue: '',
        placeholder: 'Choose an item...',
        'onUpdate:modelValue': fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const selectElement = canvas.getByLabelText(args.label!) as HTMLSelectElement;
        const onUpdateModelValueMock = args['onUpdate:modelValue'] as ReturnType<typeof fn>;

        onUpdateModelValueMock.mockClear();
        await userEvent.selectOptions(selectElement, 'itemA');

        expect(selectElement.value).toBe('itemA');
        expect(onUpdateModelValueMock).toHaveBeenCalledTimes(1);
        expect(onUpdateModelValueMock).toHaveBeenLastCalledWith('itemA');
    },
};

export const Disabled: Story = {
    name: 'Disabled Select',
    args: {
        modelValue: 'opt1',
        disabled: true,
        'onUpdate:modelValue': fn(),
    },
    play: async ({ args, canvasElement }) => {
        const canvas = within(canvasElement);
        const selectElement = canvas.getByLabelText(args.label!) as HTMLSelectElement;
        const onUpdateModelValueMock = args['onUpdate:modelValue'] as ReturnType<typeof fn>;

        expect(selectElement).toBeDisabled();
        onUpdateModelValueMock.mockClear();
        
        await userEvent.selectOptions(selectElement, 'opt3');
        expect(selectElement.value).toBe('opt1');
        expect(onUpdateModelValueMock).not.toHaveBeenCalled();
    },
};

export const WithErrorMessageSelect: Story = {
    name: 'Select with Error',
    args: {
        errorMessage: 'Please make a selection.',
        modelValue: '',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.getByText('Please make a selection.')).toBeInTheDocument();
        const selectElement = canvas.getByLabelText('Example Select');
        expect(selectElement).toHaveClass('border-red-500');
    },
};