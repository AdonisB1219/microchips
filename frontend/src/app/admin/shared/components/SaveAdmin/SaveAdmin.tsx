import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton, InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import {
  CustomCellphoneTextField,
  CustomTextField,
  SingleFormBoxScene,
} from '@/shared/components';
import { gridSizeMdLg6 } from '@/shared/constants';
import { Admin } from '@/shared/interfaces';
import { adminFormSchema } from '@/shared/utils';
import {
  CreateAdminParams,
  useCreateAdmin,
  useUpdateAdmin,
} from '@/store/app/admin';
import { returnUrlAdmisnPage } from '../../../pages';

export interface SaveAdminProps {
  title: string;
  admin?: Admin;
}

type SaveFormData = CreateAdminParams & {
  isEditting?: boolean;
  password?: string;
};

const SaveAdmin: React.FC<SaveAdminProps> = ({ title, admin }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  ///* form
  const form = useForm<SaveFormData>({
    resolver: yupResolver(adminFormSchema as any),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = form;

  ///* mutations
  const createAdminMutation = useCreateAdmin({
    navigate,
    returnUrl: returnUrlAdmisnPage,
  });
  const updateAdminMutation = useUpdateAdmin({
    navigate,
    returnUrl: returnUrlAdmisnPage,
  });

  ///* handlers
  const onSave = async (data: SaveFormData) => {
    if (!isValid) return;

    ///* upd
    if (admin?.id) {
      updateAdminMutation.mutate({ id: admin.id, data });
      return;
    }

    ///* create
    createAdminMutation.mutate(data);
  };

  ///* effects
  useEffect(() => {
    if (!admin?.id) return;

    reset({
      ...admin,
      isEditting: true,
    });
  }, [admin, reset]);

  return (
    <SingleFormBoxScene
      titlePage={title}
      onCancel={() => navigate(returnUrlAdmisnPage)}
      onSave={handleSubmit(onSave, () => {})}
    >
      <CustomTextField
        label="Nombre"
        name="nombre"
        control={form.control}
        defaultValue={form.getValues().nombre}
        error={errors.nombre}
        helperText={errors.nombre?.message}
        size={gridSizeMdLg6}
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
        label="Direccion"
        name="direccion"
        control={form.control}
        defaultValue={form.getValues().direccion}
        error={errors.direccion}
        helperText={errors.direccion?.message}
        size={gridSizeMdLg6}
      />

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
    </SingleFormBoxScene>
  );
};

export default SaveAdmin;
