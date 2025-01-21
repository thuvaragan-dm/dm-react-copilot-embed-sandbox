import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { API_URL } from "../configs/contants";
import cookieKeys from "../configs/cookieKeys";
import modifyUserAvatar from "../utilities/modifyUserAvatar";
import { User } from "../api/user/types";

interface AuthContextType {
  apiKey: string | null;
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  publicAccessToken: string | null;
  actions: {
    publicLogin: (token: string, user: User) => void;
    login: (token: string, user: User) => void;
    signUp: (token: string, user: User) => void;
    logout: () => void;
    refetchUser: () => Promise<User | null>;
    setUser: (
      value: User | null | ((value: User | null) => User | null)
    ) => void;
    setApiKey: (
      value: string | null | ((value: string | null) => string)
    ) => void;
  };
}

export const useAuthStore = create<AuthContextType>((set) => ({
  apiKey: null,
  user: JSON.parse(Cookies.get(cookieKeys.USER_DETAILS) ?? "null"),
  isAuthenticated: false,
  accessToken: Cookies.get(cookieKeys.USER_TOKEN) ?? null,
  publicAccessToken:
    Cookies.get(cookieKeys.USER_TOKEN) ??
    Cookies.get(cookieKeys.PUBLIC_USER_TOKEN) ??
    null,
  actions: {
    publicLogin: (token, user) => {
      Cookies.set(cookieKeys.PUBLIC_USER_DETAILS, token);
      set((state) => {
        if (!state.user) {
          Cookies.set(cookieKeys.USER_DETAILS, JSON.stringify(user));
        }
        return {
          isAuthenticated: true,
          publicAccessToken: token,
          user,
        };
      });
    },
    login: (token, user) => {
      Cookies.set(cookieKeys.USER_TOKEN, token);
      Cookies.set(cookieKeys.USER_DETAILS, JSON.stringify(user));
      set({
        isAuthenticated: true,
        accessToken: token,
        user,
      });
    },
    signUp: (token, user) => {
      Cookies.set(cookieKeys.USER_TOKEN, token);
      Cookies.set(cookieKeys.USER_DETAILS, JSON.stringify(user));
      set({
        isAuthenticated: true,
        accessToken: token,
        user,
      });
    },
    logout: () => {
      Cookies.remove(cookieKeys.USER_TOKEN);
      Cookies.remove(cookieKeys.USER_DETAILS);

      set({
        isAuthenticated: false,
        accessToken: null,
        user: null,
      });
    },
    refetchUser: async () => {
      try {
        const userResponse = await fetch(`${API_URL}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get(cookieKeys.USER_TOKEN)}`,
          },
        });

        const user: User = await userResponse.json();

        Cookies.set(cookieKeys.USER_DETAILS, JSON.stringify(user));

        set(() => ({
          user,
        }));

        return user;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        return null;
      }
    },
    setUser: (value) =>
      set((state) => {
        const user =
          typeof value === "function"
            ? modifyUserAvatar(value(state.user))
            : modifyUserAvatar(value);
        Cookies.set(cookieKeys.USER_DETAILS, JSON.stringify(user));
        return {
          user,
        };
      }),
    setApiKey: (value) =>
      set((state) => ({
        apiKey: typeof value === "function" ? value(state.apiKey) : value,
      })),
  },
}));

export const useAuth = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const authStore = useAuthStore();

  useEffect(() => {
    const user = JSON.parse(Cookies.get(cookieKeys.USER_DETAILS) || "null");

    authStore.user = user;
    // Set hydrated to true after the client has mounted and state is synced

    setIsHydrated(true);
  }, [authStore.actions]);

  //Ensure components only render when hydrated to avoid SSR/CSR mismatch
  if (!isHydrated) {
    return {
      accessToken: authStore.accessToken,
      apiKey: authStore.apiKey,
    };
  }

  return {
    accessToken: authStore.accessToken,
    publicAccessToken: authStore.publicAccessToken,
    user: authStore.user,
    apiKey: authStore.apiKey,
  };
};

export const useAuthActions = () => useAuthStore((state) => state.actions);
