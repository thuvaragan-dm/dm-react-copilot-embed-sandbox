import { InfiniteData } from "@tanstack/react-query";
import { useApi } from "../../providers/ApiProvider";
import { useCreateMutation } from "../apiFactory";
import { Message, ReactionInput } from "./types";

export const useAddMessageReaction = ({
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
    method: "post",
    url: `/messages/${id}/reactions`,
    errorMessage: "Failed to add reaction.",
    invalidateQueryKey,
    optimisticUpdate: (oldMessages, variables) => {
      if (oldMessages) {
        const up = oldMessages?.pages.flat(1).map((message) => {
          if (message.id === id) {
            message.reaction = variables.reaction_type;
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
