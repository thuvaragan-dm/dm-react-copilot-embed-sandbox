import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { createApiClient } from "../api/baseApi";
import { API_URL } from "../configs/contants";
import { useAuthActions, useAuthStore } from "../store/authStore";

interface ApiContextType {
  apiClient: ReturnType<typeof createApiClient>;
  formDataApiClient: ReturnType<typeof createApiClient>;
  arrayBufferApiClient: ReturnType<typeof createApiClient>;
}

const ApiContext = createContext<ApiContextType | null>(null);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuthActions();
  const { apiKey } = useAuthStore();

  const getAccessToken = useCallback(() => apiKey ?? null, [apiKey]);

  const apiClient = useMemo(
    () => createApiClient(API_URL ?? "", getAccessToken, logout),
    [getAccessToken, logout]
  );

  const formDataApiClient = useMemo(
    () =>
      createApiClient(API_URL ?? "", getAccessToken, logout, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "json",
      }),
    [getAccessToken, logout]
  );

  const arrayBufferApiClient = useMemo(
    () =>
      createApiClient(API_URL ?? "", getAccessToken, logout, {
        responseType: "arraybuffer",
      }),
    [getAccessToken, logout]
  );

  return (
    <ApiContext.Provider
      value={{
        apiClient,
        formDataApiClient,
        arrayBufferApiClient,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }
  return context;
};
