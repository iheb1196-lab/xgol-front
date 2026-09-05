/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

export function useRouter(disableHistory = false) {
  const navigate = useNavigate();

  const router = useMemo(
    () => ({
      back: () => (!disableHistory ? navigate(-1) : null),
      forward: () => navigate(1),
      reload: () => window.location.reload(),
      push: (href, state) => {
        navigate(href, { state, replace: disableHistory });
      },
      replace: (href) => navigate(href, { replace: true }),
    }),
    [navigate, disableHistory]
  );

  return router;
}
