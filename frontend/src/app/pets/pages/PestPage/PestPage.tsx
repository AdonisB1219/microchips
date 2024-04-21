import { Box, IconButton, Tooltip } from '@mui/material';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MRT_ColumnDef } from 'material-react-table';
import { useMemo, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import {
  CustomSearch,
  CustomTable,
  ExportExcelButton,
  SingleTableBoxScene,
} from '@/shared/components';
import { useTableFilter } from '@/shared/hooks/useTableFilter';
import { Pet, PetPopulated } from '@/shared/interfaces';
import { emptyCellOneLevel, getEnvs } from '@/shared/utils';
import { formatDate } from '@/shared/utils/format-date';
import { useDeletePet, useFetchMyPets, useFetchPets } from '@/store/app/pets';
import { useAuthStore } from '@/store/auth';
import { useUiConfirmModalStore } from '@/store/ui';
import { toast } from 'react-toastify';
import { CreatePetModal } from '../../shared/components/CreatePetModal';

export const returnUrlPestPage = '/dashboard/mascotas';

const { VITE_API_URL } = getEnvs();

export type PestPageProps = {};

const PestPage: React.FC<PestPageProps> = () => {
  const navigate = useNavigate();

  ///* local state
  const [isOpenModal, setIsOpenModal] = useState(false);

  ///* global state
  const setConfirmDialog = useUiConfirmModalStore(s => s.setConfirmDialog);
  const setConfirmDialogIsOpen = useUiConfirmModalStore(
    s => s.setConfirmDialogIsOpen
  );
  const user = useAuthStore(s => s.user);

  ///* mutations
  const deletePet = useDeletePet();

  ///* table
  const {
    globalFilter,
    pagination,
    searchTerm,
    onChangeFilter,
    setPagination,
  } = useTableFilter();
  const { pageIndex, pageSize } = pagination;

  ///* fetch data
  const {
    data: PestPagingRes,
    isLoading,
    isRefetching,
  } = useFetchPets(!!user?.rolId && user?.rolId > 1, {
    page: pageIndex + 1,
    page_size: pageSize,
    nombre_tutor: searchTerm,
  });

  // mypets
  const {
    data: myPets,
    isLoading: isLoadingMyPets,
    isRefetching: isRefetchingMyPets,
  } = useFetchMyPets(!!user?.rolId && user?.rolId === 1, {
    page: pageIndex + 1,
    page_size: pageSize,
    nombre_mascota: searchTerm,
  });

  ///* handlers
  const onEdit = (pet: Pet) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Editar Pet',
      subtitle: '¿Está seguro que desea editar al animal de compañía?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        navigate(`${returnUrlPestPage}/editar/${pet.id}`);
      },
    });
  };

  const onDelete = (pet: Pet) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Pet',
      subtitle: '¿Está seguro que desea eliminar este Pet?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        deletePet.mutate(pet.id!);
      },
    });
  };

  const handleCLickCreatePet = () => {
    // navigate(`${returnUrlPestPage}/registrar`);
    setIsOpenModal(true);
  };

  ///* export to excel
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    // data based on user role
    const data = user?.rolId === 1
      ? myPets?.data || []
      : PestPagingRes?.data || [];
    if (!data.length) {
      return toast.warning('No hay datos para exportar');
    }

    const flattenedData = data.map(item => {
      const { Tutor, Veterinario, ...rest } = item;

      return {
        ...rest,
        // veterniario
        nombre_veterinario: Veterinario?.user?.nombre || 'N/A',
        identificacion_veterinario: Veterinario?.user?.identificacion || 'N/A',
        telefono_veterinario: Veterinario?.user?.telefono || 'N/A',
        email_veterinario: Veterinario?.user?.email || 'N/A',
        // tutor
        nombre_tutor: Tutor?.user?.nombre || 'N/A',
        identificacion_tutor: Tutor?.user?.identificacion || 'N/A',
        telefono_tutor: Tutor?.user?.telefono || 'N/A',
        email_tutor: Tutor?.user?.email || 'N/A',
      };
    });
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  ///* columns
  const columns = useMemo<MRT_ColumnDef<PetPopulated>[]>(
    () => [
      {
        accessorKey: 'nombre_mascota',
        header: 'Nombre animal de compañía',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'nombre_mascota'),
      },

      {
        accessorKey: 'codigo_chip',
        header: 'Codigo chip',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'codigo_chip'),
      },

      {
        accessorKey: 'lugar_implantacion',
        header: 'Lugar implantacion',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'lugar_implantacion'),
      },

      {
        accessorKey: 'fecha_implantacion',
        header: 'Fecha implantacion',
        size: 180,
        Cell: ({ row }) =>
          row.original?.fecha_implantacion
            ? formatDate(row.original?.fecha_implantacion)
            : 'N/A',
      },

      {
        accessorKey: 'fecha_nacimiento',
        header: 'Fecha nacimiento',
        size: 180,
        Cell: ({ row }) =>
          row.original?.fecha_nacimiento
            ? formatDate(row.original?.fecha_nacimiento)
            : 'N/A',
      },

      {
        accessorKey: 'especie',
        header: 'Especie',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'especie'),
      },

      {
        accessorKey: 'raza',
        header: 'Raza',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'raza'),
      },


      {
        accessorKey: 'sexo',
        header: 'Sexo',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'sexo'),
      },

      {
        accessorKey: 'ubicacion',
        header: 'Información adicional',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'ubicacion'),
      },

      {
        accessorKey: 'esterilizado',
        header: 'Esterilizado/a',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'esterilizado'),
      },

      {
        accessorKey: 'Tutor.user.nombre',
        header: 'Tutor',
        size: 180,
        Cell: ({ row }) => row.original?.Tutor?.user?.nombre || 'N/A',
      },

      {
        accessorKey: 'Veterinario.user.nombre',
        header: 'Responsable',
        size: 180,
        Cell: ({ row }) => row.original?.Veterinario?.user?.nombre || 'N/A',
      },
    ],
    []
  );

  return (
    <SingleTableBoxScene
      title="Animal de compañía"
      showCreateBtn={ !!user?.rolId && user?.rolId > 1 && user?.rolId != 4}
      onClickCreateBtn={handleCLickCreatePet}
    >
      <CustomSearch
        onChange={onChangeFilter}
        value={globalFilter}
        text={`por nombre ${user?.rolId === 1 ? 'del animal de compañía' : 'del tutor'}`}
      />

      <CustomTable<PetPopulated>
        columns={columns}
        data={user?.rolId === 1 ? myPets?.data || [] : PestPagingRes?.data || []}
        isLoading={user?.rolId === 1 ? isLoadingMyPets : isLoading}
        isRefetching={user?.rolId === 1 ? isRefetchingMyPets : isRefetching}
        // // search
        enableGlobalFilter={false}
        // // pagination
        pagination={pagination}
        onPaging={setPagination}
        rowCount={
          user?.rolId === 1 ? myPets?.count || 0 : PestPagingRes?.count || 0
        }
        // // actions
        actionsColumnSize={180}
        showOneCustomButton
        oneCustomButton={pet => (
          <>
            {(user?.rolId && user?.rolId > 1) ? (
              <>
                <Tooltip title="Editar">
                  <IconButton
                    onClick={() => {
                      onEdit(pet);
                    }}
                  >
                    <MdEdit />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Ver">
                  <IconButton
                    onClick={() => {
                      navigate(`${returnUrlPestPage}/ver/${pet.id}`);
                    }}
                  >
                    <MdVisibility />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}

            {/* pdf */}
            <>
              <Box
                sx={{
                  display: 'flex',
                  gap: '16px',
                  padding: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <Tooltip title="Exportar">
                  <IconButton
                    onClick={async () => {
                      window.open(
                        `${VITE_API_URL}/pdfs/pet/${pet.id}`,
                        '_blank'
                      );
                    }}
                  >
                    <FaFilePdf />
                  </IconButton>
                </Tooltip>
              </Box>
            </>

            {user?.rolId && user?.rolId > 3 ? (
              <>
                <Tooltip title="Eliminar">
                  <IconButton
                    onClick={() => {
                      onDelete(pet);
                    }}
                    sx={{ color: '#922D50' }}
                  >
                    <MdDelete />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
          </>
        )}
        // excel
        renderTopToolbarCustomActions={() => {
          return <ExportExcelButton handleExportData={handleExportData} />;
        }}
      />

      {/* modals */}
      <CreatePetModal open={isOpenModal} setOpen={setIsOpenModal} />
    </SingleTableBoxScene>
  );
};

export default PestPage;
