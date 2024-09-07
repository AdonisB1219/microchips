import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { appAPI } from '@/shared/axios';
import { Admin, AdminPaginatedRes, MutationParams } from '@/shared/interfaces';
import { getUrlParams } from '@/shared/utils';
import { isAxiosError } from 'axios';

const { get, post, put, remove } = appAPI();

///* tanStack query
export const useFetchAdmins = (params?: GetAdminsParams) => {
  return useQuery({
    queryKey: ['admins', ...Object.values(params || {})],
    queryFn: () => getAdmins(params),
  });
};

export const useGetAdmin = (id: number) => {
  return useQuery({
    queryKey: ['admin', id],
    queryFn: () => getAdmin(id),
  });
};

export const useCreateAdmin = ({ navigate, returnUrl }: MutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      navigate(returnUrl);
      toast.success('Admin creado correctamente');
    },
    onError: error => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }
      // navigate(returnErrorUrl || returnUrl);
      toast.error('Error al crear el Admin');
    },
  });
};

export const useUpdateAdmin = ({ navigate, returnUrl }: MutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      navigate(returnUrl);
      toast.success('Admin actualizado correctamente');
    },
    onError: () => {
      // navigate(returnErrorUrl || returnUrl);
      toast.error('Error al actualizar el Admin');
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Admin eliminado correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar el Admin');
    },
  });
};

///* axios
export type GetAdminsParams = {
  page?: number;
  page_size?: number;

  // filters

  no_registro?: string;
  nombre?: string;

  direccion?: string;
  telefono?: string;
  email?: string;
  password?: string;
};
export type CreateAdminParams = Omit<Admin, 'id'>;
export type UpdateAdminParams = {
  id: number;
  data: CreateAdminParams;
};

export const getAdmins = (params?: GetAdminsParams) => {
  const queryParams = getUrlParams(params || {});
  return get<AdminPaginatedRes>(`/users/administradores/?${queryParams}`, true);
};

export const getAdmin = (id: number) => {
  return get<Admin>(`/users/administradores/${id}`, true);
};

export const createAdmin = (data: CreateAdminParams) => {
  return post<Admin>('/users/administradores/', data, true);
};

export const updateAdmin = ({ id, data }: UpdateAdminParams) => {
  return put<Admin>(`/users/administradores/${id}/`, data, true);
};

export const deleteAdmin = (id: number) => {
  return remove<Admin>(`/users/administradores/${id}/`, true);
};
