"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentProps, Fragment, useEffect, useRef, useState } from "react";
import {
  IoArrowUpOutline,
  IoCloudUpload,
  IoDocument,
  IoLogoMarkdown,
  IoStop,
} from "react-icons/io5";
import { useDeleteDocument } from "../api/document/useDeleteDocument";
import { useChatInputStore } from "../store/chatInputStore";
import capitalizeFirstLetter from "../utilities/capitalizeFirstLetter";
import { cn } from "../utilities/cn";
import Dropdown from "./dropdown";
import { Button } from "./form-elements/Button";

interface IChatInput extends ComponentProps<"textarea"> {
  handleSubmit: (query: string) => void;
  openExplorer: () => void;
  isLoading: boolean;
  isFileUploadLoading: boolean;
  stopStreaming: () => void;
}
const ChatInput = ({
  handleSubmit,
  openExplorer,
  placeholder,
  isLoading,
  isFileUploadLoading,
  stopStreaming,
}: IChatInput) => {
  const [openAttachment, setOpenAttachment] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { query, files } = useChatInputStore();
  const {
    actions: { setQuery, setFiles },
  } = useChatInputStore();

  const recalculateHeight = () => {
    if (textAreaRef && textAreaRef.current) {
      const textAreaEl = textAreaRef.current;
      textAreaEl.style.height = `auto`;
      textAreaEl.style.height = `${textAreaEl.scrollHeight}px`;
    }
  };

  useEffect(() => {
    recalculateHeight();
  }, [query]);

  const submit = () => {
    if (query.length > 0) {
      handleSubmit(query);
      setQuery("");
      setFiles([]);
      recalculateHeight();
    }
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col rounded-[1.8rem] bg-white p-1 shadow-md shadow-skin-secondary/40",
        {
          "border-transparent ring-[2px] ring-skin-secondary": query.length > 0,
        }
      )}
    >
      <AnimatePresence>
        {files && files.length > 0 && (
          <motion.div
            initial="close"
            animate="open"
            exit="close"
            className="flex w-full items-start justify-start gap-5 overflow-x-auto px-11 pt-2"
          >
            {files.map((file) => (
              <Fragment key={file.name}>
                <AnimatePresence>
                  <motion.div
                    variants={{
                      open: { opacity: 1 },
                      close: { opacity: 0 },
                    }}
                    className=""
                  >
                    <File
                      isLoading={isFileUploadLoading}
                      key={file.name}
                      file={file}
                      onDelete={(name) => {
                        setFiles &&
                          setFiles((pv) => pv.filter((f) => f.name !== name));
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full flex-1 items-end">
        <div className="mb-px flex h-full p-1">
          <Dropdown open={openAttachment} onOpenChange={setOpenAttachment}>
            <Dropdown.Button className="cursor-pointer rounded-full p-2 text-gray-600 hover:text-skin-primary data-[state=open]:text-skin-primary md:p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="M12 22.998c-1.81.041-3.562-.595-4.875-1.77C5.813 20.052 5.05 18.435 5 16.729V5.544c.034-1.233.584-2.404 1.53-3.255a5.116 5.116 0 013.522-1.288 5.117 5.117 0 013.528 1.284c.95.852 1.501 2.024 1.535 3.259V16.74a2.87 2.87 0 01-.975 1.96 3.22 3.22 0 01-2.134.797 3.22 3.22 0 01-2.134-.798 2.87 2.87 0 01-.975-1.959V6.413c0-.292.123-.572.341-.778.22-.206.516-.322.825-.322.31 0 .606.116.825.322.22.206.342.486.342.778V16.74a.725.725 0 00.258.462.81.81 0 00.518.185.81.81 0 00.518-.185.725.725 0 00.258-.462V5.544a2.42 2.42 0 00-.855-1.7 2.721 2.721 0 00-1.875-.643 2.72 2.72 0 00-1.868.647 2.42 2.42 0 00-.85 1.696v11.185a4.147 4.147 0 001.441 2.944A4.665 4.665 0 0012 20.797a4.665 4.665 0 003.225-1.125 4.147 4.147 0 001.442-2.944V5.544c0-.292.123-.572.341-.778.22-.206.516-.322.825-.322.31 0 .607.116.825.322.22.206.342.486.342.778v11.185c-.049 1.706-.813 3.323-2.125 4.499-1.313 1.175-3.066 1.811-4.875 1.77z"
                />
              </svg>
            </Dropdown.Button>

            <Dropdown.Menu
              align="start"
              className="mb-1 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-xl ring-[1px] ring-gray-300"
            >
              <Dropdown.Item
                onSelect={() => {
                  openExplorer();
                }}
                className="flex items-center gap-2"
              >
                <IoCloudUpload className="size-5" />
                <span>Upload from computer</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <textarea
          ref={textAreaRef}
          className="h-11 max-h-[25dvh] w-full resize-none overflow-y-auto py-3 pr-2 text-sm text-gray-800 [word-wrap:break-word] focus:outline-none"
          placeholder={placeholder}
          rows={1}
          value={query}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              if (isLoading || isFileUploadLoading) return;
              submit();
            }

            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              setQuery(textAreaRef?.current?.value + "\n");

              setTimeout(() => {
                recalculateHeight();
              }, 1);
            }
          }}
          onChange={(e) => {
            recalculateHeight();
            setQuery(e.target.value);
          }}
        ></textarea>

        <div className="mb-px flex h-full items-end justify-center gap-1 p-1">
          <AnimatePresence initial={false} mode="popLayout">
            {query.length <= 0 && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(5px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(5px)" }}
                className=""
              >
                <Button
                  onClick={() => submit()}
                  variant={"unstyled"}
                  className="rounded-full bg-transparent p-2 text-skin-primary hover:bg-transparent data-[pressed]:bg-transparent md:p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" fillRule="nonzero">
                      <path d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z" />
                      <path
                        fill="currentColor"
                        d="M12 2.5a1.5 1.5 0 011.493 1.356L13.5 4v16a1.5 1.5 0 01-2.993.144L10.5 20V4A1.5 1.5 0 0112 2.5zm-4 3A1.5 1.5 0 019.5 7v10a1.5 1.5 0 01-3 0V7A1.5 1.5 0 018 5.5zm8 0A1.5 1.5 0 0117.5 7v10a1.5 1.5 0 01-3 0V7A1.5 1.5 0 0116 5.5zm-12 3A1.5 1.5 0 015.5 10v4a1.5 1.5 0 01-3 0v-4A1.5 1.5 0 014 8.5zm16 0a1.5 1.5 0 011.493 1.356L21.5 10v4a1.5 1.5 0 01-2.993.144L18.5 14v-4A1.5 1.5 0 0120 8.5z"
                      />
                    </g>
                  </svg>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false} mode="popLayout">
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(5px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(5px)" }}
                className=""
              >
                <Button
                  onClick={() => submit()}
                  variant={"unstyled"}
                  disabled={query.length <= 0 || isFileUploadLoading}
                  className={cn("rounded-full p-2 md:p-2", {
                    "bg-skin-secondary text-skin-primary hover:bg-skin-secondary/80 disabled:bg-skin-secondary":
                      query.length <= 0 || isFileUploadLoading,
                    "bg-skin-primary text-white hover:bg-skin-primary data-[pressed]:bg-skin-primary":
                      query.length > 0,
                  })}
                >
                  <IoArrowUpOutline className="size-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false} mode="popLayout">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, filter: "blur(5px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(5px)" }}
                className=""
              >
                <Button
                  onClick={() => stopStreaming()}
                  variant={"unstyled"}
                  className={cn("rounded-full p-2 md:p-2", {
                    "bg-skin-secondary text-skin-primary hover:bg-skin-secondary/80 disabled:bg-skin-secondary":
                      query.length <= 0,
                    "bg-skin-primary text-white hover:bg-skin-primary data-[pressed]:bg-skin-primary":
                      query.length > 0,
                  })}
                >
                  <IoStop className="size-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

interface IFile extends ComponentProps<"div"> {
  file: File;
  onDelete?: (name: string) => void;
  isLoading?: boolean;
}

const File = ({ file, onDelete, isLoading = false }: IFile) => {
  const { fileData } = useChatInputStore();
  const { mutateAsync: deleteFile } = useDeleteDocument({
    id: fileData?.id || "",
  });
  return (
    <div className="group relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-x-0 bottom-0 px-2 pb-0.5 transition-shadow duration-500 ease-out [--bg-size:500%]"
          >
            <div className="h-1 w-full animate-gradient-fast rounded-full bg-gradient-to-r from-from-skin-gradient-from via-via-skin-gradient-via to-to-skin-gradient-to bg-[length:var(--bg-size)_100%]"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* delete button */}
      <div className="absolute right-0 top-0 z-20 m-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          onClick={() => {
            if (fileData) {
              deleteFile({});
            }
            onDelete && onDelete(file.name);
          }}
          variant={"ghost"}
          className={"rounded-full text-gray-600 hover:text-gray-800"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10M8.97 8.97a.75.75 0 011.06 0L12 10.94l1.97-1.97a.75.75 0 011.06 1.06L13.06 12l1.97 1.97a.75.75 0 01-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 01-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 010-1.06"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
      {/* delete button */}

      {!file.type.includes("image") ? (
        <div className="relative flex h-16 min-w-56 max-w-sm items-center justify-start gap-2 rounded-xl border p-1">
          <div className="flex aspect-square h-full items-center justify-center rounded-lg bg-skin-primary p-1 text-white">
            {file.type.includes("application") && (
              <IoDocument className="size-9" />
            )}
            {file.type.includes("markdown") && (
              <IoLogoMarkdown className="size-9" />
            )}
            {file.type.includes("image") && <IoDocument className="size-9" />}
          </div>

          <div className="truncate">
            <p className="truncate text-xs font-semibold text-gray-800">
              {capitalizeFirstLetter(file.name)}
            </p>
            <p className="text-xs uppercase tracking-wide text-gray-600">
              {file.type.split("application/")[1]}
            </p>
          </div>
        </div>
      ) : (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="aspect-square size-16 overflow-hidden rounded-xl border object-cover shadow-inner"
        />
      )}
    </div>
  );
};
