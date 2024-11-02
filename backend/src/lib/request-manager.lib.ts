import axios, { Axios, AxiosError, AxiosRequestConfig } from 'axios';

class RequestManager {
  client: {
    get<T = any, R = T, D = any>(
      url: string,
      config: AxiosRequestConfig<D>,
    ): Promise<R>;
    post<T = any, R = T, D = any>(
      url: string,
      data: D,
      config: AxiosRequestConfig<D>,
    ): Promise<R>;
    put<T = any, R = T, D = any>(
      url: string,
      data: D,
      config: AxiosRequestConfig<D>,
    ): Promise<R>;
    delete<T = any, R = T, D = any>(
      url: string,
      config: AxiosRequestConfig<D>,
    ): Promise<R>;
  } & Axios;
  constructor(baseUrl: string, withCredentials?: boolean) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials,
    });
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error: AxiosError<{ message: string; code: number }>) => {
        let apiError: Error | undefined;
        if (error.response) {
          console.log(
            `API Error - url: ${error.config?.url} method: ${error.config?.method?.toUpperCase()} exception_message: ${error.response.data.message} status_code: ${error.response.status}`,
          );
          apiError = new Error(
            `API Error, message: ${error.response.data.message}`,
          );
        } else if (error.request) {
          console.log(
            `Network Error - url: ${error.config?.url} method: ${error.config?.method?.toUpperCase()} exception_message: ${error?.request?.data.message} status_code: ${error.request?.status}`,
          );
          apiError = new Error(
            `Network Error, message: ${error?.request?.data.message}`,
          );
        } else {
          console.log(`Unknown Error - ${error.message}`);
          apiError = new Error(`Unknown Error, message: ${error.message}`);
        }
        return apiError;
      },
    );
  }
}
export default RequestManager;
