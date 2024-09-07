import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CustomSearch,
  CustomTable,
  ExportExcelButton,
  SingleTableBoxScene,
} from '@/shared/components';
import { useIsAdmin } from '@/shared/hooks';
import { useTableFilter } from '@/shared/hooks/useTableFilter';
import { Veterinario } from '@/shared/interfaces';
import { emptyCellOneLevel } from '@/shared/utils';
import {
  useDeleteVeterinario,
  useFetchVeterinarios,
} from '@/store/app/veterinarios';
import { useUiConfirmModalStore } from '@/store/ui';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/auth';

export const returnUrlVeterinarisoPage = '/dashboard/veterinarios';

export type VeterinarisoPageProps = {};

const VeterinarisoPage: React.FC<VeterinarisoPageProps> = () => {
  const navigate = useNavigate();
  useIsAdmin();
  const user = useAuthStore(s => s.user);
  const isSupAdmin = user?.rolId && user?.rolId > 3;

  ///* global state
  const setConfirmDialog = useUiConfirmModalStore(s => s.setConfirmDialog);
  const setConfirmDialogIsOpen = useUiConfirmModalStore(
    s => s.setConfirmDialogIsOpen
  );

  ///* mutations
  const deleteVeterinario = useDeleteVeterinario();

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
    data: VeterinarisoPagingRes,
    isLoading,
    isRefetching,
  } = useFetchVeterinarios({
    page: pageIndex + 1,
    page_size: pageSize,
    nombre: searchTerm,
  });

  ///* handlers
  const onEdit = (veterinario: Veterinario) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Editar Veterinario',
      subtitle: '¿Está seguro que desea editar este Veterinario?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        navigate(`${returnUrlVeterinarisoPage}/editar/${veterinario.id}`);
      },
    });
  };

  const onDelete = (veterinario: Veterinario) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Veterinario',
      subtitle: '¿Está seguro que desea eliminar este Veterinario?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        deleteVeterinario.mutate(veterinario.id!);
      },
    });
  };

  ///* export to excel
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const data = VeterinarisoPagingRes?.data || [];
    if (!data.length) {
      return toast.warning('No hay datos para exportar');
    }

    const flattenedData = data.map(item => {
      const { user, ...rest } = item;
      return {
        ...rest,
        no_registro: String(item.no_registro),
        nombre: user?.nombre,
        identificacion: String(user?.identificacion),
        direccion: user?.direccion,
        telefono: String(user?.telefono),
        email: user?.email,
      };
    });
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  ///* columns
  const columns = useMemo<MRT_ColumnDef<Veterinario>[]>(
    () => {
      const baseColumns: MRT_ColumnDef<Veterinario>[] = [
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        size: 240,
        Cell: ({ row }) => row.original?.user?.nombre,
      },

      {
        accessorKey: 'identificacion',
        header: 'Identificacion',
        size: 90,
        Cell: ({ row }) => row.original?.user?.identificacion,
      },

      {
        accessorKey: 'no_registro',
        header: 'No registro',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'no_registro'),
      },

      {
        accessorKey: 'telefono',
        header: 'Telefono',
        size: 180,
        Cell: ({ row }) => row.original?.user?.telefono,
      },

      {
        accessorKey: 'email',
        header: 'Email',
        size: 180,
        Cell: ({ row }) => row.original?.user?.email,
      },];

      if (isSupAdmin) {
        baseColumns.push({
          accessorKey: 'user.Empresa.nombre_empresa',
          header: 'Empresa',
          size: 180,
          Cell: ({ row }) => emptyCellOneLevel(row, 'user.Empresa.nombre_empresa'),
        });
      }

        return baseColumns
    },
    [isSupAdmin]
  );

  return (
    <SingleTableBoxScene
      title="Veterinario"
      createPageUrl={`${returnUrlVeterinarisoPage}/crear`}
    >
      <CustomSearch
        onChange={onChangeFilter}
        value={globalFilter}
        text="por nombre"
      />

      <CustomTable<Veterinario>
        columns={columns}
        data={VeterinarisoPagingRes?.data || []}
        isLoading={isLoading}
        isRefetching={isRefetching}
        // // search
        enableGlobalFilter={false}
        // // pagination
        pagination={pagination}
        onPaging={setPagination}
        rowCount={VeterinarisoPagingRes?.count}
        // // actions
        actionsColumnSize={90}
        // crud
        onEdit={onEdit}
        canDelete
        onDelete={onDelete}
        // excel
        renderTopToolbarCustomActions={() => {
          return <ExportExcelButton handleExportData={handleExportData} />;
        }}
      />
    </SingleTableBoxScene>
  );
};

export default VeterinarisoPage;
