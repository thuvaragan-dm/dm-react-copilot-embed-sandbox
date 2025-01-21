import Cookies from "js-cookie";
import { useCreateMutation } from "../apiFactory";
import { UpdateUserInput, User } from "./types";
import { useApi } from "../../providers/ApiProvider";
import { useAuthActions } from "../../store/authStore";
import queryClient from "../queryClient";
import cookieKeys from "../../configs/cookieKeys";

export const useUpdateUser = ({
  invalidateQueryKey,
}: {
  invalidateQueryKey?: unknown[];
}) => {
  const { apiClient } = useApi();
  const { setUser } = useAuthActions();

  return useCreateMutation<Record<string, any>, UpdateUserInput, User, User>({
    apiClient,
    method: "put",
    url: "users/me",
    errorMessage: "Failed to update user.",
    invalidateQueryKey,
    mutationOptions: {
      onSettled: async () => {
        const user = (await queryClient.fetchQuery({
          queryKey: invalidateQueryKey!,
        })) as User;

        setUser(user ?? null);
        Cookies.set(cookieKeys.USER_DETAILS, JSON.stringify(user));
      },
    },
    optimisticUpdate: (user, variables) => {
      return user ? { ...user, ...variables } : user;
    },
  });
};
