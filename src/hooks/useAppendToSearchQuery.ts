import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const useAppendToSearchQuery = () => {
  const navigate = useNavigate();

  return useCallback(
    (
      param: Record<string, string>,
      options: { useReplace: boolean } = { useReplace: false }
    ) => {
      const currentUrl = new URL(window.location.href);
      const params = new URLSearchParams(currentUrl.search);

      Object.entries(param).forEach(([key, value]) => {
        params.set(key, value);
      });

      const url = `${currentUrl.pathname}?${params.toString()}`;

      if (options.useReplace) {
        navigate(url, { replace: true });
      } else {
        navigate(url);
      }
    },
    [navigate]
  );
};

export default useAppendToSearchQuery;
