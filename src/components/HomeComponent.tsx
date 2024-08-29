"use client";
import TasksWrapper from "@/components/TasksWrapper";
import { Suspense, useState } from "react";
import TasksWrapperSkeleton from "@/components/skeletons/TasksWrapperSkeleton";
import SideBar from "@/components/SideBar";
import { motion } from "framer-motion";
import useStore from "@/store";

interface HomeComponentProps {}

const HomeComponent = ({}: HomeComponentProps) => {
  const { sideBarWidth } = useStore();
  return (
    <>
      <motion.div
        animate={{
          flexBasis: sideBarWidth,
        }}
        className="overflow-auto"
      >
        <SideBar />
      </motion.div>
      <div className="flex h-full flex-1 flex-col gap-[47px] overflow-hidden pt-[40px]">
        <Suspense fallback={<TasksWrapperSkeleton numberOfColumns={3} />}>
          <TasksWrapper />
        </Suspense>
      </div>
    </>
  );
};

export default HomeComponent;
