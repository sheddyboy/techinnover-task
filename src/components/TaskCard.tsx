import { Card, CardContent } from "@/components/ui/card";
import Flag from "@/components/Flag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Tasks } from "@/db/schema";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import useStore from "@/store";
import { toast } from "sonner";
import { deleteTask } from "@/actions/task";
import { getQueryClient } from "@/lib/reactQuery";

interface TaskCardProps {
  task: typeof Tasks.$inferSelect;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const queryClient = getQueryClient();
  const { setCurrentTask, setEditTaskModal } = useStore();
  const [menuToggle, setMenuToggle] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const isOverdue = task.deadline < new Date();
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${isDragging && "animate-pulse opacity-25 active:cursor-grabbing"} cursor-grab rounded-[6px]`}
    >
      <CardContent className="flex flex-col gap-4 p-4">
        <Badge variant={task.priority} className="mr-auto">
          {task.priority === "high"
            ? "High"
            : task.priority === "medium"
              ? "Medium"
              : "Low"}
        </Badge>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-sfProText text-[16px] font-medium leading-[24px] text-[#1A1919]">
              {task.name}
            </span>
            <Popover open={menuToggle} onOpenChange={setMenuToggle}>
              <PopoverTrigger asChild>
                <Button
                  variant={"link"}
                  className="h-auto p-0"
                  onClick={() => {
                    setCurrentTask(task);
                  }}
                >
                  <Image
                    alt="card-menu-icon"
                    src={"/icons/card-menu-icon.svg"}
                    width={24}
                    height={24}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col items-start gap-2 rounded-[6px] border border-[#D0D5DD] px-[12px] py-[8px]">
                <Button
                  onClick={() => {
                    setMenuToggle(false);
                    setEditTaskModal({
                      category: task.category,
                      showModal: true,
                    });
                  }}
                  variant={"link"}
                  className="h-auto p-0 text-[12px] font-normal leading-[15px] tracking-[-0.006em] text-[#252C32] opacity-[0.75] hover:no-underline"
                >
                  Edit
                </Button>
                <Button
                  onClick={async () => {
                    setMenuToggle(false);
                    toast.promise(deleteTask(task.id), {
                      loading: "Deleting task...",
                      success: async ({ data, error }) => {
                        if (error) {
                          throw error;
                        }
                        await queryClient.invalidateQueries({
                          queryKey: ["tasks"],
                        });
                        return "Task deleted";
                      },
                      error: (error) => {
                        return `${error.message}`;
                      },
                    });
                  }}
                  variant={"link"}
                  className="h-auto p-0 text-[12px] font-normal leading-[15px] tracking-[-0.006em] text-[#E60C02] opacity-[0.75] hover:no-underline"
                >
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
          </div>
          {task.image && (
            <Image
              alt="task-image"
              src={task.image ?? ""}
              className="max-h-[125px] overflow-hidden rounded-[4px] object-cover object-center"
              width={304}
              height={125}
            />
          )}
          <span className="text-[14px] font-normal leading-[140%] -tracking-[0.006em] text-[#252C32] opacity-[0.75]">
            {task.description}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag
              type={
                task.category === "completed"
                  ? "green"
                  : isOverdue
                    ? "red"
                    : "grey"
              }
            />
            <span className="text-[12px] font-medium leading-[20px] text-[#6E7C87]">
              {task.deadline ? format(task.deadline, "MMM do yyyy") : ""}
            </span>
          </div>
          <span className="text-[12px] font-medium leading-[24px] text-[#6F6F6F]">
            {task.deadline ? format(task.deadline, "h:mm a") : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
