import { Navigate, useParams } from 'react-router-dom';
import { useGetVeterinario } from '@/store/app/veterinarios';
import { returnUrlVeterinarisoPage } from '../VeterinarisoPage/VeterinarisoPage';
import { SaveVeterinario } from './../../shared/components';

export type UpdateVeterinarioPageProps = {};

const UpdateVeterinarioPage: React.FC<UpdateVeterinarioPageProps> = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetVeterinario(+id!);

  if (isLoading) return null;
  if (!data?.id) return <Navigate to={returnUrlVeterinarisoPage} />;

  return <SaveVeterinario title="Editar Veterinario" veterinario={data} />;
};

export default UpdateVeterinarioPage;