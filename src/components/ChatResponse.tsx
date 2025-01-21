"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentProps, useState } from "react";
import {
  IoChatboxOutline,
  IoChevronDown,
  IoCopy,
  IoPerson,
  IoReloadOutline,
} from "react-icons/io5";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { EMessage, MESSAGE_LIMIT, messageKey } from "../api/message/config";
import { Message } from "../api/message/types";
import { useAddMessageReaction } from "../api/message/useAddMessageReaction";
import { useRemoveMessageReaction } from "../api/message/useRemoveMessageReaction";
import queryClient from "../api/queryClient";
import { ETask, taskKey } from "../api/task/config";
import { useCopilotStore } from "../store/copilotStore";
import { cn } from "../utilities/cn";
import copyTextToClipboard from "../utilities/copyTextToClipboard";
import Avatar from "./Avatar";
import { ConfettiButton } from "./ConfettiButton";
import Accordion from "./accordion";
import { Button } from "./form-elements/Button";
import Tooltip from "./tooltip";

interface IChatResponse extends ComponentProps<"div"> {
  message: Message;
}

const ChatResponse = ({ message }: IChatResponse) => {
  const { selectedCopilot, threadId } = useCopilotStore();
  const [isRefetchLoading, setIsRefetchLoading] = useState(false);

  const { mutate: addReaction } = useAddMessageReaction({
    id: message.id,
    invalidateQueryKey: [
      messageKey[EMessage.FETCH_ALL],
      { limit: MESSAGE_LIMIT, thread_id: threadId },
    ],
  });

  const { mutate: removeReaction } = useRemoveMessageReaction({
    id: message.id,
    invalidateQueryKey: [
      messageKey[EMessage.FETCH_ALL],
      { limit: MESSAGE_LIMIT, thread_id: threadId },
    ],
  });

  const handleRefresh = async () => {
    setIsRefetchLoading(true);
    await queryClient.refetchQueries({
      queryKey: [
        messageKey[EMessage.FETCH_ALL],
        { limit: MESSAGE_LIMIT, thread_id: threadId },
      ],
    });
    await queryClient.refetchQueries({
      queryKey: [taskKey[ETask.FETCH_ALL], { thread_id: threadId }],
    });
    setIsRefetchLoading(false);
  };

  return (
    <div className="flex w-full items-start justify-start gap-2">
      <div className="overflow-hidden rounded-full bg-gray-100 shadow-inner">
        {selectedCopilot && selectedCopilot.avatar ? (
          <Avatar
            Fallback={() => (
              <Avatar.Fallback className="size-6">
                {selectedCopilot?.name[0]}
                {selectedCopilot?.name[1]}
              </Avatar.Fallback>
            )}
            className="size-6"
            src={selectedCopilot.avatar}
          />
        ) : (
          <div className="flex size-6 items-center justify-center rounded-full bg-skin-secondary">
            <IoPerson className="size-4 text-skin-primary" />
          </div>
        )}
      </div>

      <div className="@[xl]:max-w-[90.5%] relative mr-auto flex w-full min-w-[15%] max-w-[80.5%] items-start justify-start">
        <div className="flex w-full flex-1 flex-col">
          <div
            className={`relative z-20 w-full flex-1 rounded-3xl bg-white p-5 text-left text-gray-800 ring-gray-800/10`}
          >
            <div className="prose mx-auto w-full max-w-3xl prose-pre:rounded-xl prose-pre:bg-transparent prose-pre:p-0 prose-table:overflow-hidden prose-table:rounded-xl prose-table:border prose-table:ring-[1px] prose-table:ring-gray-300 prose-thead:overflow-hidden prose-thead:rounded-t-xl prose-thead:border prose-thead:border-b-0 prose-thead:bg-gray-800 prose-thead:text-white prose-tr:border-b prose-th:p-2 prose-th:text-white prose-td:p-2">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");

                    return !inline && match ? (
                      <div>
                        <span className="flex w-full items-center justify-between rounded-t-[1rem] bg-[#282A36] px-1.5 pt-1.5">
                          <div className="flex w-full items-center justify-between rounded-[calc(1rem-0.375rem)] bg-white/10 px-3">
                            <p className="font-sans text-xs text-white">
                              {match[1]}
                            </p>

                            <CopyButtonCodeEditor textToCopy={children} />
                          </div>
                        </span>
                        <SyntaxHighlighter
                          style={dracula}
                          PreTag="div"
                          language={match[1]}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={cn(className)} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.message}
              </Markdown>
            </div>

            {/* Chat controls */}
            <div className="mt-5 min-h-10">
              <AnimatePresence mode="popLayout" initial={false}>
                {message.id !== "tempId" && (
                  <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    className="flex w-full items-center justify-end gap-2"
                  >
                    {message.reaction === "like" ? (
                      <Button
                        onClick={() => {
                          removeReaction({
                            body: {
                              reaction_type: "like",
                            },
                          });
                        }}
                        variant={"ghost"}
                        className={cn(
                          "flex-shrink-0 rounded-full bg-gray-100 p-0 text-gray-800 ring-gray-200 hover:bg-gray-200 data-[pressed]:bg-gray-200 md:p-0",
                          {
                            "bg-skin-primary text-white hover:bg-skin-primary/80":
                              message.reaction === "like",
                          }
                        )}
                      >
                        <Tooltip delayDuration={50}>
                          <Tooltip.Trigger
                            asChild
                            className="flex flex-shrink-0 items-center justify-center p-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-8"
                              fill="none"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.25}
                                d="M8.034 10.4V20M14.49 7.104l-.807 3.296h4.704a1.625 1.625 0 011.291.64 1.593 1.593 0 01.259 1.408l-1.88 6.4a1.6 1.6 0 01-.582.832 1.62 1.62 0 01-.968.32H5.614a1.62 1.62 0 01-1.141-.469A1.593 1.593 0 014 18.4V12c0-.424.17-.831.473-1.131a1.62 1.62 0 011.14-.469h2.228a1.613 1.613 0 001.444-.888L12.069 4a2.543 2.543 0 011.966.972 2.494 2.494 0 01.454 2.132z"
                              />
                            </svg>
                          </Tooltip.Trigger>
                          <Tooltip.Content
                            className="rounded-lg bg-gray-800 p-2 py-1 text-center text-xs font-medium text-white shadow-md"
                            side="bottom"
                            sideOffset={5}
                          >
                            Good response
                          </Tooltip.Content>
                        </Tooltip>
                      </Button>
                    ) : (
                      <ConfettiButton
                        onClick={() => {
                          addReaction({
                            body: {
                              reaction_type: "like",
                            },
                          });
                        }}
                        variant={"ghost"}
                        className={cn(
                          "flex-shrink-0 rounded-full bg-gray-100 p-0 text-gray-800 ring-gray-200 hover:bg-gray-200 data-[pressed]:bg-gray-200 md:p-0"
                        )}
                      >
                        <Tooltip delayDuration={50}>
                          <Tooltip.Trigger
                            asChild
                            className="flex flex-shrink-0 items-center justify-center p-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-8"
                              fill="none"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.25}
                                d="M8.034 10.4V20M14.49 7.104l-.807 3.296h4.704a1.625 1.625 0 011.291.64 1.593 1.593 0 01.259 1.408l-1.88 6.4a1.6 1.6 0 01-.582.832 1.62 1.62 0 01-.968.32H5.614a1.62 1.62 0 01-1.141-.469A1.593 1.593 0 014 18.4V12c0-.424.17-.831.473-1.131a1.62 1.62 0 011.14-.469h2.228a1.613 1.613 0 001.444-.888L12.069 4a2.543 2.543 0 011.966.972 2.494 2.494 0 01.454 2.132z"
                              />
                            </svg>
                          </Tooltip.Trigger>
                          <Tooltip.Content
                            className="rounded-lg bg-gray-800 p-2 py-1 text-center text-xs font-medium text-white shadow-md"
                            side="bottom"
                            sideOffset={5}
                          >
                            Good response
                          </Tooltip.Content>
                        </Tooltip>
                      </ConfettiButton>
                    )}

                    <Button
                      onClick={() => {
                        if (message.reaction === "dislike") {
                          removeReaction({
                            body: {
                              reaction_type: "dislike",
                            },
                          });
                        } else {
                          addReaction({
                            body: {
                              reaction_type: "dislike",
                            },
                          });
                        }
                      }}
                      variant={"ghost"}
                      className={cn(
                        "flex-shrink-0 rounded-full bg-gray-100 p-0 text-gray-800 ring-gray-200 hover:bg-gray-200 data-[pressed]:bg-gray-200 md:p-0",
                        {
                          "bg-skin-primary text-white hover:bg-skin-primary/80":
                            message.reaction === "dislike",
                        }
                      )}
                    >
                      <Tooltip>
                        <Tooltip.Trigger
                          asChild
                          className="flex flex-shrink-0 items-center justify-center p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-8 rotate-180"
                            fill="none"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.25}
                              d="M8.034 10.4V20M14.49 7.104l-.807 3.296h4.704a1.625 1.625 0 011.291.64 1.593 1.593 0 01.259 1.408l-1.88 6.4a1.6 1.6 0 01-.582.832 1.62 1.62 0 01-.968.32H5.614a1.62 1.62 0 01-1.141-.469A1.593 1.593 0 014 18.4V12c0-.424.17-.831.473-1.131a1.62 1.62 0 011.14-.469h2.228a1.613 1.613 0 001.444-.888L12.069 4a2.543 2.543 0 011.966.972 2.494 2.494 0 01.454 2.132z"
                            />
                          </svg>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          className="rounded-lg bg-gray-800 p-2 py-1 text-center text-xs font-medium text-white shadow-md"
                          side="bottom"
                          sideOffset={5}
                        >
                          Bad response
                        </Tooltip.Content>
                      </Tooltip>
                    </Button>

                    <CopyButton textToCopy={message.message} />

                    {message.message.toLowerCase().includes("processing") && (
                      <Button
                        onClick={handleRefresh}
                        variant={"ghost"}
                        disabled={isRefetchLoading}
                        className="-mt-[0.35rem] flex-shrink-0 rounded-full bg-gray-100 p-0 ring-gray-200 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 data-[pressed]:bg-gray-200 md:p-0"
                      >
                        <Tooltip>
                          <Tooltip.Trigger
                            asChild
                            className="flex flex-shrink-0 items-center justify-center p-2"
                          >
                            <div className="">
                              <IoReloadOutline
                                className={cn("size-4 flex-shrink-0", {
                                  "animate-spin": isRefetchLoading,
                                })}
                              />
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Content
                            className="rounded-lg bg-gray-800 p-2 py-1 text-center text-xs font-medium text-white shadow-md"
                            side="bottom"
                            sideOffset={5}
                          >
                            Refresh
                          </Tooltip.Content>
                        </Tooltip>
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Chat controls */}
          </div>

          {/* sources */}
          <AnimatePresence>
            {message && message.sources && message.sources.length > 0 && (
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                className="-mt-5 w-full rounded-b-3xl bg-gray-50 pt-5"
              >
                <Accordion type="multiple">
                  <Accordion.Item value="item-1">
                    <Accordion.Trigger className="group w-full px-5 py-2 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-gray-800">
                          Sources
                        </h3>

                        <IoChevronDown className="size-4 text-gray-800 transition-all duration-300 group-data-[state=open]:rotate-180" />
                      </div>
                    </Accordion.Trigger>
                    <Accordion.Content className="overflow-x-auto">
                      <div className="scrollbar flex w-full items-start justify-start gap-5 overflow-x-auto p-5 pb-1 pt-1">
                        {/* card */}
                        {message &&
                          message.sources.map((source) => (
                            <a
                              target="_blank"
                              href={`/annotate/${source.id}`}
                              key={source.id}
                              className="block w-full rounded-xl bg-white p-3 ring-[1.5px] ring-gray-800/10"
                            >
                              <div className="flex items-start justify-start gap-2">
                                <IoChatboxOutline className="size-5 text-skin-primary" />
                                <p className="truncate whitespace-nowrap text-sm font-medium text-gray-800">
                                  {source.name}
                                </p>
                              </div>
                            </a>
                          ))}

                        {/* card */}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface ICopyButton {
  textToCopy: string;
}
const CopyButton = ({ textToCopy }: ICopyButton) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute -left-3 -top-9 rounded-lg bg-gray-800 p-1 px-2 text-xs text-white"
          >
            copied
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={async () => {
          setIsLoading(true);
          await copyTextToClipboard(textToCopy);

          setTimeout(() => {
            setIsLoading(false);
          }, 1300);
        }}
        variant={"ghost"}
        className={
          "-mt-1.5 flex-shrink-0 rounded-full bg-gray-100 p-0 ring-gray-200 hover:bg-gray-200 data-[pressed]:bg-gray-200 md:p-0"
        }
      >
        <Tooltip>
          <Tooltip.Trigger
            asChild
            className="flex flex-shrink-0 items-center justify-center p-2"
          >
            <div className="">
              <IoCopy className="size-[1.05rem] flex-shrink-0 text-gray-800" />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content
            className="rounded-lg bg-gray-800 p-2 py-1 text-center text-xs font-medium text-white shadow-md"
            side="bottom"
            sideOffset={5}
          >
            Copy
          </Tooltip.Content>
        </Tooltip>
      </Button>
    </div>
  );
};

interface ICopyButtonCodeEditor {
  textToCopy: string;
}
const CopyButtonCodeEditor = ({ textToCopy }: ICopyButtonCodeEditor) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="relative">
      <motion.div
        layout
        onClick={async () => {
          setIsLoading(true);
          await copyTextToClipboard(textToCopy);

          setTimeout(() => {
            setIsLoading(false);
          }, 1300);
        }}
        className={"cursor-pointer font-sans text-xs text-white"}
      >
        <motion.div layout className="flex items-center justify-start">
          <motion.svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={cn("h-8 w-8 text-white", {
              "text-green-300": isLoading,
            })}
          >
            <path d="M13 10.75h-1.25a2 2 0 00-2 2v8.5a2 2 0 002 2h8.5a2 2 0 002-2v-8.5a2 2 0 00-2-2H19" />
            <path d="M18 12.25h-4a1 1 0 01-1-1v-1.5a1 1 0 011-1h4a1 1 0 011 1v1.5a1 1 0 01-1 1zm-4.25 4h4.5m-4.5 3h4.5" />
          </motion.svg>

          <AnimatePresence mode="popLayout" initial={false}>
            {isLoading && (
              <motion.span
                layout
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                className="text-green-300"
              >
                Code copied
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout" initial={false}>
            {!isLoading && (
              <motion.span
                layout
                initial={{ opacity: 0, filter: "blur(3px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(3px)" }}
              >
                Copy code
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default ChatResponse;
