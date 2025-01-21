import { useApi } from "../../providers/ApiProvider";
import { PaginatedResult } from "../../types/type-utils";
import { useCreateQuery } from "../apiFactory";
import { EAgents, agentsKey } from "./config";
import { Agent, GetAgentParam } from "./types";

export const useGetAgents = (params: GetAgentParam) => {
  const { apiClient } = useApi();

  return useCreateQuery<PaginatedResult<Agent>>({
    queryKey: agentsKey[EAgents.FETCH_ALL],
    apiClient,
    url: "/copilots/",
    errorMessage: "Failed to fetch agents.",
    queryParams: params,
  });
};
