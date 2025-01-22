import { useGetUser } from "./api/user/useGetUser";
import ChatArea from "./components/ChatArea";
import Spinner from "./components/Spinner";
import { useEffect } from "react";
import { IoFingerPrint } from "react-icons/io5";
import { useAuthStore } from "./store/authStore";

const CopilotAuthWrapper = ({ copilot }: { copilot: string }) => {
  const {
    data: user,
    isPending: isUserLoading,
    error: userError,
  } = useGetUser();

  const {
    actions: { setUser },
  } = useAuthStore();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  return (
    <>
      {isUserLoading && (
        <div className="w-full h-full flex-1 flex flex-col items-center justify-center">
          <Spinner className="size-5" />
        </div>
      )}

      {!isUserLoading && userError && (
        <div className="w-full h-full flex-1 flex flex-col items-center justify-center">
          <div className="bg-skin-secondary text-skin-primary rounded-full p-5">
            <IoFingerPrint className="size-7" />
          </div>

          <p className="mt-2 text-sm font-medium text-gray-800">
            Invalid API Key provided
          </p>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Please get you API key by contacting Deepmodel.
          </p>
        </div>
      )}

      {!isUserLoading && user && <ChatArea copilot={copilot} />}
    </>
  );
};

export default CopilotAuthWrapper;
