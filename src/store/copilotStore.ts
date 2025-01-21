import { create } from "zustand";
import Cookies from "js-cookie";
import { Agent } from "../api/agents/types";
import cookieKeys from "../configs/cookieKeys";

interface CopilotState {
  selectedCopilot: null | Agent;
  threadId: null | string;
  copilots: Agent[];
  actions: {
    setCopilots: (value: Agent[] | ((value: Agent[]) => Agent[])) => void;
    setSelectedCopilot: (
      value: Agent | null | ((value: Agent | null) => Agent)
    ) => void;
    setThreadId: (
      value: string | null | ((value: string | null) => string)
    ) => void;
  };
}

export const useCopilotStore = create<CopilotState>()((set) => ({
  threadId: JSON.parse(Cookies.get(cookieKeys.THREAD_ID) ?? "null"),
  selectedCopilot: JSON.parse(
    Cookies.get(cookieKeys.PREVIOUSLY_SELECTED_COPILOT) ?? "null"
  ),
  copilots: [],
  actions: {
    setCopilots: (value) =>
      set((state) => ({
        copilots: typeof value === "function" ? value(state.copilots) : value,
      })),
    setSelectedCopilot: (value) =>
      set((state) => ({
        selectedCopilot:
          typeof value === "function" ? value(state.selectedCopilot) : value,
      })),
    setThreadId: (value) =>
      set((state) => ({
        threadId: typeof value === "function" ? value(state.threadId) : value,
      })),
  },
}));
