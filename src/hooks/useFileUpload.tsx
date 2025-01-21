import { useCallback, useState } from "react";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { documentKey, EDocument } from "../api/document/config";
import { useUploadDocument } from "../api/document/useUploadDocument";
import Error from "../components/alerts/Error";
import { useChatInputStore } from "../store/chatInputStore";
import { useCopilotStore } from "../store/copilotStore";
import extractFileExtension from "../utilities/extractFileExtension";

const MAX_FILE_SIZE_IN_MB = 2;

const ACCEPTED_FILE_EXTENSIONS = new Set([
  "pdf",
  "json",
  "ppt",
  "docx",
  "yaml",
  "png",
  "jpg",
  "jpeg",
  "md",
  "xlsx",
]);

const useFileUpload = () => {
  const { selectedCopilot } = useCopilotStore();
  const { files } = useChatInputStore();
  const {
    actions: { setFiles, setFileData },
  } = useChatInputStore();
  const { mutateAsync: uploadFile } = useUploadDocument({
    invalidateQueryKey: [documentKey[EDocument.FETCH_ALL]],
  });

  const [isFileUploadLoading, setIsFileUploadLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);

      fileRejections.forEach((rejection) => {
        const error = rejection.errors[0];
        const fileExtension = extractFileExtension(rejection.file.name);

        switch (error.code) {
          case "file-invalid-type":
            toast.custom(
              (t) => (
                <Error
                  t={t}
                  title="Invalid file type!"
                  description={`Sorry, we currently don't support ${fileExtension} type.`}
                />
              ),
              { id: Math.floor(Math.random() * 10000) }
            );
            break;

          case "duplicate_file":
            toast.custom(
              (t) => (
                <Error
                  t={t}
                  title="Duplicate file detected!"
                  description={error.message}
                />
              ),
              { id: Math.floor(Math.random() * 10000) }
            );
            break;

          case "file_too_large":
            toast.custom(
              (t) => (
                <Error
                  t={t}
                  title="File too large!"
                  description={`${rejection.file.name} is of size ${(
                    rejection.file.size /
                    (1024 * 1024)
                  ).toFixed(
                    2
                  )}MB, we allow only files below ${MAX_FILE_SIZE_IN_MB}MB.`}
                />
              ),
              { id: Math.floor(Math.random() * 10000) }
            );
            break;

          case "too_many_files":
            toast.custom(
              (t) => (
                <Error
                  t={t}
                  title="Too many files!"
                  description={error.message}
                />
              ),
              { id: Math.floor(Math.random() * 10000) }
            );
            break;

          default:
            break;
        }
      });

      // Handle file uploads and errors
      for (const file of acceptedFiles) {
        try {
          setIsFileUploadLoading(true);
          const uploadedData = await uploadFile({
            body: {
              file,
              shard_id: selectedCopilot?.shard_id ?? "",
              description: "Sample description",
            },
          });
          if (uploadedData) {
            setFileData(uploadedData);
          }
        } catch (error) {
          // If upload fails, remove the file from the state
          setFiles((prev) => prev.filter((f) => f !== file));
        } finally {
          setIsFileUploadLoading(false);
        }
      }
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    validator: (file: FileWithPath) => {
      const fileExtension = extractFileExtension(file.name);

      if (files.length > 0) {
        return {
          code: "too_many_files",
          message: `Currently you can upload only one file.`,
        };
      }
      if (files.find((f) => f.name === file.name)) {
        return {
          code: "duplicate_file",
          message: `${file.name} already exists`,
        };
      }
      if (
        MAX_FILE_SIZE_IN_MB &&
        file.size > MAX_FILE_SIZE_IN_MB * 1024 * 1024
      ) {
        return {
          code: "file_too_large",
          message: `File is too large, The maximum file size allowed is ${MAX_FILE_SIZE_IN_MB.toFixed(
            2
          )}MB`,
        };
      }
      if (!ACCEPTED_FILE_EXTENSIONS.has(`${fileExtension}`)) {
        return {
          code: "file-invalid-type",
          message: `File type .${fileExtension} is not accepted.`,
        };
      }
      return null;
    },
  });

  return {
    files,
    setFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    isFileUploadLoading,
  };
};

export default useFileUpload;
