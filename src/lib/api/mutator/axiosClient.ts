/**
 * Custom Axios instance (mutator) for API calls
 * This is the centralized HTTP client following the Orval mutator pattern
 * 
 * Features:
 * - Runtime config integration (window.CONFIG)
 * - x-mock-scenario header support
 * - Request/response type safety
 * - Error handling structure
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getConfig } from '@/microsite-config';

/**
 * Create the Axios instance with runtime configuration
 */
export const axiosInstance = axios.create();

/**
 * Request interceptor: Add base URL and mock scenario header
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const runtimeConfig = getConfig();
    
    // Set base URL from runtime config
    config.baseURL = runtimeConfig.apiUrl;
    
    // Add x-mock-scenario header if in mocked mode and scenario is set
    if (runtimeConfig.environment === 'mocked' && runtimeConfig.features?.enableMockScenarios) {
      const scenario = sessionStorage.getItem('mockScenario');
      if (scenario && config.headers) {
        config.headers['x-mock-scenario'] = scenario;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: Handle common errors
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (getConfig().environment === 'development') {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Custom mutator for Orval-generated code
 * This is the function signature that Orval would use
 */
export const customAxiosMutator = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }: AxiosResponse<T>) => data);

  // @ts-expect-error - Axios CancelToken pattern
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

/**
 * Type-safe HTTP client helper
 */
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get<T>(url, config).then((res) => res.data),
  
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),
};
