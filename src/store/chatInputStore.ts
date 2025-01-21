import { create } from "zustand";
import { Suggestion, Video } from "../api/message/types";
import { Document } from "../api/document/types";

interface ChatInputState {
  query: string;
  files: File[];
  fileData: Document | null; //TODO extend this to include multiple files
  suggestions: Suggestion[];
  videos: Video[];

  actions: {
    setQuery: (value: string | ((value: string) => string)) => void;
    setFiles: (value: File[] | ((value: File[]) => File[])) => void;
    setFileData: (
      value: Document | null | ((value: Document | null) => Document | null)
    ) => void;
    setSuggestions: (
      value: Suggestion[] | ((value: Suggestion[]) => Suggestion[])
    ) => void;
    setVideos: (value: Video[] | ((value: Video[]) => Video[])) => void;
    reset: () => void;
  };
}

export const useChatInputStore = create<ChatInputState>()((set) => ({
  query: "",
  files: [],
  fileData: null,
  suggestions: [],
  videos: [],
  actions: {
    setQuery: (value) =>
      set((state) => ({
        query: typeof value === "function" ? value(state.query) : value,
      })),

    setFiles: (value) =>
      set((state) => ({
        files: typeof value === "function" ? value(state.files) : value,
      })),

    setFileData: (value) =>
      set((state) => ({
        fileData: typeof value === "function" ? value(state.fileData) : value,
      })),

    setSuggestions: (value) =>
      set((state) => ({
        suggestions:
          typeof value === "function" ? value(state.suggestions) : value,
      })),

    setVideos: (value) =>
      set((state) => ({
        videos: typeof value === "function" ? value(state.videos) : value,
      })),
    reset: () =>
      set(() => ({ query: "", files: [], suggestions: [], fileData: null })),
  },
}));

export const useChatInput = () =>
  useChatInputStore((state) => ({
    query: state.query,
    files: state.files,
    fileData: state.fileData,
    suggestions: state.suggestions,
    videos: state.videos,
  }));

export const useChatInputActions = () =>
  useChatInputStore((state) => state.actions);
