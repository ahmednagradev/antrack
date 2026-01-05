import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Task = {
    id: string;
    text: string;
    createdAt: number;
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
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },

        updateTask: (state, action: PayloadAction<Task>) => {
            const task = state.tasks.find(task => task.id === action.payload.id)
            if (task) {
                task.text = action.payload.text;
            }
        },

        deleteTask: (state, action: PayloadAction<Task>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload.id)
        },
    }
})

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;

