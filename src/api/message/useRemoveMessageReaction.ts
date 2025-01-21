import { InfiniteData } from "@tanstack/react-query";
import { useApi } from "../../providers/ApiProvider";
import { useCreateMutation } from "../apiFactory";
import { Message, ReactionInput } from "./types";

export const useRemoveMessageReaction = ({
  id,
  invalidateQueryKey,
}: {
  id: string;
  invalidateQueryKey?: unknown[];
}) => {
  const { apiClient } = useApi();

  return useCreateMutation<
    Record<string, any>,
    ReactionInput,
    Message,
    InfiniteData<Message>
  >({
    apiClient,
    method: "delete",
    url: `/messages/${id}/reactions`,
    errorMessage: "Failed to remove reaction.",
    invalidateQueryKey,
    mutationOptions: {},
    optimisticUpdate: (oldMessages) => {
      if (oldMessages) {
        const up = oldMessages?.pages.flat(1).map((message) => {
          if (message.id === id) {
            message.reaction = null;
          }
          return message;
        });
        return { ...oldMessages, ...up };
      } else {
        return oldMessages;
      }
    },
  });
};
