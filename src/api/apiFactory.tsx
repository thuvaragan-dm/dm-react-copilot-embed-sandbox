import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  isAxiosError,
} from "axios";
import { toast } from "sonner";
import ErrorToast from "../components/alerts/Error";
import queryClient from "./queryClient";

// Toast service for displaying errors
const toastService = {
  error: (message: string) => {
    toast.custom(
      (t) => <ErrorToast t={t} title="Error" description={message} />,
      {
        id: "apiFactoryError",
      }
    );
  },
};

type HttpMethod = "post" | "put" | "patch" | "delete";

// Mutation context to store previous data for rollback in case of failure
type MutationContext<TOptimisticData> =
  | {
      previousData: TOptimisticData | undefined;
    }
  | undefined;

interface CreateMutationParams<TData, TParams, TBody, TOptimisticData> {
  apiClient: AxiosInstance;
  method: HttpMethod;
  url: string; // URL can have dynamic parts (e.g., `/api/resource/${id}`)
  optimisticUpdate?: (
    previousValue: TOptimisticData | undefined,
    variables: TBody,
    params?: TParams
  ) => TOptimisticData | undefined;
  errorMessage?: string | ((error: AxiosError) => string);
  invalidateQueryKey?: unknown[];
  mutationOptions?: Omit<
    UseMutationOptions<
      TData,
      AxiosError,
      { params?: TParams; body?: TBody }, // TVariables now has params and body
      MutationContext<TOptimisticData>
    >,
    "mutationFn"
  >;
}

export function useCreateMutation<
  TParams extends Record<string, any> = Record<string, any>,
  TBody = unknown,
  TData = unknown,
  TOptimisticData = unknown
>({
  apiClient,
  method,
  url,
  optimisticUpdate,
  errorMessage,
  invalidateQueryKey,
  mutationOptions,
}: CreateMutationParams<TData, TParams, TBody, TOptimisticData>) {
  return useMutation<
    TData,
    AxiosError,
    { params?: TParams; body?: TBody }, // Update mutation function to expect this
    MutationContext<TOptimisticData>
  >({
    mutationFn: async ({ params, body }) => {
      // Handle dynamic URL parts with variable replacement using params
      const finalUrl = url.replace(/\${(.*?)}/g, (_, key) => {
        const paramValue = params?.[key];
        if (!paramValue) {
          throw new Error(`Missing parameter for URL: ${key}`);
        }
        return paramValue;
      });

      try {
        const response: AxiosResponse<TData> = await apiClient({
          url: finalUrl,
          method,
          data: body,
        });

        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (
            axiosError.response?.status !== 401 &&
            axiosError.response?.status !== 403
          ) {
            const errMessage =
              typeof errorMessage === "function"
                ? errorMessage(axiosError)
                : errorMessage || "An error occurred";

            toastService.error(errMessage);
          }
        }
        throw error;
      }
    },

    onMutate: async (variables): Promise<MutationContext<TOptimisticData>> => {
      if (invalidateQueryKey && optimisticUpdate) {
        // Cancel any outgoing refetch
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: invalidateQueryKey,
        });

        // Snapshot the previous value
        const previousData =
          queryClient.getQueryData<TOptimisticData>(invalidateQueryKey);

        // Optimistically update to the new value
        if (previousData) {
          queryClient.setQueryData<TOptimisticData>(invalidateQueryKey, (pv) =>
            optimisticUpdate(pv, variables.body!, variables.params)
          );
        }

        return { previousData };
      }
      return undefined;
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (invalidateQueryKey && context?.previousData !== undefined) {
        queryClient.setQueryData<TOptimisticData>(
          invalidateQueryKey,
          context.previousData
        );
      }
      if (mutationOptions?.onError) {
        mutationOptions.onError(err, variables, context);
      }
    },

    onSettled: async () => {
      if (invalidateQueryKey) {
        await queryClient.invalidateQueries({
          queryKey: invalidateQueryKey,
        });
      }
    },
    ...mutationOptions,
  });
}

interface CreateQueryParams<TData> {
  apiClient: AxiosInstance;
  url: string; // URL can have dynamic parts (e.g., `/api/resource/${id}`)
  errorMessage?: string | ((error: AxiosError) => string);
  defaultValue?: TData;
  queryKey: string;
  queryParams?: Record<string, any>;
  queryOptions?: Omit<
    UseQueryOptions<TData, AxiosError, TData, unknown[]>,
    "queryFn" | "queryKey"
  >;
}

export function useCreateQuery<TData = unknown>({
  apiClient,
  url,
  errorMessage,
  defaultValue,
  queryKey,
  queryParams,
  queryOptions,
}: CreateQueryParams<TData>) {
  return useQuery<TData, AxiosError, TData, unknown[]>({
    queryKey: queryParams ? [queryKey, queryParams] : [queryKey],
    queryFn: async () => {
      try {
        const response: AxiosResponse<TData> = await apiClient({
          url,
          method: "get", // Query method will generally be GET
          params: queryParams, // For queries, params go in the URL instead of the body
        });

        return response.data;
      } catch (error) {
        if (errorMessage && error instanceof AxiosError) {
          const errMessage =
            typeof errorMessage === "function"
              ? errorMessage(error)
              : errorMessage || "An error occurred";

          toastService.error(errMessage);
        }
        throw error;
      }
    },

    // Provide default data to avoid undefined issues
    initialData: defaultValue,

    ...queryOptions,
  });
}

// Options for configuring infinite query behavior
type InfiniteQueryOptions<TQueryFnData> = {
  url: string;
  transformResponse?: (data: any) => TQueryFnData;
  errorMessage?: string | ((error: AxiosError) => string);
};

// Fallback query options
type FallbackQuery = {
  isNotId?: boolean;
  fallbackContent?: any;
};

// Helper to create infinite query hook
export function createInfiniteQueryHook<
  TQueryFnData = unknown,
  TError = AxiosError
>(
  apiClient: AxiosInstance,
  options: InfiniteQueryOptions<TQueryFnData> & FallbackQuery
) {
  return (
    queryKey: string | unknown[],
    queryParams: Record<string, any> & { limit: number },
    _queryOptions?: Omit<
      UseInfiniteQueryOptions<
        InfiniteData<TQueryFnData>,
        TError,
        InfiniteData<TQueryFnData>,
        TQueryFnData
      >,
      "queryFn" | "queryKey"
    >
  ): UseInfiniteQueryResult<InfiniteData<TQueryFnData>, TError> =>
    useInfiniteQuery({
      queryKey: [queryKey, queryParams],
      queryFn: async ({ pageParam }) => {
        try {
          // Return fallback content if specified, otherwise perform the API request
          let response: AxiosResponse<any> = {
            data: options.fallbackContent || [],
            status: 200,
            headers: {},
            request: {},
            config: { headers: new AxiosHeaders() },
            statusText: "",
          };
          if (!options.isNotId) {
            response = await apiClient.get(options.url, {
              params: { ...queryParams, offset: pageParam * queryParams.limit },
            });
          }
          return options.transformResponse
            ? options.transformResponse(response.data)
            : response.data;
        } catch (error) {
          // Handle error with Axios and show custom error toast
          if (isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const errorMessage =
              typeof options.errorMessage === "function"
                ? options.errorMessage(axiosError)
                : options.errorMessage || "An error occurred";
            toastService.error(errorMessage);
          }
          throw error;
        }
      },
      initialPageParam: 0,

      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length >= queryParams.limit) {
          return allPages.length;
        } else {
          return undefined;
        }
      },
    });
}
