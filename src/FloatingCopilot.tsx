import { IoKey, IoPersonCircle } from "react-icons/io5";
import CopilotAuthWrapper from "./CopilotAuthWrapper";
import "./index.css";
import AlertProvider from "./providers/AlertProvider";
import { ApiProvider } from "./providers/ApiProvider";
import QueryProvider from "./providers/QueryProvider";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
import { CopilotProps } from "./Copilot";
import Popover from "./components/popover";

const FloatingCopilot = ({ apiKey, copilot }: CopilotProps) => {
  const {
    apiKey: storedApiKey,
    actions: { setApiKey },
  } = useAuthStore();

  useEffect(() => {
    setApiKey(apiKey);
  }, [apiKey]);

  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ApiProvider>
      <QueryProvider>
        <AlertProvider />
        <div className="dm flex h-full w-full flex-col">
          <div id="menu-container" className="relative z-[99999999999]"></div>
          <div id="select-container" className="relative z-[999999]"></div>
          <div id="tooltip-container" className="relative z-[999999]"></div>
          <div id="drawer-container" className="relative z-[999999]"></div>
          <div id="modal-container" className="relative z-[999999]"></div>
          <div id="popover-container" className="relative z-[999999]"></div>
          <div className="fixed inset-0 isolate z-[99999]">
            <div className="relative h-full w-full">
              <div className="absolute bottom-0 right-0">
                <Popover onOpenChange={setIsChatOpen} open={isChatOpen}>
                  <Popover.Button>Open</Popover.Button>
                  <Popover.Content
                    onPointerDownOutside={(e) => e.preventDefault()}
                    className="overflow-hidden rounded-2xl"
                  >
                    <div className="flex h-[85dvh] w-[24rem] flex-col rounded-2xl">
                      {storedApiKey && copilot && (
                        <CopilotAuthWrapper copilot={copilot} />
                      )}

                      {(!apiKey || !storedApiKey) && (
                        <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
                          <div className="rounded-full bg-skin-secondary p-5 text-skin-primary">
                            <IoKey className="size-7" />
                          </div>

                          <p className="mt-2 text-sm font-medium text-gray-800">
                            No API key supplied
                          </p>

                          <p className="mt-2 text-center text-xs text-gray-500">
                            Please get you API key by contacting Deepmodel.
                          </p>
                        </div>
                      )}

                      {!copilot && (
                        <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
                          <div className="rounded-full bg-skin-secondary p-5 text-skin-primary">
                            <IoPersonCircle className="size-7" />
                          </div>

                          <p className="mt-2 text-sm font-medium text-gray-800">
                            No copilot name supplied
                          </p>

                          <p className="mt-2 text-center text-xs text-gray-500">
                            Please provide the name of the copilot you want to
                            interact with.
                          </p>
                        </div>
                      )}
                    </div>
                  </Popover.Content>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </QueryProvider>
    </ApiProvider>
  );
};

export default FloatingCopilot;
