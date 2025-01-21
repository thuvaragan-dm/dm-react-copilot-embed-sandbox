import { Document, GetDocumentParams } from "./types";
import { EDocument, documentKey } from "./config";
import { useCreateQuery } from "../apiFactory";
import { useApi } from "../../providers/ApiProvider";

export const useGetDocument = (id: string, params?: GetDocumentParams) => {
  const { apiClient } = useApi();

  return useCreateQuery<Document>({
    queryKey: documentKey[EDocument.FETCH_SINGLE] + id,
    apiClient,
    url: `/documents/${id}`,
    errorMessage: "Failed to fetch document.",
    queryOptions: {
      enabled: !!id,
    },
    queryParams: params,
  });
};
