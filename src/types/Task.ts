// src/types/Task.ts
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string; // Or Date, depending on how you want to handle it. String is often simpler for storage.
    status: TaskStatus;
    createdAt: Date; // Good to have for sorting or reference
}