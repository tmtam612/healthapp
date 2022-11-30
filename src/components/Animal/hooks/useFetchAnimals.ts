import { fetchDog } from "api/animalApi";
import { useRef } from "react";
import { useApi } from "api/hooks/useApi";
import type { AbortRef } from "api/api.types";

const useFetchDog = () => {
  const abortRef = useRef<AbortRef>({});

  const {
    data: dog,
    exec: initFetchDog,
    status: fetchDogStatus,
    isIdle: isFetchDogStatusIdle,
    isPending: isFetchDogStatusPending,
    isError: isFetchDogStatusError,
    isSuccess: isFetchDogStatusSuccess,
  } = useApi(() => {
    abortRef.current.abort?.();

    return fetchDog({
      abort: (cancel) => (abortRef.current.abort = cancel),
    }).then((response) => response.data.message);
  });

  return {
    dog,
    initFetchDog,
    fetchDogStatus,
    isFetchDogStatusIdle,
    isFetchDogStatusPending,
    isFetchDogStatusError,
    isFetchDogStatusSuccess,
  };
};

export default useFetchDog;
