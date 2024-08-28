"use client";
import Category from "@/components/Category";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddTaskForm from "@/components/AddTaskForm";
import useStore from "@/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserTasks, updateTask } from "@/actions/task";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import TaskCard from "@/components/TaskCard";
import { useEffect, useMemo, useState } from "react";
import { taskCategoryEnum } from "@/db/schema";
import EditTaskForm from "@/components/EditTaskForm";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface TasksWrapperProps {}

const TasksWrapper = ({}: TasksWrapperProps) => {
  const {
    data: { data: tasksData, error: tasksError },
  } = useSuspenseQuery({
    queryKey: ["tasks"],
    queryFn: () => getUserTasks(),
  });
  const [columns, setColumns] = useState<
    (typeof taskCategoryEnum)["enumValues"]
  >(["to-do", "in-progress", "completed"]);
  const [boardTasks, setBoardTasks] = useState(tasksData ? tasksData : []);
  const columnsIds = useMemo(() => columns.map((column) => column), [columns]);
  const {
    createTaskModal,
    editTaskModal,
    setEditTaskModal,
    setCreateTaskModal,
    currentCategory,
    currentDraggingColumn,
    currentDraggingTask,
    setCurrentDraggingColumn,
    setCurrentDraggingTask,
  } = useStore();
  useEffect(() => {
    setBoardTasks(tasksData ?? []);
  }, [tasksData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 30 },
    }),
  );
  function handleDragStart(e: DragStartEvent) {
    if (e.active.data.current?.type === "Column") {
      return setCurrentDraggingColumn(e.active.data.current.columnName ?? null);
    }
    if (e.active.data.current?.type === "Task") {
      setCurrentDraggingTask(e.active.data.current.task);
    }
  }
  async function handleDragEnd(e: DragEndEvent) {
    setCurrentDraggingColumn(null);
    setCurrentDraggingTask(null);
    console.log("e", e);
    if (e.active.data.current?.type === "Task") {
      const { data, error } = await updateTask(e.active.data.current.task);
      console.log({ data, error });
    }
  }

  function handleDragOver(e: DragOverEvent) {
    const isActiveTypeTask = e.active.data.current?.type === "Task";
    const isOverTypeTask = e.over?.data.current?.type === "Task";
    const isOverTypeColumn = e.over?.data.current?.type === "Column";
    const isActiveTypeColumn = e.active.data.current?.type === "Column";
    if (isActiveTypeTask && isOverTypeTask) {
      return setBoardTasks((prev) => {
        const activeTaskIndex = prev.findIndex(
          (task) => task.id === e.active.id,
        );
        const overTaskIndex = prev.findIndex((task) => task.id === e.over?.id);
        prev[activeTaskIndex].category = prev[overTaskIndex].category;
        return arrayMove(prev, activeTaskIndex, overTaskIndex);
      });
    } else if (isActiveTypeTask && isOverTypeColumn) {
      return setBoardTasks((prev) => {
        const dummyTasks = [...prev];
        const activeTaskIndex = prev.findIndex(
          (task) => task.id === e.active.id,
        );
        dummyTasks[activeTaskIndex].category = e.over?.data.current!.columnName;
        return dummyTasks;
      });
    } else if (isActiveTypeColumn && isOverTypeColumn) {
      return setColumns((prev) => {
        const activeColumnIndex = prev.findIndex(
          (column) => column === e.active.id,
        );
        const overColumnIndex = prev.findIndex(
          (column) => column === e.over?.id,
        );
        return arrayMove(prev, activeColumnIndex, overColumnIndex) as any;
      });
    } else if (isActiveTypeColumn && isOverTypeTask) {
      return setColumns((prev) => {
        const activeColumnIndex = prev.findIndex(
          (column) => column === e.active.id,
        );
        const overColumnIndex = prev.findIndex(
          (column) => column === e.over?.data.current!.task.category,
        );
        return arrayMove(prev, activeColumnIndex, overColumnIndex) as any;
      });
    }
  }
  return (
    <>
      <Navbar tasks={tasksData} setBoardTasks={setBoardTasks} />
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext items={columnsIds}>
          <div className="flex flex-1 gap-4 overflow-auto px-[38px] pb-[24px]">
            {columns.map((column) => (
              <Category
                key={column}
                name={column}
                tasks={boardTasks.filter(({ category }) => category === column)}
              />
            ))}
            <Dialog
              open={createTaskModal}
              onOpenChange={(value) => {
                setCreateTaskModal({
                  showModal: value,
                  category: currentCategory,
                });
              }}
            >
              <DialogContent className="max-h-full gap-0 overflow-auto rounded-none pb-[60px] pt-[40px]">
                <div className="mb-[32px] flex items-center justify-between">
                  <span className="font-sfProText text-[24px] font-semibold leading-[32px] text-[#1A1919]">
                    Add Task
                  </span>
                  <Button
                    variant={"link"}
                    className="h-auto p-0"
                    onClick={() => {
                      setCreateTaskModal({
                        showModal: false,
                        category: currentCategory,
                      });
                    }}
                  >
                    <Image
                      alt="close-icon"
                      src={"/icons/close-icon.svg"}
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
                <AddTaskForm />
              </DialogContent>
            </Dialog>
            <Dialog
              open={editTaskModal}
              onOpenChange={(value) => {
                setEditTaskModal({
                  showModal: value,
                  category: currentCategory,
                });
              }}
            >
              <DialogContent className="max-h-full gap-0 overflow-auto rounded-none pb-[60px] pt-[40px]">
                <div className="mb-[32px] flex items-center justify-between">
                  <span className="font-sfProText text-[24px] font-semibold leading-[32px] text-[#1A1919]">
                    Edit Task
                  </span>
                  <Button
                    variant={"link"}
                    className="h-auto p-0"
                    onClick={() => {
                      setEditTaskModal({
                        showModal: false,
                        category: currentCategory,
                      });
                    }}
                  >
                    <Image
                      alt="close-icon"
                      src={"/icons/close-icon.svg"}
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
                <EditTaskForm />
              </DialogContent>
            </Dialog>
          </div>
        </SortableContext>
        {
          <DragOverlay>
            {currentDraggingColumn && (
              <Category
                name={currentDraggingColumn}
                tasks={
                  tasksData
                    ? tasksData.filter(
                        ({ category }) => category === currentDraggingColumn,
                      )
                    : []
                }
              />
            )}
            {currentDraggingTask && <TaskCard task={currentDraggingTask} />}
          </DragOverlay>
        }
      </DndContext>
    </>
  );
};

export default TasksWrapper;
