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
import { useTableFilter } from '@/shared/hooks/useTableFilter';
import { Propietario, Tutor } from '@/shared/interfaces';
import { useDeleteTutor, useFetchTutors } from '@/store/app/propietarios';
import { useUiConfirmModalStore } from '@/store/ui';
import { toast } from 'react-toastify';

export const returnUrlTutosrPage = '/dashboard/tutores';

export type TutosrPageProps = {};

const TutosrPage: React.FC<TutosrPageProps> = () => {
  const navigate = useNavigate();

  ///* global state
  const setConfirmDialog = useUiConfirmModalStore(s => s.setConfirmDialog);
  const setConfirmDialogIsOpen = useUiConfirmModalStore(
    s => s.setConfirmDialogIsOpen
  );

  ///* mutations
  const deleteTutor = useDeleteTutor();

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
    data: TutosrPagingRes,
    isLoading,
    isRefetching,
  } = useFetchTutors({
    page: pageIndex + 1,
    page_size: pageSize,
    nombre: searchTerm,
  });

  ///* handlers
  const onEdit = (tutor: Propietario) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Editar Tutor',
      subtitle: '¿Está seguro que desea editar este Tutor?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        navigate(`${returnUrlTutosrPage}/editar/${tutor.id}`);
      },
    });
  };

  const onDelete = (tutor: Propietario) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Tutor',
      subtitle: '¿Está seguro que desea eliminar este Tutor?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        deleteTutor.mutate(tutor.id!);
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
    const data = TutosrPagingRes?.data || [];
    if (!data.length) {
      return toast.warning('No hay datos para exportar');
    }

    const flattenedData = data.map(item => {
      const { user } = item;
      return {
        nombre: user?.nombre,
        identificacion: String(user?.identificacion),
        direccion: user?.direccion,
        telefono: String(user?.telefono),
        email: user?.email,
        observaciones: item.observaciones,
        userId: String(item.userId),
        tutorId: String(item.id),
      };
    });
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  ///* columns
  const columns = useMemo<MRT_ColumnDef<Tutor>[]>(
    () => [
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        size: 270,
        Cell: ({ row }) => row.original?.user?.nombre || 'N/A',
      },

      {
        accessorKey: 'identificacion',
        header: 'Identificacion',
        size: 150,
        Cell: ({ row }) => row.original?.user?.identificacion || 'N/A',
      },

      {
        accessorKey: 'direccion',
        header: 'Direccion',
        size: 180,
        Cell: ({ row }) => row.original?.user?.direccion || 'N/A',
      },

      {
        accessorKey: 'telefono',
        header: 'Telefono',
        size: 180,
        Cell: ({ row }) => row.original?.user?.telefono || 'N/A',
      },

      {
        accessorKey: 'email',
        header: 'Email',
        size: 180,
        Cell: ({ row }) => row.original?.user?.email || 'N/A',
      },

      {
        accessorKey: 'observaciones',
        header: 'Observaciones',
        size: 240,
        Cell: ({ row }) => row.original?.observaciones || 'N/A',
      },
    ],
    []
  );

  return (
    <SingleTableBoxScene
      title="Tutor"
      createPageUrl={`${returnUrlTutosrPage}/crear`}
    >
      <CustomSearch
        onChange={onChangeFilter}
        value={globalFilter}
        text="por nombre"
      />

      <CustomTable<Propietario>
        columns={columns}
        data={TutosrPagingRes?.data || []}
        isLoading={isLoading}
        isRefetching={isRefetching}
        // // search
        enableGlobalFilter={false}
        // // pagination
        pagination={pagination}
        onPaging={setPagination}
        rowCount={TutosrPagingRes?.count}
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

export default TutosrPage;
