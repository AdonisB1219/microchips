import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appAPI } from '@/shared/axios';
import { Empresa, EmpresaPaginatedRes, MutationParams } from '@/shared/interfaces';
import { getUrlParams } from '@/shared/utils';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';


const { get, post, put, remove } = appAPI();

export const useFetchEmpresas = (params?: GetEmpresasParams) => {
    return useQuery({
        queryKey: ['empresas', ...Object.values(params || {})],
        queryFn: () => getEmpresas(params),
        retry: (failureCount, error: any) => {
            if (error.response?.status === 403) {
              return false;
            }
            return failureCount < 3;
          }
    });
};

export const useGetEmpresa = (id: number) => {
    return useQuery({
        queryKey: ['empresa', id],
        queryFn: () => getEmpresa(id),
    });
};

export const useCreateEmpresas = ({ navigate, returnUrl }: MutationParams) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEmpresa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['empresas'] });
            navigate(returnUrl);
            toast.success('Empresa creada correctamente');
        },
        onError: error => {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
                return;
            }
            // navigate(returnErrorUrl || returnUrl);
            toast.error('Error al crear la empresa');
        },
    });
};

export const useUpdateEmpresa = ({ navigate, returnUrl }: MutationParams) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateEmpresa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['empresas'] });
            navigate(returnUrl);
            toast.success('Empresa actualizada correctamente');
        },
        onError: () => {
            // navigate(returnErrorUrl || returnUrl);
            toast.error('Error al actualizar la empresa');
        },
    });
};

export const useDeleteEmpresa = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEmpresa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['empresas'] });
            toast.success('Empresa eliminada correctamente');
        },
        onError: () => {
            toast.error('Error al eliminar la empresa');
        },
    });
};

export type GetEmpresasParams = {
    page?: number;
    page_size?: number;

    // filters
    nombre_empresa?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
};

export type CreateEmpresaParams = Omit<Empresa, 'id'>;
export type UpdateEmpresaParams = {
    id: number;
    data: CreateEmpresaParams;
};

export const getEmpresas = (params?: GetEmpresasParams) => {
    const queryParams = getUrlParams(params || {});
    return get<EmpresaPaginatedRes>(`/empresas?${queryParams}`, true);
};

export const getEmpresa = (id: number) => {
    return get<Empresa>(`/empresas/${id}/`, true);
};

export const createEmpresa = (data: CreateEmpresaParams) => {
    return post<Empresa>(`/empresas`, data, true);
};

export const updateEmpresa = ({ id, data }: UpdateEmpresaParams) => {
    return put<Empresa>(`/empresas/${id}/`, data, true);
};


export const deleteEmpresa = (id: number) => {
    return remove<Empresa>(`/empresas/${id}/`, true);
};


