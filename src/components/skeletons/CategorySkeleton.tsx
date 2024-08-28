import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import TaskCardSkeleton from "@/components/skeletons/TaskCardSkeleton";

interface CategorySkeletonProps {
  numberOfTasks: number;
}

const CategorySkeleton = ({ numberOfTasks }: CategorySkeletonProps) => {
  return (
    <div className="shadow-custom2 mb-auto flex max-h-full w-[352px] shrink-0 flex-col gap-4 rounded-[8px] bg-[#F5F7F9] px-[8px] py-[12px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[24px] w-[90px] bg-white" />
          <Skeleton className="h-[24px] w-[24px] bg-white" />
        </div>
        <Skeleton className="h-[24px] w-[24px] bg-white" />
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-auto">
        {Array.from({ length: numberOfTasks }).map((_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CategorySkeleton;
