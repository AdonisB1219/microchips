import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
  CustomAutocompleteArrString,
  CustomCellphoneTextField,
  CustomTabPanel,
  CustomTextField,
  FormTabsOnly,
  SampleDatePicker,
  TabsFormBoxScene,
  a11yProps,
} from '@/shared/components';
import { EspeciesPets, EsterilizadoPets, SexosPets, gridSizeMdLg6 } from '@/shared/constants';
import { PetPopulated } from '@/shared/interfaces';
import { petFormSchemaWithTutor } from '@/shared/utils';
import { formatDate } from '@/shared/utils/format-date';
import { CreatePetParams, useCreatePet, useUpdatePet } from '@/store/app/pets';
import { IconButton, InputAdornment, Tab } from '@mui/material';
import dayjs from 'dayjs';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import { returnUrlPestPage } from '../../../pages';

export interface SavePetProps {
  title: string;
  pet?: PetPopulated;
  onlyView?: boolean;
  isEditting?: boolean;
}

type SaveFormData = Omit<CreatePetParams, 'tutorId' | 'responsableId'> & {
  ///* tutor
  observaciones: string;
  nombre: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  email: string;
  password?: string;

  isEditting?: boolean;
};

const SavePet: React.FC<SavePetProps> = ({
  title,
  pet,
  onlyView = false,
  isEditting,
}) => {
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(1);
  const handleTabChange = useCallback((_event: any, newValue: number) => {
    setTabValue(newValue);
  }, []);
  const [showPassword, setShowPassword] = useState(false);

  ///* form
  const form = useForm<SaveFormData>({
    resolver: yupResolver(petFormSchemaWithTutor) as any,
    defaultValues: { isEditting: false },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  ///* mutations
  const createPetMutation = useCreatePet({
    navigate,
    returnUrl: returnUrlPestPage,
  });
  const updatePetMutation = useUpdatePet({
    navigate,
    returnUrl: returnUrlPestPage,
  });

  ///* handlers
  const onSave = async (data: SaveFormData) => {


    if (onlyView) return toast.error('No tienes permisos para editar');

    ///* upd
    if (pet?.id) {
      updatePetMutation.mutate({
        id: pet.id,
        data: {
          ...data,
          fecha_implantacion: dayjs(data.fecha_implantacion).format(
            'YYYY-MM-DDTHH:mm:ss[Z]'
          ),
          fecha_nacimiento: dayjs(data.fecha_nacimiento).format(
            'YYYY-MM-DDTHH:mm:ss[Z]'
          ),
        } as any,
      });
      return;
    } else {
      data.fecha_implantacion = dayjs(data.fecha_implantacion).format(
        'YYYY-MM-DDTHH:mm:ss[Z]'
      );
      data.fecha_nacimiento = dayjs(data.fecha_nacimiento).format(
        'YYYY-MM-DDTHH:mm:ss[Z]'
      )
    }

    ///* create
    createPetMutation.mutate({
      ...data,
      fecha_implantacion: dayjs(data.fecha_implantacion).format(
        'YYYY-MM-DDTHH:mm:ss[Z]'
      ),
      fecha_nacimiento: dayjs(data.fecha_nacimiento).format(
        'YYYY-MM-DDTHH:mm:ss[Z]'
      ),
    } as any);

    console.log("DATA SUBMITED -> ", data);

  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  ///* effects
  useEffect(() => {
    if (!pet?.id) return;

    reset({
      ...pet,

      // propietario
      nombre: pet?.Tutor?.user?.nombre,
      identificacion: pet?.Tutor?.user?.identificacion,
      direccion: pet?.Tutor?.user?.direccion,
      telefono: pet?.Tutor?.user?.telefono,
      email: pet?.Tutor?.user?.email,
      password: '',
      observaciones: pet?.Tutor?.observaciones,
      isEditting: true,

      fecha_implantacion: formatDate(pet.fecha_implantacion),
      fecha_nacimiento: formatDate(pet.fecha_nacimiento),
    });
  }, [pet, reset]);

  return (
    <TabsFormBoxScene
      titlePage={title}
      onCancel={() => navigate(returnUrlPestPage)}
      onSave={handleSubmit(onSave, () => {
        toast.error('Faltan campos requeridos');
      })}
      disableSubmitBtn={onlyView}
      tabs={
        <FormTabsOnly onChange={handleTabChange} value={tabValue}>
          <Tab label="Animal de compañía" value={1} {...a11yProps(1)} />
          <Tab label="Tutor" value={2} {...a11yProps(2)} />
        </FormTabsOnly>
      }
    >
      <CustomTabPanel value={tabValue} index={1}>
        <CustomTextField
          label="Nombre de animal de compañía"
          name="nombre_mascota"
          control={form.control}
          defaultValue={form.getValues().nombre_mascota}
          error={errors.nombre_mascota}
          helperText={errors.nombre_mascota?.message}
          disabled={onlyView}
        />

        <CustomTextField
          label="Codigo microchip"
          name="codigo_chip"
          control={form.control}
          defaultValue={form.getValues().codigo_chip}
          error={errors.codigo_chip}
          helperText={errors.codigo_chip?.message}
          disabled={onlyView}
        />

        <CustomTextField
          label="Lugar implantacion"
          name="lugar_implantacion"
          control={form.control}
          defaultValue={form.getValues().lugar_implantacion}
          error={errors.lugar_implantacion}
          helperText={errors.lugar_implantacion?.message}
          disabled={onlyView}
        />

        <SampleDatePicker
          label="Fecha implantacion"
          name="fecha_implantacion"
          control={form.control}
          defaultValue={form.getValues().fecha_implantacion}
          error={errors.fecha_implantacion}
          helperText={errors.fecha_implantacion?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
        />
        <SampleDatePicker
          label="Fecha Nacimiento"
          name="fecha_nacimiento"
          control={form.control}
          defaultValue={form.getValues().fecha_nacimiento}
          error={errors.fecha_nacimiento}
          helperText={errors.fecha_nacimiento?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
        />

        <CustomAutocompleteArrString
          label="Especie"
          name="especie"
          options={EspeciesPets}
          control={form.control}
          defaultValue={form.getValues().especie}
          error={errors.especie}
          helperText={errors.especie?.message}
          isLoadingData={false}
          size={gridSizeMdLg6}
          disabled={onlyView}
          disableClearable
        />

        <CustomTextField
          label="Raza"
          name="raza"
          control={form.control}
          defaultValue={form.getValues().raza}
          error={errors.raza}
          helperText={errors.raza?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
        />

        <CustomAutocompleteArrString
          label="Sexo"
          name="sexo"
          options={SexosPets}
          control={form.control}
          defaultValue={form.getValues().sexo}
          error={errors.sexo}
          helperText={errors.sexo?.message}
          isLoadingData={false}
          size={gridSizeMdLg6}
          disabled={onlyView}
          disableClearable
        />

        <CustomTextField
          label="Información adicional"
          name="ubicacion"
          control={form.control}
          defaultValue={form.getValues().ubicacion}
          error={errors.ubicacion}
          helperText={errors.ubicacion?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
        />

        <CustomAutocompleteArrString
          label="Esterilizado/a"
          name="esterilizado"
          options={EsterilizadoPets}
          control={form.control}
          defaultValue={form.getValues().esterilizado}
          error={errors.esterilizado}
          isLoadingData={false}
          helperText={errors.esterilizado?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
        />

        <CustomTextField
          label="Aga"
          name="aga"
          control={form.control}
          defaultValue={form.getValues().aga}
          error={errors.aga}
          helperText={errors.aga?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={2}>
        <CustomTextField
          label="Nombre"
          name="nombre"
          control={form.control}
          defaultValue={form.getValues().nombre}
          error={errors.nombre}
          helperText={errors.nombre?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
        />

        <CustomTextField
          label="Identificación"
          name="identificacion"
          control={form.control}
          defaultValue={form.getValues().identificacion}
          error={errors.identificacion}
          helperText={errors.identificacion?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
        />

        <CustomCellphoneTextField
          label="Telefono"
          name="telefono"
          control={form.control}
          defaultValue={form.getValues().telefono}
          error={errors.telefono}
          helperText={errors.telefono?.message}
          size={gridSizeMdLg6}
          disabled={onlyView}
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
          disabled={onlyView}
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
          disabled={onlyView || isEditting}
        />

        <CustomTextField
          label="Direccion"
          name="direccion"
          control={form.control}
          defaultValue={form.getValues().direccion}
          error={errors.direccion}
          helperText={errors.direccion?.message}
          disabled={onlyView}
        />
        <CustomTextField
          label="Observaciones"
          name="observaciones"
          control={form.control}
          defaultValue={form.getValues().observaciones}
          error={errors.observaciones}
          helperText={errors.observaciones?.message}
          disabled={onlyView}
        />
      </CustomTabPanel>
    </TabsFormBoxScene>
  );
};

export default SavePet;
