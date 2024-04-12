import { Navigate, useParams } from 'react-router-dom';

import { useGetAdmin } from '@/store/app/admin';
import { returnUrlAdmisnPage } from '../AdmisnPage/AdmisnPage';
import { SaveAdmin } from './../../shared/components';

export type UpdateAdminPageProps = {};

const UpdateAdminPage: React.FC<UpdateAdminPageProps> = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetAdmin(+id!);

  if (isLoading) return null;
  if (!data?.id) return <Navigate to={returnUrlAdmisnPage} />;

  return <SaveAdmin title="Editar Admin" admin={data} />;
};

export default UpdateAdminPage;
