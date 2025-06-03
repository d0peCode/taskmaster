import type { Meta, StoryObj } from '@storybook/vue3';
import BaseCard from '../ui/BaseCard.vue';
import BaseButton from '../ui/BaseButton.vue';

const meta: Meta<typeof BaseCard> = {
    title: 'UI/BaseCard',
    component: BaseCard,
    tags: ['autodocs'],
    argTypes: {
        padding: {
            control: { type: 'select' },
            options: ['none', 'sm', 'md', 'lg'],
        },
        shadow: {
            control: { type: 'select' },
            options: ['none', 'sm', 'md', 'lg', 'xl'],
        },
        rounded: {
            control: { type: 'select' },
            options: ['none', 'sm', 'md', 'lg', 'full'],
        },
        borderColor: { control: 'color' },
        headerText: { control: 'text' },
        header: { control: 'text', description: 'Content for the header slot' },
        default: { control: 'text', description: 'Content for the default body slot' },
        footer: { control: 'text', description: 'Content for the footer slot' },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        default: 'This is the default body content of the card.',
    },
};

export const WithHeaderTextProp: Story = {
    args: {
        headerText: 'Card Title via Prop',
        default: 'Content of the card with a prop-based header.',
    },
};

export const WithHeaderSlot: Story = {
    args: {
        default: 'Card body content.',
        padding: 'md',
    },
    render: (args) => ({
        components: { BaseCard },
        setup() {
            return { args };
        },
        template: `
      <BaseCard :padding="args.padding" :shadow="args.shadow" :rounded="args.rounded" :borderColor="args.borderColor">
        <template #header>
          <h2 class="text-2xl font-bold text-purple-600">Custom Header Slot</h2>
        </template>
        {{ args.default || 'Card body content with a custom header slot.' }}
      </BaseCard>
    `,
    }),
};

export const WithFooterSlot: Story = {
    render: (args) => ({
        components: { BaseCard, BaseButton },
        setup() {
            return { args };
        },
        template: `
      <BaseCard :padding="args.padding" :shadow="args.shadow" :rounded="args.rounded" :borderColor="args.borderColor">
        {{ args.default || 'Card body content.' }}
        <template #footer>
          <div class="flex justify-end">
            <BaseButton size="sm" variant="primary">Action</BaseButton>
          </div>
        </template>
      </BaseCard>
    `,
    }),
    args: {
        headerText: 'Card with Footer',
        default: 'This card demonstrates a footer slot with an action button.',
        padding: 'md',
    },
};

export const AllSlots: Story = {
    render: (args) => ({
        components: { BaseCard, BaseButton },
        setup() {
            return { args };
        },
        template: `
      <BaseCard :padding="args.padding" :shadow="args.shadow" :rounded="args.rounded" :borderColor="args.borderColor">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-blue-700">Full Card Example</h2>
            <BaseButton size="xs" variant="ghost">Info</BaseButton>
          </div>
        </template>
        
        <p>{{ args.default || 'This is the main content area of the card. It can contain various elements like text, images, or other components.' }}</p>
        <p class="mt-2 text-sm text-gray-500">Additional details can go here.</p>
        
        <template #footer>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">Last updated: Just now</span>
            <BaseButton size="sm" variant="success" outline>Confirm</BaseButton>
          </div>
        </template>
      </BaseCard>
    `,
    }),
    args: {
        default: '',
        padding: 'md',
        shadow: 'lg',
        rounded: 'lg',
        borderColor: 'border-gray-300',
    },
};

export const CustomStyling: Story = {
    args: {
        headerText: 'Custom Styled Card',
        default: 'This card has custom padding, shadow, rounding, and border color.',
        padding: 'lg',
        shadow: 'xl',
        rounded: 'md',
        borderColor: 'border-red-500',
    },
};