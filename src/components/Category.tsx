"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import TaskCard from "@/components/TaskCard";
import useStore from "@/store";
import { taskCategoryEnum, Tasks } from "@/db/schema";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import useIsMobile from "@/hooks/useIsMobile";

interface CategoryProps {
  name: (typeof taskCategoryEnum)["enumValues"][number];
  tasks: (typeof Tasks.$inferSelect)[];
}

const Category = ({ name, tasks }: CategoryProps) => {
  const isMobile = useIsMobile();
  const tasksIds = useMemo(() => tasks.map(({ id }) => id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: name,
    data: {
      type: "Column",
      columnName: name,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const { setCreateTaskModal, setCurrentTask } = useStore();
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging && "animate-pulse opacity-25"} mb-auto flex h-full w-[352px] shrink-0 flex-col gap-4 rounded-[8px] bg-[#F5F7F9] px-[8px] py-[12px] shadow-custom2`}
    >
      <div
        {...(!isMobile ? { ...attributes, ...listeners } : {})}
        className={"flex cursor-grab items-center justify-between"}
      >
        <div className="flex items-center gap-2">
          <span className="font-inter text-[16px] font-medium leading-[24px] text-[#6F6F6F]">
            {name === "in-progress"
              ? "In progress"
              : name === "completed"
                ? "Completed"
                : "To do"}
          </span>
          <Badge>{tasks.length}</Badge>
        </div>
        <Button
          variant={"link"}
          className="h-auto p-0"
          onClick={() => {
            setCurrentTask(null);
            setCreateTaskModal({ category: name, showModal: true });
          }}
        >
          <Image
            alt="add-icon"
            className="shrink-0"
            src={"/icons/add-icon.svg"}
            width={24}
            height={24}
          />
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Category;
