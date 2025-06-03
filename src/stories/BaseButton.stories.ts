import type { Meta, StoryObj } from '@storybook/vue3';
import BaseButton from '../ui/BaseButton.vue';
import { userEvent, within, expect, fn } from '@storybook/test';

const meta: Meta<typeof BaseButton> = {
    title: 'UI/BaseButton',
    component: BaseButton,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: { type: 'select' },
            options: ['button', 'submit', 'reset'],
        },
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'danger', 'success', 'warning', 'ghost'],
        },
        size: {
            control: { type: 'select' },
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        disabled: { control: 'boolean' },
        isLoading: { control: 'boolean' },
        pill: { control: 'boolean' },
        outline: { control: 'boolean' },
        block: { control: 'boolean' },
        default: {
            control: 'text',
            name: 'default slot',
            description: 'Button content (text or HTML)',
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        default: 'Primary Button',
        onClick: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const buttonElement = canvas.getByRole('button', { name: /Primary Button/i });
        const onClickMock = args.onClick as ReturnType<typeof fn>;

        await expect(buttonElement).not.toBeDisabled();

        onClickMock.mockClear();
        await userEvent.click(buttonElement);
        await expect(onClickMock).toHaveBeenCalledTimes(1);

        onClickMock.mockClear();
        buttonElement.focus();
        await userEvent.keyboard('[Enter]');
        await expect(onClickMock).toHaveBeenCalledTimes(1);

        onClickMock.mockClear();
        buttonElement.focus();
        await userEvent.keyboard('[Space]');
        await expect(onClickMock).toHaveBeenCalledTimes(1);
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        default: 'Secondary Button',
        onClick: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const buttonElement = canvas.getByRole('button', { name: /Secondary Button/i });
        const onClickMock = args.onClick as ReturnType<typeof fn>;

        onClickMock.mockClear();
        await userEvent.click(buttonElement);
        await expect(onClickMock).toHaveBeenCalledTimes(1);
    },
};

export const Danger: Story = {
    args: {
        variant: 'danger',
        default: 'Danger Button',
        onClick: fn(),
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
        default: 'Success Button',
        onClick: fn(),
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
        default: 'Warning Button',
        onClick: fn(),
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        default: 'Ghost Button',
        onClick: fn(),
    },
};

export const OutlinePrimary: Story = {
    args: {
        variant: 'primary',
        outline: true,
        default: 'Outline Primary',
        onClick: fn(),
    },
};

export const PillButton: Story = {
    args: {
        variant: 'primary',
        pill: true,
        default: 'Pill Button',
        onClick: fn(),
    },
};

export const LargePrimary: Story = {
    args: {
        variant: 'primary',
        size: 'lg',
        default: 'Large Primary',
        onClick: fn(),
    },
};

export const SmallSecondary: Story = {
    args: {
        variant: 'secondary',
        size: 'sm',
        default: 'Small Secondary',
        onClick: fn(),
    },
};

export const Disabled: Story = {
    args: {
        variant: 'primary',
        disabled: true,
        default: 'Disabled Button',
        onClick: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const buttonElement = canvas.getByRole('button', { name: /Disabled Button/i });
        const onClickMock = args.onClick as ReturnType<typeof fn>;

        await expect(buttonElement).toBeDisabled();

        onClickMock.mockClear();
        await userEvent.click(buttonElement, { pointerEventsCheck: 0 });
        await expect(onClickMock).not.toHaveBeenCalled();
    },
};

export const Loading: Story = {
    args: {
        variant: 'primary',
        isLoading: true,
        default: 'Loading...',
        onClick: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const buttonElement = canvas.getByRole('button', { name: /Processing.../i });
        const onClickMock = args.onClick as ReturnType<typeof fn>;

        await expect(buttonElement).toHaveAttribute('disabled');

        onClickMock.mockClear();
        await userEvent.click(buttonElement, { pointerEventsCheck: 0 });
        await expect(onClickMock).not.toHaveBeenCalled();
    },
};

export const FullWidth: Story = {
    args: {
        variant: 'primary',
        block: true,
        default: 'Full Width Button',
        onClick: fn(),
    },
};

export const WithCustomContent: Story = {
    render: (args) => ({
        components: { BaseButton },
        setup() {
            return { args };
        },
        template: `<BaseButton v-bind="args"><em>Custom HTML</em> Content</BaseButton>`,
    }),
    args: {
        variant: 'secondary',
        onClick: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const buttonElement = canvas.getByRole('button', { name: /Custom HTML Content/i });
        const onClickMock = args.onClick as ReturnType<typeof fn>;

        onClickMock.mockClear();
        await userEvent.click(buttonElement);
        await expect(onClickMock).toHaveBeenCalledTimes(1);
    }
};