import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { appAPI } from '@/shared/axios';
import {
  MutationParams,
  Pet,
  PetPopulated,
  PetsPaginatedRes,
} from '@/shared/interfaces';
import { getUrlParams } from '@/shared/utils';
import { isAxiosError } from 'axios';

const { get, post, put, remove } = appAPI();

///* tanStack query
export const useFetchPets = (dependent: boolean, params?: GetPetsParams) => {
  return useQuery({
    queryKey: ['pets', ...Object.values(params || {})],
    queryFn: () => getPets(params),
    enabled: dependent,
  });
};

export const useFetchMyPets = (dependent: boolean, params?: GetPetsParams) => {
  return useQuery({
    queryKey: ['myPets', ...Object.values(params || {})],
    queryFn: () => getMyPets(params),
    enabled: dependent,
  });
};

export const useGetPet = (id: number) => {
  return useQuery({
    queryKey: ['pet', id],
    queryFn: () => getPet(id),
    retry: false,
  });
};

export const useCreatePet = ({ navigate, returnUrl }: MutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      navigate(returnUrl);
      toast.success('Pet creado correctamente');
    },
    onError: error => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
        return;
      }

      toast.error('Error al crear el Pet');
      // navigate(returnErrorUrl || returnUrl);
    },
  });
};

export const useUpdatePet = ({
  navigate,
  returnUrl,
  returnErrorUrl,
}: MutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      navigate(returnUrl);
      toast.success('Pet actualizado correctamente');
    },
    onError: () => {
      navigate(returnErrorUrl || returnUrl);
      toast.error('Error al actualizar el Pet');
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet eliminado correctamente');
    },
    onError: () => {
      toast.error('Error al eliminar el Pet');
    },
  });
};

///* axios
export type GetPetsParams = {
  page?: number;
  page_size?: number;

  // filters
  nombre_mascota?: string;
  codigo_chip?: string;
  lugar_implantacion?: string;
  fecha_implantacion?: string;
  especie?: string;
  raza?: string;
  sexo?: string;
  ubicacion?: string;
  aga?: string;
  estado?: string;
  tutorId?: number;
  responsableId?: number;
  nombre_tutor?: string;
};
export type CreatePetParams = Omit<Pet, 'id_pet'>;
export type UpdatePetParams = {
  id: number;
  data: CreatePetParams;
};

export const getPets = (params?: GetPetsParams) => {
  const queryParams = getUrlParams(params || {});
  return get<PetsPaginatedRes>(`/pets/?${queryParams}`, true);
};
export const getMyPets = (params?: GetPetsParams) => {
  const queryParams = getUrlParams(params || {});
  return get<PetsPaginatedRes>(`/pets/my-pets/?${queryParams}`, true);
};

export const getPet = (id: number) => {
  return get<PetPopulated>(`/pets/${id}`, true);
};

export const createPet = (data: CreatePetParams) => {
  return post<Pet>('/pets/', data, true);
};

export const updatePet = ({ id, data }: UpdatePetParams) => {
  return put<Pet>(`/pets/${id}/`, data, true);
};

export const deletePet = (id: number) => {
  return remove<Pet>(`/pets/${id}/`, true);
};

///* pdf
export const downloadPetPDF = (id: number) => {
  return get(`/pdfs/pet/${id}`, true);
};
