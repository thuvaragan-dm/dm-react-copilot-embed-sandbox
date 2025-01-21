import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../api/queryClient";

export default function QueryProvider({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: unknown;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
