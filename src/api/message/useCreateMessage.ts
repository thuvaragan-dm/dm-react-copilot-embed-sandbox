import { nanoid } from "nanoid";
import { useApi } from "../../providers/ApiProvider";
import { useCreateMutation } from "../apiFactory";
import { Message, MessageInput, Sender } from "./types";
import { InfiniteData } from "@tanstack/react-query";

export const useCreateMessage = ({
  invalidateQueryKey,
  useOptimistic = true,
}: {
  invalidateQueryKey?: unknown[];
  useOptimistic?: boolean;
}) => {
  const { apiClient } = useApi();

  return useCreateMutation<
    Record<string, any>,
    MessageInput,
    Message,
    InfiniteData<Message[]>
  >({
    apiClient,
    method: "post",
    url: "/messages",
    errorMessage: "Failed to create a message.",
    invalidateQueryKey,
    mutationOptions: {},
    optimisticUpdate: (oldMessages, newData) => {
      if (useOptimistic) {
        if (oldMessages) {
          const newMessage: Message = {
            id: nanoid(10),
            thread_id: newData.thread_id,
            message: newData.message,
            sender: newData.sender.toLowerCase() as Sender,
            flag: null,
            sources: [],
            reaction: null,
          };
          oldMessages.pages[oldMessages.pages.length - 1].push(newMessage);

          return oldMessages;
        }
      } else {
        return oldMessages;
      }
    },
  });
};
