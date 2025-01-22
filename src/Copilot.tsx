import { useEffect } from "react";
import { IoKey, IoPersonCircle } from "react-icons/io5";
import CopilotAuthWrapper from "./CopilotAuthWrapper";
import "./index.css";
import AlertProvider from "./providers/AlertProvider";
import { ApiProvider } from "./providers/ApiProvider";
import QueryProvider from "./providers/QueryProvider";
import { useAuthStore } from "./store/authStore";

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
          {storedApiKey && copilot && <CopilotAuthWrapper copilot={copilot} />}
          {(!apiKey || !storedApiKey) && (
            <div className="w-full h-full flex-1 flex flex-col items-center justify-center">
              <div className="bg-skin-secondary text-skin-primary rounded-full p-5">
                <IoKey className="size-7" />
              </div>

              <p className="mt-2 text-sm font-medium text-gray-800">
                No API key supplied
              </p>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Please get you API key by contacting Deepmodel.
              </p>
            </div>
          )}

          {!copilot && (
            <div className="w-full h-full flex-1 flex flex-col items-center justify-center">
              <div className="bg-skin-secondary text-skin-primary rounded-full p-5">
                <IoPersonCircle className="size-7" />
              </div>

              <p className="mt-2 text-sm font-medium text-gray-800">
                No copilot name supplied
              </p>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Please provide the name of the copilot you want to interact
                with.
              </p>
            </div>
          )}
        </div>
      </QueryProvider>
    </ApiProvider>
  );
};

export default Copilot;
