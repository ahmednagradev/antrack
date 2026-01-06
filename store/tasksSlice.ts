import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Task = {
    id: string;
    text: string;
    createdAt: number;
    archivedAt?: number;
    status: "active" | "archived";
}

type TasksState = {
    tasks: Task[];
}

const initialState: TasksState = {
    tasks: [],
}

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Omit<Task, "status" | "archivedAt">>) => {
            state.tasks.push({
                ...action.payload,
                status: "active",
            });
        },

        updateTask: (state, action: PayloadAction<{ id: string; text: string }>) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task) {
                task.text = action.payload.text;
            }
        },

        deleteTask: (state, action: PayloadAction<{ id: string }>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload.id)
        },

        archiveTask: (state, action: PayloadAction<{ id: string }>) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task && task.status === "active") {
                task.status = "archived";
                task.archivedAt = Date.now();
            }
        },

        unarchiveTask: (state, action: PayloadAction<{ id: string }>) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task && task.status === "archived") {
                task.status = "active";
                task.archivedAt = 0;
            }
        }
    }
})

export const { addTask, updateTask, deleteTask, archiveTask, unarchiveTask } = tasksSlice.actions;
export default tasksSlice.reducer;