import { createInfiniteQueryHook } from "../apiFactory";
import { Message } from "./types";
import { useApi } from "../../providers/ApiProvider";

export const useGetMessages = (thread_id?: string) => {
  const { apiClient } = useApi();

  return createInfiniteQueryHook<Message[]>(apiClient, {
    url: `/threads/${thread_id}/messages`,
    errorMessage: "Failed to fetch messages.",
    isNotId: !thread_id,
    fallbackContent: [],
  });
};
