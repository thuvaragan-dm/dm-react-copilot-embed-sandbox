import { create } from "zustand";
import { Task } from "../api/task/types";

interface TaskState {
  tasks: Task[];
  actions: {
    setTasks: (value: Task[] | ((value: Task[]) => Task[])) => void;
  };
}

export const useTasksStore = create<TaskState>()((set) => ({
  tasks: [],
  actions: {
    setTasks: (value) =>
      set((state) => ({
        tasks: typeof value === "function" ? value(state.tasks) : value,
      })),
  },
}));

export const useTasks = () => useTasksStore((state) => state.tasks);

export const useTasksActions = () => useTasksStore((state) => state.actions);
