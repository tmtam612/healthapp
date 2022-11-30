import { useApiStatus } from "./useApiStatus";
import { useState } from "react";
import { PENDING, CANCEL, SUCCESS, ERROR } from "../constants/apiStatus";
import { didAbort } from "api/api";

interface UseApiConfig<T> {
  initialData?: T;
}

type ApiFunction<T = unknown> = (...args: unknown[]) => T | Promise<T>;

export function useApi<TData = unknown, TError = unknown>(
  fn: ApiFunction<TData>,
  config: UseApiConfig<TData> = {}
) {
  const { initialData } = config;
  const [data, setData] = useState<TData | undefined>(initialData);
  const [error, setError] = useState<TError | unknown>();
  const { status, setStatus, ...normalisedStatuses } = useApiStatus();

  const exec = async <A>(...args: A[]) => {
    try {
      setStatus(PENDING);
      const data = await fn(...args);
      setData(data);
      setStatus(SUCCESS);

      return {
        data,
        error: null,
      };
    } catch (err) {
      if (didAbort(error)) {
        setStatus(CANCEL);
      } else {
        setError(err);
        setStatus(ERROR);
      }

      return {
        error: err,
        data: null,
      };
    }
  };

  return {
    data,
    setData,
    status,
    setStatus,
    error,
    exec,
    ...normalisedStatuses,
  };
}
