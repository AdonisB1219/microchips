import { Navigate, useParams } from 'react-router-dom';
import { returnUrlEmpresasPage } from '../EmpresasPage/EmpresasPage';
import { SaveEmpresa } from './../../shared/components';
import { useGetEmpresa } from '@/store/app/empresas';

export type UpdateEmpresaPageProps = {};

const UpdateEmpresaPage: React.FC<UpdateEmpresaPageProps> = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetEmpresa(+id!);

    if (isLoading) return null;
    if (!data?.id) return <Navigate to={returnUrlEmpresasPage} />;

    return <SaveEmpresa title="Editar Empresa" empresa={data} />;
};

export default UpdateEmpresaPage;