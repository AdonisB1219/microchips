import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { appAPI } from '@/shared/axios';
import {
  MutationParams,
  Propietario,
  PropietarioPaginatedRes,
} from '@/shared/interfaces';
import { getUrlParams } from '@/shared/utils';
import { isAxiosError } from 'axios';

const { get, post, put, remove } = appAPI();

///* tanStack query
export const useFetchTutors = (params?: GetTutorsParams) => {
  return useQuery({
    queryKey: ['tutors', ...Object.values(params || {})],
    queryFn: () => getTutors(params),
  });
};
export const useFetchTutorsEnabled = (
  enabled: boolean,
  params?: GetTutorsParams
) => {
  return useQuery({
    queryKey: ['tutors', ...Object.values(params || {})],
    queryFn: () => getTutors(params),
    enabled,
  });
};

export const useGetTutor = (id: number) => {
  return useQuery({
    queryKey: ['tutor', id],
    queryFn: () => getTutor(id),
  });
};

export const useCreateTutor = ({ navigate, returnUrl }: MutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTutor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
      navigate(returnUrl);
      toast.success('Tutor creado correctamente');
    },
    onError: error => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error('Error al crear el Tutor');
    },
  });
};

export const useUpdateTutor = ({
  navigate,
  returnUrl,
  returnErrorUrl,
}: MutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTutor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
      navigate(returnUrl);
      toast.success('Tutor actualizado correctamente');
    },
    onError: () => {
      navigate(returnErrorUrl || returnUrl);
      toast.error('Error al actualizar el Tutor');
    },
  });
};

export const useDeleteTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTutor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
      toast.success('Tutor eliminado correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar el Tutor');
    },
  });
};

///* axios
export type GetTutorsParams = {
  page?: number;
  page_size?: number;

  // filters

  observaciones?: string;
  userId?: number;
  nombre?: string;

  direccion?: string;
  telefono?: string;
  email?: string;
};
export type CreateTutorParams = Omit<Propietario, 'id_tutor'>;
export type UpdateTutorParams = {
  id: number;
  data: CreateTutorParams;
};

export const getTutors = (params?: GetTutorsParams) => {
  const queryParams = getUrlParams(params || {});
  return get<PropietarioPaginatedRes>(`/tutors/?${queryParams}`, true);
};

export const getTutor = (id: number) => {
  return get<Propietario>(`/tutors/${id}`, true);
};


export const createTutor = (data: CreateTutorParams) => {
  return post<Propietario>('/tutors/', data, true);
};

export const updateTutor = ({ id, data }: UpdateTutorParams) => {
  return put<Propietario>(`/tutors/${id}/`, data, true);
};

export const deleteTutor = (id: number) => {
  return remove<Propietario>(`/tutors/${id}/`, true);
};
