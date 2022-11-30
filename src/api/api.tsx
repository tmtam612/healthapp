import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  Cancel,
  AxiosPromise,
} from "axios";
import {
  ApiRequestConfig,
  WithAbortFn,
  ApiExecutor,
  ApiExecutorArgs,
  ApiError,
} from "./api.types";

/*
  Add error logging    
*/
const withLogger = async <T,>(promise: AxiosPromise<T>) =>
  promise.catch((error: ApiError) => {
    // Log error in dev environment
    if (process.env.NODE_ENV !== "development") throw error;

    // Log error only if REACT_APP_DEBUG_API env is set to true
    if (!process.env.REACT_APP_DEBUG_API) throw error;
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      // in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
    throw error;
  });

/*
  Add abort logic   
*/
export const didAbort = (
  error: unknown
): error is Cancel & { aborted: boolean } => axios.isCancel(error);

export const isApiError = (error: unknown): error is ApiError => {
  return axios.isAxiosError(error);
};

const getCancelSource = () => axios.CancelToken.source();

const withAbort = <T,>(fn: WithAbortFn) => {
  const executor: ApiExecutor<T> = async (...args: ApiExecutorArgs) => {
    const originalConfig = args[args.length - 1] as ApiRequestConfig; // get last parameter
    // Extract abort property from the config
    const { abort, ...config } = originalConfig;

    // Create cancel token and abort method only if abort
    // function was passed
    if (typeof abort === "function") {
      const { cancel, token } = getCancelSource();
      config.cancelToken = token;
      abort(cancel);
    }

    try {
      if (args.length > 2) {
        const [url, body] = args;
        return await fn<T>(url, body, config);
      } else {
        const [url] = args;
        return await fn<T>(url, config);
      }
    } catch (error) {
      console.log("api error", error);
      // Add "aborted" property to the error if the request was cancelled
      if (didAbort(error)) {
        error.aborted = true;
      }
      throw error;
    }
  };

  return executor;
};

// Default config for the axios instances
const axiosParams = {
  baseURL:
    process.env.NODE_ENV === "development" ? "http://localhost:8080" : "/",
};

// Create axios instance with default params
const axiosInstance = axios.create(axiosParams);

// Main api function
const api = (axios: AxiosInstance) => {
  return {
    get: <T,>(url: string, config: AxiosRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.get)(url, config)),
    delete: <T,>(url: string, config: AxiosRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.delete)(url, config)),
    post: <T,>(url: string, body: unknown, config: AxiosRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.post)(url, body, config)),
    patch: <T,>(url: string, body: unknown, config: AxiosRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.patch)(url, body, config)),
    put: <T,>(url: string, body: unknown, config: AxiosRequestConfig) =>
      withLogger<T>(withAbort<T>(axios.put)(url, body, config)),
  };
};

export default api(axiosInstance);
