import { useCreateQuery } from "../apiFactory";
import { Task } from "./types";
import { ETask, taskKey } from "./config";
import { useApi } from "../../providers/ApiProvider";

export const useGetTasks = ({ thread_id }: { thread_id: string }) => {
  const { apiClient } = useApi();

  return useCreateQuery<Task[]>({
    queryKey: taskKey[ETask.FETCH_ALL] + thread_id,
    apiClient,
    url: `/threads/${thread_id}/tasks`,
    errorMessage: "Failed to fetch entity.",
    queryOptions: {
      enabled: !!thread_id,
    },
  });
};
