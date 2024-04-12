import { Navigate, useParams } from 'react-router-dom';

import { useIsAdminOrVeterinarian } from '@/shared/hooks';
import { useGetPet } from '@/store/app/pets';
import { returnUrlPestPage } from '../PestPage/PestPage';
import { SavePet } from './../../shared/components';

export type UpdatePetPageProps = {};


const UpdatePetPage: React.FC<UpdatePetPageProps> = () => {
  useIsAdminOrVeterinarian();

  const { id } = useParams();
  const { data, isLoading } = useGetPet(+id!);

  if (isLoading) return null;
  if (!data?.id) return <Navigate to={returnUrlPestPage} />;

  return <SavePet title="Editar animal de compañía" pet={data} isEditting />;
};

export default UpdatePetPage;
