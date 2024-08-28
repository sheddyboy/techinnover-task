import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Flag from "@/components/Flag";
import { Skeleton } from "../ui/skeleton";

interface TaskCardSkeletonProps {}

const TaskCardSkeleton = ({}: TaskCardSkeletonProps) => {
  return (
    <Card className="rounded-[6px]">
      <CardContent className="flex flex-col gap-4 p-4">
        <Skeleton className="mr-auto h-[20px] w-[42px]" />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-[24px] w-[162px]" />
            <Skeleton className="h-[24px] w-[24px]" />
          </div>
          <Skeleton className="h-[118px] w-full" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-[6px] w-full" key={index} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-[24px] w-[24px]" />
            <Skeleton className="h-[10px] w-[80px]" />
          </div>
          <Skeleton className="h-[10px] w-[45px]" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCardSkeleton;
