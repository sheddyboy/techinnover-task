import CategorySkeleton from "@/components/skeletons/CategorySkeleton";
import Navbar from "@/components/Navbar";

interface TasksWrapperSkeletonProps {
  numberOfColumns: number;
}

const TasksWrapperSkeleton = ({
  numberOfColumns,
}: TasksWrapperSkeletonProps) => {
  return (
    <>
      <Navbar tasks={null} />
      <div className="flex flex-1 gap-4 overflow-auto px-[38px] pb-[24px]">
        {Array.from({ length: numberOfColumns }).map((_, index) => (
          <CategorySkeleton key={index} numberOfTasks={6} />
        ))}
      </div>
    </>
  );
};

export default TasksWrapperSkeleton;
