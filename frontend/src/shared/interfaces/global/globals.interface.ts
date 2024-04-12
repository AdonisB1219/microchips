import { NavigateFunction } from 'react-router-dom';

export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}

export enum RequestStatusEnum {
  success = 'success',
  error = 'error',
}

export type MutationParams = {
  navigate: NavigateFunction;
  returnUrl: string;
  returnErrorUrl?: string;
};
