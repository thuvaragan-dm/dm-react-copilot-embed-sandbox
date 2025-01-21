import { useEffect } from "react";
import ChatArea from "./components/ChatArea";
import AlertProvider from "./providers/AlertProvider";
import { ApiProvider } from "./providers/ApiProvider";
import QueryProvider from "./providers/QueryProvider";
import { useAuthStore } from "./store/authStore";
import "./index.css";

export type CopilotProps = {
  apiKey: string;
  copilot: string;
};

const Copilot = ({ apiKey, copilot }: CopilotProps) => {
  const {
    apiKey: storedApiKey,

    actions: { setApiKey },
  } = useAuthStore();

  useEffect(() => {
    setApiKey(apiKey);
  }, [apiKey]);
  return (
    <ApiProvider>
      <QueryProvider>
        <AlertProvider />
        <div className="w-full h-full dm flex flex-col">
          <div id="select-container" className="relative z-[999999]"></div>
          <div id="menu-container" className="relative z-[999999]"></div>
          <div id="tooltip-container" className="relative z-[999999]"></div>
          <div id="drawer-container" className="relative z-[999999]"></div>
          <div id="modal-container" className="relative z-[999999]"></div>
          {storedApiKey && <ChatArea copilot={copilot} />}
        </div>
      </QueryProvider>
    </ApiProvider>
  );
};

export default Copilot;
