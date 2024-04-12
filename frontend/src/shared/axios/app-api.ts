import axios, { AxiosRequestConfig, isAxiosError } from 'axios';

import { useAuthStore } from '@/store/auth';
import { getEnvs } from '../utils';

const { VITE_API_URL } = getEnvs();

export const appAPI = () => {
  const sendRequest = async <T>(
    method: string,
    url: string,
    auth: boolean,
    typeJson: boolean = true,
    data = null
  ): Promise<T> => {
    const storedToken = useAuthStore.getState().token;
    const logout = useAuthStore.getState().logOutWithoutToken;

    const config: AxiosRequestConfig = {
      method: method,
      url: VITE_API_URL + url,
      data: data,
      //timeout: 5000,
      responseType: typeJson ? 'json' : 'blob',
    };

    if (auth) {
      config.headers = {
        Authorization: 'Bearer ' + storedToken,
      };
    }

    let dataResp;
    try {
      dataResp = (await axios<T>(config)).data;

      return dataResp;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) logout();
      throw error;
    }
  };

  const get = async function <T>(
    url: string,
    auth: boolean,
    typeJson: boolean = true
  ): Promise<T> {
    return sendRequest<T>('GET', url, auth, typeJson);
  };

  const post = async function <T>(
    url: string,
    data: any,
    auth: boolean,
    typeJson: boolean = true
  ): Promise<T> {
    return sendRequest<T>('POST', url, auth, typeJson, data);
  };

  const put = async function <T>(
    url: string,
    data: any,
    auth: boolean,
    typeJson: boolean = true
  ): Promise<T> {
    return sendRequest<T>('PUT', url, auth, typeJson, data);
  };

  const remove = async function <T>(
    url: string,
    auth: boolean,
    typeJson: boolean = true
  ): Promise<T> {
    return sendRequest<T>('DELETE', url, auth, typeJson);
  };

  return {
    get,
    post,
    put,
    remove,
  };
};
