import { useApi } from "../../providers/ApiProvider";
import { useCreateMutation } from "../apiFactory";

export const useDeleteDocument = ({ id }: { id: string }) => {
  const { apiClient } = useApi();

  return useCreateMutation<Record<string, any>, unknown, unknown, unknown[]>({
    apiClient,
    method: "delete",
    url: `/documents/${id}`,
    errorMessage: "Failed to delete document.",
    mutationOptions: {},
  });
};
