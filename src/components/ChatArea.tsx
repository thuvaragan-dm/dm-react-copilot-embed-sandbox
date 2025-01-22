import { InfiniteData } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  IoChatboxOutline,
  IoClipboardOutline,
  IoDocument,
  IoFileTray,
  IoImage,
} from "react-icons/io5";
import { useGetAgents } from "../api/agents/useGetAgents";
import { EMessage, MESSAGE_LIMIT, messageKey } from "../api/message/config";
import { Message, Source } from "../api/message/types";
import { useCreateMessage } from "../api/message/useCreateMessage";
import { useGetMessages } from "../api/message/useGetMessages";
import queryClient from "../api/queryClient";
import { EThread, threadKey } from "../api/thread/config";
import { useCreateThread } from "../api/thread/useCreateThread";
import cookieKeys from "../configs/cookieKeys";
import useFileUpload from "../hooks/useFileUpload";
import useStream, { UseStreamOptions } from "../hooks/useStream";
import { useChatInputStore } from "../store/chatInputStore";
import { useCopilotStore } from "../store/copilotStore";
import capitalizeFirstLetter from "../utilities/capitalizeFirstLetter";
import Avatar from "./Avatar";
import BlurWrapper from "./BlurWrapper";
import ChatInput from "./ChatInput";
import ChatResponse from "./ChatResponse";
import Spinner from "./Spinner";
import UserMessage from "./UserMessage";

