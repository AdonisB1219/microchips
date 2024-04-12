import { useIsAdminOrVeterinarian } from '@/shared/hooks';
import { SavePet } from './../../shared/components';

export type CreatePetPageProps = {};

const CreatePetPage: React.FC<CreatePetPageProps> = () => {
  useIsAdminOrVeterinarian();

  return <SavePet title="Registrar animal de compañía" />;
};

export default CreatePetPage;
