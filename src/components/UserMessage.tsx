"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentProps, useState } from "react";
import { IoPerson } from "react-icons/io5";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useAuth } from "../store/authStore";
import { cn } from "../utilities/cn";
import copyTextToClipboard from "../utilities/copyTextToClipboard";
import extractDocumentInfo from "../utilities/extractDocumentInfo";
import Avatar from "./Avatar";

interface IUserMessage extends ComponentProps<"div"> {
  message: string;
}
const UserMessage = ({ message }: IUserMessage) => {
  const { user } = useAuth();

  const { documentId, documentName } = extractDocumentInfo(message);
  return (
    <div className="@[xl]:max-w-[60%] ml-auto flex h-full min-w-[25%] max-w-[80.5%] items-start justify-start gap-2">
      <div
        className={`relative w-full rounded-3xl rounded-br-md bg-white p-5 text-left text-gray-800 ring-gray-800/10`}
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
            {message}
          </Markdown>

          {documentId && (
            <a
              target="_blank"
              href={`/viewer/${documentId}`}
              className="flex items-start justify-start gap-2"
            >
              <div className="w-min rounded-lg bg-orange-100 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-4 text-orange-400"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M2.432 2.29C1 3.576 1 5.651 1 9.8v4.4c0 4.148 0 6.223 1.432 7.51C3.864 23 6.17 23 10.778 23h2.444c4.61 0 6.914 0 8.346-1.29C23 20.424 23 18.349 23 14.2V9.8c0-4.148 0-6.223-1.432-7.51C20.136 1 17.83 1 13.222 1h-2.444c-4.61 0-6.914 0-8.346 1.29zm4.68 6.685a.97.97 0 00-.65.242.785.785 0 00-.268.583c0 .219.097.429.269.583a.97.97 0 00.648.242h9.778a.97.97 0 00.648-.242.786.786 0 00.269-.583.786.786 0 00-.269-.583.97.97 0 00-.648-.242H7.11zm0 4.4a.97.97 0 00-.65.242.786.786 0 00-.268.583c0 .219.097.429.269.583a.97.97 0 00.648.242h6.111a.97.97 0 00.648-.242.786.786 0 00.269-.583.786.786 0 00-.269-.583.97.97 0 00-.648-.242h-6.11z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="my-0 mt-1 text-xs">{documentName}</p>
            </a>
          )}
        </div>
      </div>

      <div className="flex h-full w-6 flex-shrink-0 items-end">
        <div className="size-6 overflow-hidden rounded-full bg-gray-100 shadow-inner">
          {user && user.avatar_url ? (
            <Avatar
              Fallback={() => (
                <Avatar.Fallback className="size-6">
                  {user?.first_name[0]}
                  {user?.last_name[0]}
                </Avatar.Fallback>
              )}
              className="size-6"
              src={user.avatar_url}
            />
          ) : (
            <div className="flex size-6 items-center justify-center rounded-full bg-skin-secondary">
              <IoPerson className="size-4 text-skin-primary" />
            </div>
          )}
        </div>
      </div>
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

export default UserMessage;
