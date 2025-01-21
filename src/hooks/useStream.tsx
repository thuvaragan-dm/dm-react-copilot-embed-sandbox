import { InfiniteData } from "@tanstack/react-query";
import { createEventSource, EventSourceClient } from "eventsource-client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { EMessage, MESSAGE_LIMIT, messageKey } from "../api/message/config";
import { Message } from "../api/message/types";
import { useCreateMessage } from "../api/message/useCreateMessage";
import queryClient from "../api/queryClient";
import { ETask, taskKey } from "../api/task/config";
import Error from "../components/alerts/Error";
import { API_URL } from "../configs/contants";
import { useAuth } from "../store/authStore";
import { useCopilotStore } from "../store/copilotStore";
import sleep from "../utilities/sleep";
import validateImageUrlsFromStreamData from "../utilities/validateImageUrlsFromStreamData";

export interface UseStreamOptions {
  copilot?: string;
  streamMessage: Dispatch<SetStateAction<string>>;
  streamSources: Dispatch<SetStateAction<Source[]>>;
  streamSuggestions: Dispatch<SetStateAction<Suggestion[]>>;
  streamVideos: Dispatch<SetStateAction<Video[]>>;
  done: Dispatch<SetStateAction<boolean>>;
}

export type Source = {
  id: string;
  name: string;
  object_ref: string;
};

export type Suggestion = {
  question: string;
  relevance: number;
};

export type Video = {
  video: string;
  title?: string;
  relevance: number;
};

