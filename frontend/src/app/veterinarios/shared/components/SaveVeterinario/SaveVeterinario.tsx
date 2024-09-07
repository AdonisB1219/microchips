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
import { useIsAdmin } from '@/shared/hooks';
import { Veterinario } from '@/shared/interfaces';
import { veterinarioFormSchema } from '@/shared/utils';
import {
  CreateVeterinarioParams,
  useCreateVeterinario,
  useUpdateVeterinario,
} from '@/store/app/veterinarios';
import { IconButton, InputAdornment } from '@mui/material';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { returnUrlVeterinarisoPage } from '../../../pages';
import { useFetchEmpresas } from '@/store/app/empresas';
import { useAuthStore } from '@/store/auth';

export interface SaveVeterinarioProps {
  title: string;
  veterinario?: Veterinario;
}

type SaveFormData = CreateVeterinarioParams & {};

const SaveVeterinario: React.FC<SaveVeterinarioProps> = ({
  title,
  veterinario,
}) => {
  const navigate = useNavigate();
  useIsAdmin();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  ///* form
  const form = useForm<SaveFormData>({
    resolver: yupResolver(veterinarioFormSchema) as any,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = form;

  ///* mutations
  const createVeterinarioMutation = useCreateVeterinario({
    navigate,
    returnUrl: returnUrlVeterinarisoPage,
  });
  const updateVeterinarioMutation = useUpdateVeterinario({
    navigate,
    returnUrl: returnUrlVeterinarisoPage,
  });

  ///* handlers
  const onSave = async (data: SaveFormData) => {
    if (!isValid) return;

    ///* upd
    if (veterinario?.id) {
      updateVeterinarioMutation.mutate({ id: veterinario?.id, data });
      return;
    }

    ///* create
    createVeterinarioMutation.mutate(data);
  };

  
  let empresas: string[] = [];

  const user = useAuthStore(s => s.user);
  const isSupAdmin = user?.rolId && user?.rolId > 3;

  if (isSupAdmin) {
    let fetchedEmpresas = useFetchEmpresas().data?.data;
    if (fetchedEmpresas) {
      empresas = fetchedEmpresas.map(empresa => empresa.nombre_empresa);
    }
  }

  ///* effects
  useEffect(() => {
    if (!veterinario?.id) return;
    reset({
      ...veterinario,
      /// user
      password: '',
      email: veterinario?.user?.email,
      direccion: veterinario?.user?.direccion,
      telefono: veterinario?.user?.telefono,
      identificacion: veterinario?.user?.identificacion,
      nombre: veterinario?.user?.nombre,
    });
  }, [veterinario, reset]);

  return (
    <SingleFormBoxScene
      titlePage={title}
      onCancel={() => navigate(returnUrlVeterinarisoPage)}
      onSave={handleSubmit(onSave, () => {
        console.log(errors);
      })}
    >
      <CustomTextField
        label="Nombre"
        name="nombre"
        control={form.control}
        defaultValue={form.getValues().nombre}
        error={errors.nombre}
        helperText={errors.nombre?.message}
      />

      <CustomTextField
        label="Identificacion"
        name="identificacion"
        control={form.control}
        defaultValue={form.getValues().identificacion}
        error={errors.identificacion}
        helperText={errors.identificacion?.message}
        size={gridSizeMdLg6}
      />

      <CustomTextField
        label="No. registro"
        name="no_registro"
        control={form.control}
        defaultValue={form.getValues().no_registro}
        error={errors.no_registro}
        helperText={errors.no_registro?.message}
        size={gridSizeMdLg6}
      />

      {/* <CustomTextField
        label="Aga"
        name="aga"
        control={form.control}
        defaultValue={form.getValues().aga}
        error={errors.aga}
        helperText={errors.aga?.message}
        size={gridSizeMdLg6}
      /> */}

      <CustomCellphoneTextField
        label="Telefono"
        name="telefono"
        control={form.control}
        defaultValue={form.getValues().telefono}
        error={errors.telefono}
        helperText={errors.telefono?.message}
        size={gridSizeMdLg6}
      />

      <CustomTextField
        label="Email"
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
        (isSupAdmin && empresas) ?
          (<CustomAutocompleteArrString
            label="Empresa"
            name="empresa"
            options={empresas}
            control={form.control}
            defaultValue={''}
            error={errors.empresa?.nombre_empresa}
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

export default SaveVeterinario;
