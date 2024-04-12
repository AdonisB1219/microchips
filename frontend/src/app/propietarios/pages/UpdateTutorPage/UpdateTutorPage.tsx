import { Navigate, useParams } from 'react-router-dom';

import { SaveTutor } from './../../shared/components';
import { useGetTutor } from '@/store/app/propietarios';
import { returnUrlTutosrPage } from '../TutosrPage/TutosrPage';

export type UpdateTutorPageProps = {};

const UpdateTutorPage: React.FC<UpdateTutorPageProps> = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetTutor(+id!);

  if (isLoading) return null;
  if (!data?.id) return <Navigate to={returnUrlTutosrPage} />;

  return <SaveTutor
    title="Editar Tutor"
    tutor={data}
  />;
};

export default UpdateTutorPage;
