import { useQuery } from '@tanstack/react-query';

import { appAPI } from '@/shared/axios';
import { FreeInfoPaginatedRes } from '@/shared/interfaces';
import { getUrlParams } from '@/shared/utils';

const { get } = appAPI();

///* tanStack query
export const useFetchFreeInfo = (params?: GetFreeInfoParams) => {
  return useQuery({
    queryKey: ['free-info', ...Object.values(params || {})],
    queryFn: () => getFreeInfo(params),
  });
};

///* axios
export type GetFreeInfoParams = {
  page?: number;
  page_size?: number;
  search?: string;
};

export const getFreeInfo = async (params?: GetFreeInfoParams) => {
  const queryParams = getUrlParams(params || {});
  return get<FreeInfoPaginatedRes>(`/free/pets/?${queryParams}`, false);
};
