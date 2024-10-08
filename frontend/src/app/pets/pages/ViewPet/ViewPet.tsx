import { Navigate, useParams } from 'react-router-dom';

import { useGetPet } from '@/store/app/pets';
import { returnUrlPestPage } from '..';
import { SavePet } from '../../shared/components';
import { useIsAdminOrVeterinarian } from '@/shared/hooks';

export interface ViewPetProps {}

const ViewPet: React.FC<ViewPetProps> = () => {
  useIsAdminOrVeterinarian();

  const { id } = useParams();
  const { data, isLoading } = useGetPet(+id!);

  if (isLoading) return null;
  if (!isLoading && !data?.id) return <Navigate to={returnUrlPestPage} />;

  return <SavePet title="Ver animal de compañía" pet={data} onlyView />;
};

export default ViewPet;
