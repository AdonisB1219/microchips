import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  CustomAutocompleteArrString,
  CustomCellphoneTextField,
  CustomTextField,
  SingleFormBoxScene,
} from '@/shared/components';
import { gridSizeMdLg6 } from '@/shared/constants';
import { Propietario } from '@/shared/interfaces';
import { tutorFormSchema } from '@/shared/utils';
import {
  CreateTutorParams,
  useCreateTutor,
  useUpdateTutor,
} from '@/store/app/propietarios';
import { IconButton, InputAdornment } from '@mui/material';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { returnUrlTutosrPage } from '../../../pages';
import { useFetchEmpresas } from '@/store/app/empresas';
import { useAuthStore } from '@/store/auth';

export interface SaveTutorProps {
  title: string;
  tutor?: Propietario;
}

type SaveFormData = CreateTutorParams & {
  password?: string;
  email?: string;
  direccion?: string;
  telefono?: string;
  identificacion?: string;
  nombre?: string;
  observaciones?: string;
  empresa?: string;
  isEditting?: boolean;
};

const SaveTutor: React.FC<SaveTutorProps> = ({ title, tutor }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const user = useAuthStore(s => s.user);
  const isSupAdmin = user?.rolId && user?.rolId > 3;

  const fetchEmpresas = useFetchEmpresas();


  ///* form
  const form = useForm<SaveFormData>({
    resolver: yupResolver(tutorFormSchema) as any,
    defaultValues: {
      isEditting: false,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = form;

  ///* mutations
  const createTutorMutation = useCreateTutor({
    navigate,
    returnUrl: returnUrlTutosrPage,
  });
  const updateTutorMutation = useUpdateTutor({
    navigate,
    returnUrl: returnUrlTutosrPage,
  });

  ///* handlers
  const onSave = async (data: SaveFormData) => {

    if (!isValid) return;

    ///* upd
    if (tutor?.id) {
      
    if (isSupAdmin) {
      let empresaId = fetchEmpresas.data?.data.filter(empresa => empresa.nombre_empresa === String(data.empresa))[0].id;

      let tutorAdmin = {
        ...data,
        empresaId: empresaId
      };

      updateTutorMutation.mutate({id: tutor.id, data: tutorAdmin});

    } else {
      //* create
      updateTutorMutation.mutate({id: tutor.id, data: tutor});
    }
      return;
    }

    if (isSupAdmin) {
      let empresaId = fetchEmpresas.data?.data.filter(empresa => empresa.nombre_empresa === String(data.empresa))[0].id;

      let tutor = {
        ...data,
        empresaId: empresaId
      };

      createTutorMutation.mutate(tutor);

    } else {
      //* create
    createTutorMutation.mutate(data);
    }


  };
  
  let empresas: string[] = [];

  if (isSupAdmin) {
    let fetchedEmpresas = useFetchEmpresas().data?.data;
    if (fetchedEmpresas) {
      empresas = fetchedEmpresas.map(empresa => empresa.nombre_empresa);
    }
  }

  ///* effects
  useEffect(() => {
    if (!tutor?.id) return;

    const user = tutor.user;
    
    reset({
      ...tutor,

      /// user
      password: '',
      email: user.email,
      direccion: user.direccion,
      telefono: user.telefono,
      identificacion: user.identificacion,
      nombre: user.nombre,
      empresa: user.Empresa?.nombre_empresa,

      isEditting: true,
    });
    
  }, [tutor, reset]);

  return (
    <SingleFormBoxScene
      titlePage={title}
      onCancel={() => navigate(returnUrlTutosrPage)}
      onSave={handleSubmit(onSave, (errors) => { console.log(errors);})}
    >
      <CustomTextField
        label="nombre"
        name="nombre"
        control={form.control}
        defaultValue={form.getValues().nombre}
        error={errors.nombre}
        helperText={errors.nombre?.message}
        size={gridSizeMdLg6}
      />

      <CustomTextField
        label="identificacion"
        name="identificacion"
        control={form.control}
        defaultValue={form.getValues().identificacion}
        error={errors.identificacion}
        helperText={errors.identificacion?.message}
        size={gridSizeMdLg6}
      />

      <CustomTextField
        label="observaciones"
        name="observaciones"
        control={form.control}
        defaultValue={form.getValues().observaciones}
        error={errors.observaciones}
        helperText={errors.observaciones?.message}
        size={gridSizeMdLg6}
      />

<CustomTextField
        label="direccion"
        name="direccion"
        control={form.control}
        defaultValue={form.getValues().direccion}
        error={errors.direccion}
        helperText={errors.direccion?.message}
        size={gridSizeMdLg6}
      />

      <CustomCellphoneTextField
        label="telefono"
        name="telefono"
        control={form.control}
        defaultValue={form.getValues().telefono}
        error={errors.telefono}
        helperText={errors.telefono?.message}
        size={gridSizeMdLg6}
      />

      <CustomTextField
        label="email"
        name="email"
        type="email"
        control={form.control}
        defaultValue={form.getValues().email}
        error={errors.email}
        helperText={errors.email?.message}
        size={gridSizeMdLg6}
      />

      <CustomTextField
        label="Contraseña"
        name="password"
        overrideAsPassword // avoid uppercase in text mode
        control={form.control}
        defaultValue={form.getValues().password}
        error={form.formState.errors.password}
        helperText={form.formState.errors.password?.message}
        type={showPassword ? 'text' : 'password'}
        endAdornmentInput={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </IconButton>
          </InputAdornment>
        }
        size={gridSizeMdLg6}
      />
                    {
        (isSupAdmin ) ?
          (<CustomAutocompleteArrString
            label="Empresa"
            name="empresa"
            options={empresas}
            control={form.control}
            defaultValue={form.getValues().empresa ?? ''}
            error={errors.user?.Empresa?.nombre_empresa}
            helperText={'Introduce una empresa'}
            isLoadingData={false}
            size={gridSizeMdLg6}
            disableClearable
          />) :
          (<></>)
      }
    </SingleFormBoxScene>
  );
};

export default SaveTutor;
