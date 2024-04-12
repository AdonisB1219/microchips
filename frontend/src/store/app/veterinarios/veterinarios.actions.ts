import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { appAPI } from '@/shared/axios';
import {
  MutationParams,
  Veterinario,
  VeterinarisoPaginatedRes,
} from '@/shared/interfaces';
import { getUrlParams } from '@/shared/utils';
import { isAxiosError } from 'axios';

const { get, post, put, remove } = appAPI();

///* tanStack query
export const useFetchVeterinarios = (params?: GetVeterinariosParams) => {
  return useQuery({
    queryKey: ['veterinarios', ...Object.values(params || {})],
    queryFn: () => getVeterinarios(params),
  });
};

export const useGetVeterinario = (id: number) => {
  return useQuery({
    queryKey: ['veterinario', id],
    queryFn: () => getVeterinario(id),
  });
};

export const useCreateVeterinario = ({
  navigate,
  returnUrl,
}: MutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVeterinario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarios'] });
      navigate(returnUrl);
      toast.success('Veterinario creado correctamente');
    },
    onError: error => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }

      // navigate(returnErrorUrl || returnUrl);
      toast.error('Error al crear el Veterinario');
    },
  });
};

export const useUpdateVeterinario = ({
  navigate,
  returnUrl,
  returnErrorUrl,
}: MutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVeterinario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarios'] });
      navigate(returnUrl);
      toast.success('Veterinario actualizado correctamente');
    },
    onError: () => {
      navigate(returnErrorUrl || returnUrl);
      toast.error('Error al actualizar el Veterinario');
    },
  });
};

export const useDeleteVeterinario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVeterinario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinarios'] });
      toast.success('Veterinario eliminado correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar el Veterinario');
    },
  });
};

///* axios
export type GetVeterinariosParams = {
  page?: number;
  page_size?: number;

  // filters

  no_registro?: string;

  nombre?: string;

  direccion?: string;
  telefono?: string;
  email?: string;
};
export type CreateVeterinarioParams = Omit<Veterinario, 'id_veterinario'>;
export type UpdateVeterinarioParams = {
  id: number;
  data: CreateVeterinarioParams;
};

export const getVeterinarios = (params?: GetVeterinariosParams) => {
  const queryParams = getUrlParams(params || {});
  return get<VeterinarisoPaginatedRes>(`/veterinarians/?${queryParams}`, true);
};

export const getVeterinario = (id: number) => {
  return get<Veterinario>(`/veterinarians/${id}`, true);
};

export const createVeterinario = (data: CreateVeterinarioParams) => {
  return post<Veterinario>('/veterinarians/', data, true);
};

export const updateVeterinario = ({ id, data }: UpdateVeterinarioParams) => {
  return put<Veterinario>(`/veterinarians/${id}/`, data, true);
};

export const deleteVeterinario = (id: number) => {
  return remove<Veterinario>(`/veterinarians/${id}/`, true);
};
