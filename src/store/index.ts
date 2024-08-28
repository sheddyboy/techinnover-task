import { taskCategoryEnum, Tasks } from "@/db/schema";
import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";

interface Store {
  createTaskModal: boolean;
  currentTask: typeof Tasks.$inferSelect | null;
  setCurrentTask: (task: typeof Tasks.$inferSelect | null) => void;
  editTaskModal: boolean;
  boardTasks: (typeof Tasks.$inferSelect)[];
  setBoardTasks: (tasks: (typeof Tasks.$inferSelect)[]) => void;
  reorderBoardTasks: (
    tasks: (typeof Tasks.$inferSelect)[],
    currentIndex: number,
    targetIndex: number,
  ) => void;
  currentDraggingColumn: (typeof taskCategoryEnum)["enumValues"][number] | null;
  setCurrentDraggingColumn: (
    value: (typeof taskCategoryEnum)["enumValues"][number] | null,
  ) => void;
  currentDraggingTask: typeof Tasks.$inferSelect | null;
  setCurrentDraggingTask: (task: typeof Tasks.$inferSelect | null) => void;
  currentCategory: (typeof taskCategoryEnum)["enumValues"][number];
  setCreateTaskModal: ({
    category,
    showModal,
  }: {
    category: (typeof taskCategoryEnum)["enumValues"][number];
    showModal: boolean;
  }) => void;
  setEditTaskModal: ({
    category,
    showModal,
  }: {
    category: (typeof taskCategoryEnum)["enumValues"][number];
    showModal: boolean;
  }) => void;
}

const useStore = create<Store>((set) => ({
  createTaskModal: false,
  editTaskModal: false,
  currentTask: null,
  setCurrentTask: (task) => set({ currentTask: task }),
  boardTasks: [],
  setBoardTasks: (tasks) => set({ boardTasks: tasks }),
  reorderBoardTasks: (tasks, currentIndex, targetIndex) =>
    set({
      boardTasks: arrayMove(tasks, currentIndex, targetIndex),
    }),
  currentDraggingColumn: null,
  setCurrentDraggingColumn: (value) => set({ currentDraggingColumn: value }),
  currentDraggingTask: null,
  setCurrentDraggingTask: (task) => set({ currentDraggingTask: task }),
  currentCategory: "to-do",
  setCreateTaskModal: ({ category, showModal }) => {
    return set({ createTaskModal: showModal, currentCategory: category });
  },
  setEditTaskModal: ({ category, showModal }) => {
    return set({ editTaskModal: showModal, currentCategory: category });
  },
}));

export default useStore;