const ChatArea = ({ copilot }: { copilot: string }) => {
  const {
    actions: { setCopilots },
  } = useCopilotStore();

  const { data: agents } = useGetAgents({
    page: 1,
    records_per_page: 100,
  });

  useEffect(() => {
    if (agents) {
      setCopilots(agents.items);
    }
  }, [agents]);

  const {
    selectedCopilot,
    copilots,
    threadId,
    actions: { setSelectedCopilot, setThreadId },
  } = useCopilotStore();

  // Effect: Set selected copilot from URL params
  useEffect(() => {
    if (copilot && copilots && copilots.length > 0) {
      const selected = copilots.find((cp) => cp.path === copilot);
      const copilotToSet = selected || copilots?.[0];
      setSelectedCopilot(copilotToSet);
      Cookies.set(
        cookieKeys.PREVIOUSLY_SELECTED_COPILOT,
        JSON.stringify(copilotToSet)
      );
    }
  }, [copilot, copilots, agents]);

  // Chat input state and actions
  const { files, fileData, suggestions, videos } = useChatInputStore();
  const {
    actions: { setQuery, setSuggestions, setVideos, setFiles, setFileData },
  } = useChatInputStore();

  // UI and streaming states
  const [streamMessage, setStreamMessage] = useState<string>("");
  const [sources, setSources] = useState<Source[]>([]);
  const [streamingDone, setStreamingDone] = useState(true);
  const [
    isInitialThreadAndMessageCreationLoading,
    setIsInitialThreadAndMessageCreationLoading,
  ] = useState(false);

  const [isUserScroll, setIsUserScroll] = useState(false);

  const chatContainerRef = useRef<HTMLUListElement>(null);

  // Custom hook and file upload props
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    isFileUploadLoading,
  } = useFileUpload();

  // Fetch messages and tasks
  const { data: messages, isPending: isMessagesLoading } = useGetMessages(
    threadId || ""
  )(messageKey[EMessage.FETCH_ALL], {
    limit: MESSAGE_LIMIT,
    thread_id: threadId,
  });

  // Memoized stream options
  const streamOptions = useMemo<UseStreamOptions>(
    () => ({
      streamMessage: setStreamMessage,
      streamSources: setSources,
      streamSuggestions: setSuggestions,
      streamVideos: setVideos,
      done: setStreamingDone,
      copilot: selectedCopilot?.id,
    }),
    [selectedCopilot]
  );

  // Stream handlers
  const {
    startStreaming,
    stopStreaming,
    isLoading: isStreamLoading,
  } = useStream(streamOptions);

  // Query mutation keys
  const { mutateAsync: createThread } = useCreateThread({
    invalidateQueryKey: [threadKey[EThread.FETCH_ALL]],
  });

  const { mutateAsync: createMessage } = useCreateMessage({
    invalidateQueryKey: [
      messageKey[EMessage.FETCH_ALL],
      { limit: MESSAGE_LIMIT, thread_id: threadId },
    ],
  });

  // Effect: Update message data with streaming content
  const TEMP_ID = "tempId";
  useEffect(() => {
    queryClient.setQueryData<InfiniteData<Message[]>>(
      [
        messageKey[EMessage.FETCH_ALL],
        { limit: MESSAGE_LIMIT, thread_id: threadId },
      ],
      (oldData) => {
        if (oldData) {
          const lastPage = oldData.pages[oldData.pages.length - 1];
          const tempMessageIndex =
            lastPage?.findIndex((p) => p.id === TEMP_ID) ?? -1;

          if (tempMessageIndex > -1) {
            lastPage?.forEach((m) => {
              if (m.id === TEMP_ID) {
                m.message = streamMessage;
                m.sources = sources;
              }
            });
          } else {
            lastPage?.push({
              id: TEMP_ID,
              thread_id: threadId || "",
              message: streamMessage,
              sender: "BOT",
              flag: "",
              sources: sources,
              reaction: null,
            });
          }

          return oldData;
        }
      }
    );
  }, [streamMessage, sources]);

  useEffect(() => {
    if (!isUserScroll) {
      chatContainerRef.current?.scrollBy({
        top:
          chatContainerRef.current.scrollHeight -
          chatContainerRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  }, [streamMessage, chatContainerRef, isUserScroll]);

  // Effect: Scroll chat container on new messages
  useEffect(() => {
    setTimeout(() => {
      chatContainerRef.current?.scrollBy({
        top:
          chatContainerRef.current.scrollHeight -
          chatContainerRef.current.clientHeight,
        behavior: "smooth",
      });
    }, 1);
  }, [messages, chatContainerRef]);

  // Handles submitting a chat message
  const handleSubmit = async (q: string) => {
    try {
      setSuggestions([]);
      setVideos([]);
      let message = q;

      // Append file data if available
      if (fileData && files.length > 0) {
        message += ` <span className="hidden">document id:${fileData.id} document name:${fileData.name}</span>`;
      }

      // Handle existing or new thread creation
      if (threadId) {
        await createMessage({
          body: {
            message,
            sender: "USER",
            thread_id: threadId || "",
            sources,
            flag: "",
          },
        });
        startStreaming(threadId || "", message);
      } else {
        setIsInitialThreadAndMessageCreationLoading(true);
        const result = await createThread({
          body: {
            title: "New chat",
            copilot_id: selectedCopilot?.id || "",
          },
        });

        setThreadId(result.id);
        Cookies.set(cookieKeys.THREAD_ID, JSON.stringify(result.id));

        await createMessage({
          body: {
            message,
            sender: "USER",
            thread_id: result.id,
            sources,
            flag: "",
          },
        });
        startStreaming(result.id, message);
      }

      setFileData(null);
      setFiles([]);
    } catch (error) {
      stopStreaming();
      setFileData(null);
      setFiles([]);
    } finally {
      setIsInitialThreadAndMessageCreationLoading(false);
    }
  };

  return (
    <div
      {...getRootProps()}
      className="relative flex h-full w-full flex-1 flex-col"
    >
      <section className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-gray-100 @container">
        {isMessagesLoading || isInitialThreadAndMessageCreationLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner size={"sm"} />
          </div>
        ) : (
          <>
            {/* Empty State */}
            <AnimatePresence mode="popLayout" initial={false}>
              {messages &&
                messages.pages.flat(1).length <= 0 &&
                selectedCopilot && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex flex-1 flex-col"
                  >
                    <BlurWrapper
                      className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-20 md:py-10"
                      Key={selectedCopilot.name}
                    >
                      {/* Title */}
                      <div className="flex flex-col items-center justify-center px-5">
                        {/* logo */}
                        <div className={"relative size-16 rounded-full"}>
                          <div className="absolute inset-0 z-10 animate-pulse rounded-full bg-skin-secondary"></div>
                          <div className="relative z-20">
                            <Avatar
                              Fallback={() => (
                                <Avatar.Fallback className="size-16 bg-skin-secondary">
                                  {selectedCopilot.name[0]}{" "}
                                  {selectedCopilot.name[1]}
                                </Avatar.Fallback>
                              )}
                              className="size-16"
                              src={selectedCopilot.avatar || ""}
                            />
                          </div>
                        </div>
                        {/* logo */}

                        <h1 className="mt-3 text-center text-xl font-semibold text-gray-800">
                          Hello! 👋 I&apos;m{" "}
                          {capitalizeFirstLetter(selectedCopilot.name)}, here to
                          help you
                        </h1>

                        <p className="mt-2 max-w-xs text-center text-sm text-gray-600">
                          How can I assist you today?{" "}
                          {selectedCopilot.metadata_fields &&
                            selectedCopilot.metadata_fields
                              ?.default_questions &&
                            selectedCopilot.metadata_fields.default_questions
                              ?.length > 0 && (
                              <span>
                                Feel free to use one of my prefilled options
                                below.
                              </span>
                            )}
                        </p>
                      </div>

                      {/* prefilled suggestions */}
                      {selectedCopilot.metadata_fields && (
                        <div className="scrollbar mx-auto mt-10 flex w-full max-w-3xl items-start justify-start gap-5 overflow-x-auto pb-5">
                          {selectedCopilot.metadata_fields.default_questions?.map(
                            (questionObj, idx) => (
                              <button
                                onClick={() => {
                                  setQuery(questionObj.question);
                                  handleSubmit(questionObj.question);
                                  setQuery("");
                                }}
                                key={idx}
                                className="flex h-full min-h-32 w-full min-w-44 items-start justify-start rounded-xl border bg-white p-5 text-left transition-colors duration-200 hover:bg-skin-secondary/20 data-[pressed]:bg-skin-secondary/20 md:p-5"
                              >
                                <div className="flex h-full w-full flex-col items-start justify-start">
                                  {/* TODO: Check for question type  */}
                                  {true ? (
                                    <IoChatboxOutline className="size-5 flex-shrink-0 text-skin-primary" />
                                  ) : (
                                    <IoClipboardOutline className="size-5 flex-shrink-0 text-skin-primary" />
                                  )}

                                  <p className="mt-3 line-clamp-3 text-xs font-medium text-gray-600">
                                    {questionObj.question}
                                  </p>
                                </div>
                              </button>
                            )
                          )}
                        </div>
                      )}
                      {/* prefilled suggestions */}
                    </BlurWrapper>
                  </motion.div>
                )}
            </AnimatePresence>
            {/* Empty State */}

            {/* messages */}
            {messages && messages.pages.flat(1).length > 0 && (
              <ul
                ref={chatContainerRef}
                onWheel={(e) => {
                  const scrollableEl = chatContainerRef.current;
                  if (!scrollableEl) return;

                  const maxScrollHeight =
                    chatContainerRef.current.scrollHeight -
                    chatContainerRef.current.clientHeight;

                  if (e.deltaY < 0) {
                    setIsUserScroll(true);
                  } else if (scrollableEl.scrollTop === maxScrollHeight) {
                    setIsUserScroll(false);
                  }
                }}
                className={`scrollbar  w-full flex-1 overflow-y-auto @container`}
              >
                <div className="mx-auto w-full max-w-3xl space-y-3 p-5">
                  {messages.pages.map((messageArray) =>
                    messageArray.map((message, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          default: { duration: 0.15 },
                          layout: {
                            type: "spring",
                            bounce: 0.4,
                            duaration: 1,
                          },
                        }}
                        className="flex"
                        style={{
                          originX: message.sender === "user" ? 1 : 0,
                        }}
                      >
                        <div
                          className={`flex w-full items-end gap-2 ${
                            message.sender === "user"
                              ? "justify-end"
                              : "flex-row-reverse justify-start"
                          } `}
                        >
                          {message.sender === "user" ? (
                            <UserMessage message={message.message} />
                          ) : (
                            <ChatResponse message={message} />
                          )}
                        </div>
                      </motion.li>
                    ))
                  )}

                  <AnimatePresence>
                    {isStreamLoading && (
                      <motion.div
                        initial={{ filter: "blur(10px)", opacity: 0 }}
                        animate={{ filter: "blur(0px)", opacity: 1 }}
                        exit={{ filter: "blur(10px)", opacity: 0 }}
                        className=""
                      >
                        <div
                          className={
                            "group relative transition-shadow duration-500 ease-out [--bg-size:500%]"
                          }
                        >
                          <span
                            className={
                              "flex animate-gradient items-center gap-2 bg-gradient-to-r from-from-skin-gradient-from via-via-skin-gradient-via to-to-skin-gradient-to bg-[length:var(--bg-size)_100%] bg-clip-text text-lg font-medium text-transparent"
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-8 text-skin-primary"
                              fill="none"
                            >
                              <path
                                fill="currentColor"
                                d="M14.193 12.321a.452.452 0 010 .858l-2.421.806a3.613 3.613 0 00-2.285 2.286l-.806 2.42a.452.452 0 01-.858 0l-.806-2.421a3.613 3.613 0 00-2.286-2.285l-2.42-.806a.45.45 0 010-.858l2.42-.806A3.612 3.612 0 007.018 9.23l.806-2.42a.451.451 0 01.858 0l.806 2.42a3.612 3.612 0 002.285 2.285l2.421.806zm6.374-4.828a.271.271 0 010 .515l-1.453.484a2.17 2.17 0 00-1.37 1.37l-.485 1.453a.272.272 0 01-.515 0l-.483-1.452a2.162 2.162 0 00-1.372-1.371l-1.452-.484a.271.271 0 010-.515l1.452-.484a2.163 2.163 0 001.372-1.37l.483-1.453a.271.271 0 01.515 0l.484 1.452a2.162 2.162 0 001.371 1.371l1.453.484zm1.311 8.835a.18.18 0 010 .343l-.967.322a1.444 1.444 0 00-.915.915l-.323.968a.181.181 0 01-.342 0l-.323-.968a1.449 1.449 0 00-.915-.915l-.967-.322a.181.181 0 010-.343l.967-.322a1.448 1.448 0 00.915-.915l.323-.966a.18.18 0 01.342 0l.323.967c.143.433.482.771.915.915l.967.321z"
                              />
                            </svg>
                            Checking my memory...
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ul>
            )}
            {/* messages */}
          </>
        )}

        <div className="relative px-5 pb-5">
          {/* video suggestions */}
          <AnimatePresence>
            {videos && videos.length > 1 && (
              <motion.div
                initial={{ y: 10, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: 10, opacity: 0, filter: "blur(10px)" }}
                className="relative mx-auto flex w-full max-w-4xl snap-x items-center justify-center pb-2"
              >
                {/* left gradient */}
                <div className="absolute left-0 top-0 z-20 h-36 w-16 bg-gradient-to-r from-gray-100 to-transparent"></div>
                {/* left gradient */}

                <div className="scrollbar relative z-10 flex w-full items-center justify-start gap-5 overflow-x-auto p-1 pl-16">
                  {/* embedded video card */}
                  {videos.map((video, idx) => (
                    <div
                      key={idx}
                      className="aspect-video w-56 flex-shrink-0 overflow-hidden rounded-xl"
                    >
                      <iframe
                        width="224px"
                        src={video.video}
                        title={video?.title ?? ""}
                        allowFullScreen
                        style={{
                          aspectRatio: 16 / 9,
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  ))}

                  <div className="-ml-5 h-36 w-16 flex-shrink-0"></div>
                  {/* embedded video card */}
                </div>

                {/* right gradient */}
                <div className="absolute right-0 top-0 z-20 h-36 w-16 bg-gradient-to-l from-gray-100 to-transparent"></div>
                {/* right gradient */}
              </motion.div>
            )}
            <motion.div></motion.div>
          </AnimatePresence>
          {/* video suggestions */}

          {/* suggestions */}
          <AnimatePresence>
            {suggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ y: 10, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: 10, opacity: 0, filter: "blur(10px)" }}
                className="relative mx-auto flex w-full max-w-4xl snap-x items-center justify-center pb-2"
              >
                {/* left gradient */}
                <div className="absolute left-0 top-0 z-20 h-14 w-16 bg-gradient-to-r from-gray-100 to-transparent"></div>
                {/* left gradient */}

                <div className="scrollbar relative z-10 flex w-full items-center justify-start gap-5 overflow-x-auto p-1 pl-16">
                  {/* card */}
                  {suggestions.map((suggestion, idx) => (
                    <button
                      onClick={() => {
                        handleSubmit(suggestion.question);
                      }}
                      key={idx}
                      className="flex-shrink-0 rounded-xl border bg-white p-3 ring-gray-300 hover:bg-gray-50 data-[presses]:bg-gray-100 md:p-3"
                    >
                      <p className="whitespace-nowrap text-sm font-medium text-skin-primary">
                        {suggestion.question}
                      </p>
                    </button>
                  ))}
                  {/* card */}

                  <div className="-ml-5 h-12 w-16 flex-shrink-0"></div>
                  {/* card */}
                </div>

                {/* right gradient */}
                <div className="absolute right-0 top-0 z-20 h-14 w-16 bg-gradient-to-l from-gray-100 to-transparent"></div>
                {/* right gradient */}
              </motion.div>
            )}
          </AnimatePresence>
          {/* suggestions */}

          <div className="mx-auto w-full max-w-3xl">
            <input className="sr-only" type="file" {...getInputProps()} />
            <ChatInput
              isLoading={isStreamLoading || !streamingDone}
              isFileUploadLoading={isFileUploadLoading}
              openExplorer={open}
              handleSubmit={handleSubmit}
              stopStreaming={stopStreaming}
              placeholder={`Message ${selectedCopilot && selectedCopilot.name}`}
            />
          </div>
        </div>
      </section>

      {/* Overlay when files are dragged in */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial="close"
            animate="open"
            variants={{
              open: { opacity: 1 },
              close: { opacity: 0 },
            }}
            exit="close"
            className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-800/20 p-5 backdrop-blur-md"
          >
            <motion.div
              variants={{
                open: { scale: 1 },
                close: { scale: 0.98 },
              }}
              className="flex flex-col items-center justify-center gap-5 rounded-3xl bg-white/80 p-10 md:p-16"
            >
              <div className="flex items-center justify-center gap-5">
                <IoImage className="size-10 -rotate-45 text-skin-primary/30 md:size-20" />
                <IoFileTray className="size-16 text-skin-primary md:size-28" />
                <IoDocument className="size-10 rotate-45 text-[#F4AD35] md:size-20" />
              </div>

              <div className="mt-5">
                <h3 className="text-center text-2xl font-semibold text-gray-800">
                  Add Anything!
                </h3>

                <p className="text-center text-sm text-gray-800">
                  Drop any file here to add it to the conversation
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ChatArea;
