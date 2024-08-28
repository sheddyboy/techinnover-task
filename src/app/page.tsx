"use client";
import SideBar from "@/components/SideBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TasksWrapper from "@/components/TasksWrapper";
import { Suspense } from "react";
import TasksWrapperSkeleton from "@/components/skeletons/TasksWrapperSkeleton";

export default function Home() {
  return (
    <main className="flex h-dvh">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}>
          <SideBar />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full flex-1 flex-col gap-[47px] overflow-hidden pt-[40px]">
            <Suspense fallback={<TasksWrapperSkeleton numberOfColumns={3} />}>
              <TasksWrapper />
            </Suspense>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
