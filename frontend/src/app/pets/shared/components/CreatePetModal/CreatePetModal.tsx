import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { returnUrlPestPage } from '@/app/pets/pages';
import {
  CustomAutocompleteArrString,
  CustomAutocompleteDebouncer,
  CustomTextField,
  SampleDatePicker,
  ScrollableDialogProps,
} from '@/shared/components';
import { EspeciesPets, SexosPets, gridSizeMdLg6, EsterilizadoPets } from '@/shared/constants';
import { useDebouncer } from '@/shared/hooks/useDebouncer';
import { Tutor } from '@/shared/interfaces';
import { petFormSchema } from '@/shared/utils';
import { CreatePetParams, useCreatePet } from '@/store/app/pets';
import { useFetchTutorsEnabled } from '@/store/app/propietarios';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export interface CreatePetModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type SaveFormData = Omit<CreatePetParams, 'tutorId' | 'responsableId'> & {
  tutorId: string;
};

const CreatePetModal: React.FC<CreatePetModalProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();

  ///* local state
  const [isAddMascotaToTutor, setIsAddMascotaToTutor] = useState(false);

  const [searchTurorTerm, setSearchTutorTerm] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  ///* debouncer
  const { onChangeFilter, searchTerm } = useDebouncer({
    searchTerm: searchTurorTerm,
    setSearchTerm: setSearchTutorTerm,
  });

  ///* fetch data
  const { data: tutosrPagingRes, isLoading: isLoadingTutors } =
    useFetchTutorsEnabled(open, {
      page_size: 15,
      nombre: searchTerm,
    });

  ///* mutations
  const createPetMutation = useCreatePet({
    navigate,
    returnUrl: returnUrlPestPage,
  });

  ///* form
  const form = useForm<SaveFormData>({
    resolver: yupResolver(petFormSchema) as any,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  ///* handlers
  const onSave = async (data: SaveFormData) => {
    ///* create
    createPetMutation.mutate({
      ...data,
      tutorId: +data.tutorId,
      fecha_implantacion: dayjs(data.fecha_implantacion).format(
        'YYYY-MM-DDTHH:mm:ss[Z]'
      ),
      fecha_nacimiento: dayjs(data.fecha_nacimiento).format(
        'YYYY-MM-DDTHH:mm:ss[Z]'
      ),
    } as any);

    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setIsAddMascotaToTutor(false);
    form.reset();
  };

  useEffect(() => {
    if (!isAddMascotaToTutor || isLoadingTutors) return;

    if (!tutosrPagingRes?.data?.length)
      toast.warning(
        'No existen tutores registrados a los que agregar animales de compañía'
      );
  }, [isAddMascotaToTutor, isLoadingTutors, tutosrPagingRes]);

  return (
    <>
      <ScrollableDialogProps
        open={open}
        title="Registrar animal de compañía"
        minWidth="40%" // default value
        onClose={handleClose}
        // custom actions
        showCustomActions
        customActions={
          <>
            <Button variant="text" onClick={handleClose}>
              Cancelar
            </Button>

            {isAddMascotaToTutor && (
              <Button
                variant="outlined"
                onClick={() => {
                  handleSubmit(onSave, () => {
                    toast.error('Faltan campos requeridos');
                  })();
                }}
              >
                Guardar
              </Button>
            )}
          </>
        }
        contentNode={
          <Grid
            item
            xs={12}
            container
            spacing={4}
            mt={0}
            alignItems="center"
            justifyContent="center"
            pb={5}
          >
            <Grid item container xs={12} justifyContent="flex-end">
              {/* -------- new tutor and pet -------- */}
              <Button
                style={{ maxHeight: '40px', margin: '0px 2px' }}
                color={'primary'}
                startIcon={<FaPlus />}
                variant="text"
                onClick={() => {
                  navigate(`${returnUrlPestPage}/registrar`);
                }}
              >
                Animal de compañía y tutor
              </Button>

              {/* ----- add pet to tutor ----- */}
              <Button
                style={{ maxHeight: '40px', margin: '0px 2px' }}
                color={'primary'}
                startIcon={<FaPlus />}
                variant="text"
                onClick={() => {
                  setIsAddMascotaToTutor(true);
                }}
              >
                Agregar animal de compañía a tutor
              </Button>
            </Grid>

            {/* form */}
            <Grid item xs={12} container spacing={2}>
              {/* form */}
              {isAddMascotaToTutor && (
                <>
                  <CustomAutocompleteDebouncer<Tutor>
                    label="Tutor"
                    name="tutorId"
                    // options
                    options={tutosrPagingRes?.data || []}
                    valueKey="nombre_tutor"
                    actualValueKey="id"
                    defaultValue={form.getValues().tutorId || ''}
                    optionLabelForEdit={
                      (form.getValues()?.tutorId as any) || ''
                    }
                    isLoadingData={isLoadingTutors}
                    // validation
                    control={form.control}
                    error={errors.tutorId}
                    helperText={errors.tutorId?.message}
                    // onChangeInput
                    onChangeValue={() => {
                      setIsTouched(true);
                    }}
                    onChangeInputText={async value => {
                      // search with debouncer
                      !isTouched && setIsTouched(true);
                      onChangeFilter(value);
                    }}
                  />

                  {/* --- pet --- */}
                  <CustomTextField
                    label="Nombre animal de compañía"
                    name="nombre_mascota"
                    control={form.control}
                    defaultValue={form.getValues().nombre_mascota}
                    error={errors.nombre_mascota}
                    helperText={errors.nombre_mascota?.message}
                  />

                  <CustomTextField
                    label="Codigo microchip"
                    name="codigo_chip"
                    control={form.control}
                    defaultValue={form.getValues().codigo_chip}
                    error={errors.codigo_chip}
                    helperText={errors.codigo_chip?.message}
                    
                  />

                  <CustomTextField
                    label="Lugar implantacion"
                    name="lugar_implantacion"
                    control={form.control}
                    defaultValue={form.getValues().lugar_implantacion}
                    error={errors.lugar_implantacion}
                    helperText={errors.lugar_implantacion?.message}
                  />

                  <SampleDatePicker
                    label="Fecha implantacion"
                    name="fecha_implantacion"
                    control={form.control}
                    defaultValue={form.getValues().fecha_implantacion}
                    error={errors.fecha_implantacion}
                    helperText={errors.fecha_implantacion?.message}
                    size={gridSizeMdLg6}
                  />
                  <SampleDatePicker
                    label="Fecha Nacimiento"
                    name="fecha_nacimiento"
                    control={form.control}
                    defaultValue={form.getValues().fecha_nacimiento}
                    error={errors.fecha_nacimiento}
                    helperText={errors.fecha_nacimiento?.message}
                    size={gridSizeMdLg6}
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
                    required={false}
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
        />

                  <CustomTextField
                    label="AGA"
                    name="aga"
                    control={form.control}
                    defaultValue={form.getValues().aga}
                    error={errors.aga}
                    helperText={errors.aga?.message}
                    size={gridSizeMdLg6}
                    required={false}
                  />
                </>
              )}
            </Grid>
          </Grid>
        }
      />
    </>
  );
};

export default CreatePetModal;
