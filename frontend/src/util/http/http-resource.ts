import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";

interface RequestOptions {
  queryParams?: any;
}

export default class HttpResource {

  private cancelList: CancelTokenSource | null = null;

  constructor(protected http: AxiosInstance, protected resource: string) {
    this.cancelList = null; 
  }

  list<T = any>(options?: RequestOptions): Promise<AxiosResponse<T>> {
    if (this.cancelList) {
      this.cancelList.cancel('List cancelled by new request');
    }
    this.cancelList = axios.CancelToken.source();

    const config: AxiosRequestConfig = {
      cancelToken: this.cancelList.token
    };

    if (options && options.queryParams) {
      config.params = options.queryParams;
    }

    return this.http.get<T>(this.resource, config);
  }

  get<T = any>(id: string): Promise<AxiosResponse<T>> {
    return this.http.get<T>(`${ this.resource }/${ id }`);
  }

  create<T = any>(data): Promise<AxiosResponse<T>> {
    return this.http.post<T>(this.resource, data);
  }

  update<T = any>(id: string, data): Promise<AxiosResponse<T>> {
    return this.http.put<T>(`${ this.resource }/${ id }`, data);
  }
  
  delete<T = any>(id: string): Promise<AxiosResponse<T>> {
    return this.http.delete<T>(`${ this.resource }/${ id }`);
  }

  isCancelledRequest(error) {
    return axios.isCancel(error);
  }
}