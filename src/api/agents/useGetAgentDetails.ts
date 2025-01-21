import { useApi } from "../../providers/ApiProvider";
import { useCreateQuery } from "../apiFactory";
import { EAgents, agentsKey } from "./config";
import { Agent } from "./types";

export const useGetAgentDetails = (id: string) => {
  const { apiClient } = useApi();

  return useCreateQuery<Agent>({
    queryKey: agentsKey[EAgents.FETCH_SINGLE] + id,
    apiClient,
    url: `/copilots/${id}`,
    errorMessage: "Failed to fetch agent.",
    queryOptions: {
      enabled: !!id,
    },
  });
};
