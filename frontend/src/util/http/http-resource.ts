import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";
import { serialize } from 'object-to-formdata';

interface ListOptions {
  queryParams?: any;
}

interface UpdateOptions {
  http?: {
    usePost?: boolean;
  },
  config?: AxiosRequestConfig,
}

export default class HttpResource {

  private cancelList: CancelTokenSource | null = null;

  constructor(protected http: AxiosInstance, protected resource: string) {
    this.cancelList = null; 
  }

  list<T = any>(options?: ListOptions): Promise<AxiosResponse<T>> {
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

  create<T = any>(data: any): Promise<AxiosResponse<T>> {
    const sendData = this.makeSendData(data);
    return this.http.post<T>(this.resource, sendData);
  }

  update<T = any>(id: string, data: any, options?: UpdateOptions): Promise<AxiosResponse<T>> {
    const sendData = this.makeSendData(data);
    const { http, config } = options || {};
    return !options || !http || !http.usePost
      ? this.http.put<T>(`${ this.resource }/${ id }`, sendData, config)
      : this.http.post<T>(`${ this.resource }/${ id }`, sendData, config);
  }

  partialUpdate<T = any>(id: string, data: any, options?: UpdateOptions): Promise<AxiosResponse<T>> {
    const sendData = this.makeSendData(data);
    const { http, config } = options || {};
    return !options || !http || !http.usePost
      ? this.http.patch<T>(`${ this.resource }/${ id }`, sendData, config)
      : this.http.post<T>(`${ this.resource }/${ id }`, sendData, config);
  }
  
  delete<T = any>(id: string): Promise<AxiosResponse<T>> {
    return this.http.delete<T>(`${ this.resource }/${ id }`);
  }

  deleteCollection<T = any>(queryParams: any): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {};

    if (queryParams) {
      config.params = queryParams;
    }

    return this.http.delete<T>(this.resource, config);
  }

  isCancelledRequest(error: any) {
    return axios.isCancel(error);
  }

  private makeSendData(data: any) {
    return this.containsFile(data) ? this.getFormData(data) : data;
  }

  private getFormData(data) {
    return serialize(data, { booleansAsIntegers: true });
  }

  private containsFile(data: any) {
    return Object.values(data)
                 .filter(item => item instanceof File).length !== 0;
  }
}