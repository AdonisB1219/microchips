import { yupResolver } from '@hookform/resolvers/yup';
import { IconButton, InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  CustomAutocompleteArrString,
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
import { useFetchEmpresas } from '@/store/app/empresas';
import { useAuthStore } from '@/store/auth';

export interface SaveAdminProps {
  title: string;
  admin?: Admin;
}

type SaveFormData = CreateAdminParams & {
  isEditting?: boolean;
  password?: string;
  empresa?: string;
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

  const fetchEmpresas = useFetchEmpresas();
  const user = useAuthStore(s => s.user);
  const isSupAdmin = user?.rolId && user?.rolId > 3;


  ///* handlers
  const onSave = async (data: SaveFormData) => {

    if (!isValid) return;
    ///* upd
    if (admin?.id) {
      if (isSupAdmin) {
        let empresaId = fetchEmpresas.data?.data.filter(empresa => empresa.nombre_empresa === String(data.empresa))[0].id;
  
        let adminData = {
          ...data,
          empresaId: empresaId
        };
  
  
        updateAdminMutation.mutate({id: admin.id, data: adminData});
  
      } else{
        updateAdminMutation.mutate({ id: admin.id, data });
        return;
      }
      

    }

    else {
      if (isSupAdmin) {
        let empresaId = fetchEmpresas.data?.data.filter(empresa => empresa.nombre_empresa === String(data.empresa))[0].id;
  
        let admin = {
          ...data,
          empresaId: empresaId
        };
  
  
        createAdminMutation.mutate(admin);
  
      } else {
  
        ///* create
        createAdminMutation.mutate(data);
      }
  
    }


  };


  ///* effects
  useEffect(() => {
    

    if (!admin?.id) return;

    reset({
      ...admin,
      isEditting: true,
      empresa: admin.Empresa.nombre_empresa
    });
  }, [admin, reset]);

  let empresasNombres: string[] = [];

  if (isSupAdmin) {
    let fetchedEmpresas = useFetchEmpresas().data?.data;
    if (fetchedEmpresas) {
      empresasNombres = fetchedEmpresas.map(empresa => empresa.nombre_empresa);
    }
  }


  return (
    <SingleFormBoxScene
      titlePage={title}
      onCancel={() => navigate(returnUrlAdmisnPage)}
      onSave={handleSubmit(onSave, () => { })}
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
        (isSupAdmin) ?
          (<CustomAutocompleteArrString
            label="Empresa"
            name="empresa"
            options={empresasNombres}
            control={form.control}
            defaultValue={form.getValues().Empresa?.nombre_empresa}
            error={errors.Empresa?.nombre_empresa}
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

export default SaveAdmin;