const useStream = ({
  copilot,
  streamMessage,
  streamSources,
  streamSuggestions,
  streamVideos,
  done,
}: UseStreamOptions) => {
  const { accessToken, publicAccessToken, apiKey } = useAuth();
  const { threadId } = useCopilotStore();
  const { mutateAsync: createMessageSync } = useCreateMessage({
    useOptimistic: false,
    invalidateQueryKey: [messageKey[EMessage.FETCH_ALL]],
  });
  const [es, setEs] = useState<EventSourceClient | null>(null);
  const [jes, setJes] = useState<EventSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isStreamingRef = useRef<boolean>(false); // Ref to control streaming
  const thread_idRef = useRef<string>(""); // Ref to control streaming
  let message: string = "";
  let sources: Source[] = [];
  let suggestions: Suggestion[] = [];
  let videos: Video[] = [];
  const [numberOfTimesConnected, setNumberOfTimesConnected] = useState(0);
  const token = useRef<string>("");

  useEffect(() => {
    token.current = accessToken ?? publicAccessToken ?? apiKey ?? "";
  }, [publicAccessToken, accessToken, apiKey]);

  useEffect(() => {
    if (numberOfTimesConnected > 2) {
      stopStreaming();
      toast.custom((t) => (
        <Error
          t={t}
          title="Coudn't generate AI response."
          description="We apologize for the inconvenience. It seems we encountered an issue generating a response. Please try again shortly."
        />
      ));
    }
  }, [numberOfTimesConnected, es, token]);

  const handleStream = useCallback(
    async (query: string) => {
      message = "";
      const host = API_URL ?? "";
      const url = `${host}/copilots/${copilot}/ask?thread_id=${
        thread_idRef.current
      }&query=${encodeURIComponent(query)}&access_token=${token.current}`;

      const esc = createEventSource({
        url,
        onConnect: () => {
          setNumberOfTimesConnected((pv) => pv + 1);
        },
      });

      setEs(esc);
      isStreamingRef.current = true;
      setIsLoading(true);
      done(false);

      for await (const { data, event } of esc) {
        if (!isStreamingRef.current) break; // Stop processing if streaming is halted

        if (event === "message" || event === undefined) {
          message += data;
        }

        if (event === "sources") {
          try {
            sources = JSON?.parse(data) ?? [];
          } catch (error) {
            sources = [];
          }
        }

        if (event === "suggested_questions") {
          try {
            suggestions = JSON?.parse(data) ?? [];
          } catch (error) {
            suggestions = [];
          }
        }

        if (event === "suggested_videos") {
          try {
            // Parse and validate the incoming data
            const parsedData = JSON?.parse(data) ?? [];

            videos = parsedData;

            if (videos.length === 1) {
              // Append the single video iframe to the message
              const { video, title } = videos[0];
              message += "\n";
              message += `<hr className="mb-3" /><p className="text-xs">Suggested video</p><div className="rounded-xl -mb-5 overflow-hidden"><iframe width="100%" style="aspect-ratio: 16 / 9;flexShrink: 0;" src="${video}" title="${
                title ?? ""
              }" allowfullscreen></iframe><div>`;
              videos = [];
            }
          } catch (error) {
            console.log({ error });
            videos = [];
          }
        }

        if (data === "done") {
          break;
        }
      }

      setIsLoading(false);
      esc.close();

      if (isStreamingRef.current) {
        streamMessage(() => "");
        const { data: modifiedData } = validateImageUrlsFromStreamData(message);
        message = modifiedData;

        if (message.length > 0) {
          for (const msg of message.split(" ")) {
            if (!isStreamingRef.current) break; // Stop message processing if streaming is halted
            await sleep(0.08);
            streamMessage((pv) => pv + msg + " ");
          }
        }
      }

      if (!isStreamingRef.current) {
        const abortMessage = "<p><i>Message aborted</i></p>";
        const messages = queryClient.getQueryData<InfiniteData<Message[]>>([
          messageKey[EMessage.FETCH_ALL],
          { limit: MESSAGE_LIMIT, thread_id: threadId },
        ]);

        if (message.length > 0) {
          queryClient.setQueryData<InfiniteData<Message[]>>(
            [
              messageKey[EMessage.FETCH_ALL],
              { limit: MESSAGE_LIMIT, thread_id: threadId },
            ],
            () => {
              const lastPage = messages?.pages[messages.pages.length - 1];
              if (lastPage) {
                const lastMessage = lastPage[lastPage.length - 1];

                createMessageSync({
                  body: {
                    ...lastMessage,
                    message: (lastMessage.message += " " + abortMessage),
                  },
                });

                lastPage[lastPage.length - 1] = lastMessage;

                messages.pages[messages.pages.length - 1] = lastPage;
              }
              return messages;
            }
          );
        }
      }

      if (isStreamingRef.current) {
        if (message.length > 0) {
          streamSources(sources);
          streamSuggestions(suggestions);
          streamVideos(videos);
          await createMessageSync({
            body: {
              thread_id: thread_idRef.current,
              message,
              sender: "BOT",
              sources: sources,
              flag: "",
            },
          });
          queryClient.refetchQueries({
            queryKey: [
              messageKey[EMessage.FETCH_ALL],
              {
                limit: MESSAGE_LIMIT,
                thread_id: threadId,
              },
            ],
          });
        }
      }

      done(true);
      setEs(null);
      setJes(null);
      isStreamingRef.current = false;
    },
    [copilot, token]
  );

  const startStreaming = useCallback(
    (thread_id: string, q: string) => {
      thread_idRef.current = thread_id;
      if (!isStreamingRef.current) handleStream(q);
    },
    [handleStream]
  );

  const stopStreaming = useCallback(async () => {
    if (es) {
      isStreamingRef.current = false; // Update the ref to stop the stream
      es.close();
      jes?.close();
      setEs(null); // Reset EventSourceClient state
      done(true);
      setNumberOfTimesConnected(0);

      //refetch
      await queryClient.refetchQueries({
        queryKey: [
          messageKey[EMessage.FETCH_ALL],
          { limit: MESSAGE_LIMIT, thread_id: threadId },
        ],
      });
      await queryClient.refetchQueries({
        queryKey: [taskKey[ETask.FETCH_ALL], { thread_id: threadId }],
      });
    }
  }, [es, jes]);

  useEffect(() => {
    // Cleanup function to close the EventSource when the component unmounts
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  return { startStreaming, stopStreaming, isLoading };
};

export default useStream;
