import { getQueryClient } from "@/lib/reactQuery";
import { getUserTasks } from "@/actions/task";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import HomeComponent from "@/components/HomeComponent";

export default function Home() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: () => getUserTasks(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex h-dvh">
        <HomeComponent />
      </main>
    </HydrationBoundary>
  );
}
