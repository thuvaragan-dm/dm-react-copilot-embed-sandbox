import { useEffect, useState } from "react";
import { IoCloseCircle, IoKey, IoPersonCircle } from "react-icons/io5";
import Popover from "./components/popover";
import CopilotAuthWrapper from "./CopilotAuthWrapper";
import "./index.css";
import AlertProvider from "./providers/AlertProvider";
import { ApiProvider } from "./providers/ApiProvider";
import QueryProvider from "./providers/QueryProvider";
import { useAuthStore } from "./store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { BorderBeam } from "./components/BorderBeam";

export type CopilotProps = {
  apiKey: string;
  copilot: string;
  isFloating: boolean;
};

const Copilot = ({ apiKey, copilot, isFloating = false }: CopilotProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <ApiProvider>
      <QueryProvider>
        <AlertProvider />
        <div className="dm flex h-full w-full flex-col">
          <div id="select-container" className="relative z-[999999]"></div>
          <div id="menu-container" className="relative z-[999999999]"></div>
          <div id="tooltip-container" className="relative z-[999999]"></div>
          <div id="drawer-container" className="relative z-[999999]"></div>
          <div id="modal-container" className="relative z-[999999]"></div>
          <div id="popover-container" className="relative z-[999999]"></div>

          {isFloating ? (
            <div className="fixed inset-0 isolate z-[99999]">
              <div className="relative h-full w-full">
                <div className="absolute bottom-0 right-0 mx-5">
                  <Popover onOpenChange={setIsChatOpen} open={isChatOpen}>
                    <Popover.Button className="mb-5 p-0 md:p-0">
                      <div className="relative mt-5 w-min cursor-pointer rounded-full p-1">
                        {isChatOpen && (
                          <BorderBeam size={35} borderWidth={3} duration={2} />
                        )}
                        <div className="rounded-full bg-skin-primary stroke-white p-3 text-white hover:bg-skin-primary/90">
                          <AnimatePresence mode="popLayout">
                            {isChatOpen ? (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  filter: "blur(5px)",
                                  scale: 0.8,
                                }}
                                animate={{
                                  opacity: 1,
                                  filter: "blur(0px)",
                                  scale: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                  filter: "blur(5px)",
                                  scale: 0.8,
                                }}
                                className=""
                              >
                                <IoCloseCircle className="size-8" />
                              </motion.div>
                            ) : (
                              <motion.svg
                                initial={{
                                  opacity: 0,
                                  filter: "blur(5px)",
                                  scale: 0.8,
                                }}
                                animate={{
                                  opacity: 1,
                                  filter: "blur(0px)",
                                  scale: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                  filter: "blur(5px)",
                                  scale: 0.8,
                                }}
                                className="size-8"
                                fill="none"
                                viewBox="0 0 227 228"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 124.669c0 56.279 45.623 91.36 101.902 91.36 56.278 0 101.901-45.623 101.901-101.901S176.448 12.227 113.902 12.227c-43.572 0-88.001-5.742-88.001 40.532 0 46.275-4.275 75.51 54.268 24.122 63.249-55.518 109.631 37.247 73.79 73.088-35.841 35.841-78.007 0-78.007 0"
                                  stroke="currentColor"
                                  strokeWidth={22.033}
                                  strokeLinecap="round"
                                />
                              </motion.svg>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </Popover.Button>
                    <Popover.Content
                      autoFocus
                      onPointerDownOutside={(e) => e.preventDefault()}
                      className="overflow-hidden rounded-2xl bg-gray-100 ring ring-gray-800/5"
                    >
                      <div className="flex h-[80dvh] w-[24rem] flex-col rounded-2xl">
                        <Chat apiKey={apiKey} copilot={copilot} />
                      </div>
                    </Popover.Content>
                  </Popover>
                </div>
              </div>
            </div>
          ) : (
            <Chat apiKey={apiKey} copilot={copilot} />
          )}
        </div>
      </QueryProvider>
    </ApiProvider>
  );
};

export default Copilot;

const Chat = ({ apiKey, copilot }: Omit<CopilotProps, "isFloating">) => {
  const {
    apiKey: storedApiKey,
    actions: { setApiKey },
  } = useAuthStore();

  useEffect(() => {
    setApiKey(apiKey);
  }, [apiKey]);

  return (
    <>
      {storedApiKey && copilot && <CopilotAuthWrapper copilot={copilot} />}

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
            Please provide the name of the copilot you want to interact with.
          </p>
        </div>
      )}
    </>
  );
};
