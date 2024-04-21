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
import { Admin } from '@/shared/interfaces';
import { emptyCellOneLevel } from '@/shared/utils';
import { useDeleteAdmin, useFetchAdmins } from '@/store/app/admin';
import { useUiConfirmModalStore } from '@/store/ui';
import { toast } from 'react-toastify';

export const returnUrlAdmisnPage = '/dashboard/administradores';

export type AdmisnPageProps = {};

const EmpresasPage: React.FC<AdmisnPageProps> = () => {
  const navigate = useNavigate();
  useIsAdmin();

  ///* global state
  const setConfirmDialog = useUiConfirmModalStore(s => s.setConfirmDialog);
  const setConfirmDialogIsOpen = useUiConfirmModalStore(
    s => s.setConfirmDialogIsOpen
  );

  ///* mutations
  const deleteAdmin = useDeleteAdmin();

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
    data: AdmisnPagingRes,
    isLoading,
    isRefetching,
  } = useFetchAdmins({
    page: pageIndex + 1,
    page_size: pageSize,
    nombre: searchTerm,
  });

  ///* handlers
  const onEdit = (admin: Admin) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Editar Admin',
      subtitle: '¿Está seguro que desea editar este Admin?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        navigate(`${returnUrlAdmisnPage}/editar/${admin.id}`);
      },
    });
  };

  const onDelete = (admin: Admin) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Admin',
      subtitle: '¿Está seguro que desea eliminar este Admin?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        deleteAdmin.mutate(admin.id!);
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
    const data = AdmisnPagingRes?.data || [];
    if (!data.length) {
      return toast.warning('No hay datos para exportar');
    }

    const flattenedData = data.map(item => {
      return {
        nombre: item?.nombre,
        identificacion: String(item?.identificacion),
        direccion: item?.direccion,
        telefono: String(item?.telefono),
        email: item?.email,
      };
    });
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  ///* columns
  const columns = useMemo<MRT_ColumnDef<Admin>[]>(
    () => [
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'nombre'),
      },

      {
        accessorKey: 'identificacion',
        header: 'Identificacion',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'identificacion'),
      },

      {
        accessorKey: 'direccion',
        header: 'Direccion',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'direccion'),
      },

      {
        accessorKey: 'telefono',
        header: 'Telefono',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'telefono'),
      },

      {
        accessorKey: 'email',
        header: 'Email',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'email'),
      },
    ],
    []
  );

  return (
    <SingleTableBoxScene
      title="Admin"
      createPageUrl={`${returnUrlAdmisnPage}/crear`}
    >
      <CustomSearch
        onChange={onChangeFilter}
        value={globalFilter}
        text="por nombre"
      />

      <CustomTable<Admin>
        columns={columns}
        data={AdmisnPagingRes?.data || []}
        isLoading={isLoading}
        isRefetching={isRefetching}
        // // search
        enableGlobalFilter={false}
        // // pagination
        pagination={pagination}
        onPaging={setPagination}
        rowCount={AdmisnPagingRes?.count}
        // // actions
        actionsColumnSize={180}
        // crud
        onEdit={onEdit}
        onDelete={onDelete}
        canDelete
        // excel
        renderTopToolbarCustomActions={() => {
          return <ExportExcelButton handleExportData={handleExportData} />;
        }}
      />
    </SingleTableBoxScene>
  );
};

export default AdmisnPage;
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
import { Admin } from '@/shared/interfaces';
import { emptyCellOneLevel } from '@/shared/utils';
import { useDeleteAdmin, useFetchAdmins } from '@/store/app/admin';
import { useUiConfirmModalStore } from '@/store/ui';
import { toast } from 'react-toastify';

export const returnUrlAdmisnPage = '/dashboard/administradores';

export type AdmisnPageProps = {};

const AdmisnPage: React.FC<AdmisnPageProps> = () => {
  const navigate = useNavigate();
  useIsAdmin();

  ///* global state
  const setConfirmDialog = useUiConfirmModalStore(s => s.setConfirmDialog);
  const setConfirmDialogIsOpen = useUiConfirmModalStore(
    s => s.setConfirmDialogIsOpen
  );

  ///* mutations
  const deleteAdmin = useDeleteAdmin();

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
    data: AdmisnPagingRes,
    isLoading,
    isRefetching,
  } = useFetchAdmins({
    page: pageIndex + 1,
    page_size: pageSize,
    nombre: searchTerm,
  });

  ///* handlers
  const onEdit = (admin: Admin) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Editar Admin',
      subtitle: '¿Está seguro que desea editar este Admin?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        navigate(`${returnUrlAdmisnPage}/editar/${admin.id}`);
      },
    });
  };

  const onDelete = (admin: Admin) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Admin',
      subtitle: '¿Está seguro que desea eliminar este Admin?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        deleteAdmin.mutate(admin.id!);
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
    const data = AdmisnPagingRes?.data || [];
    if (!data.length) {
      return toast.warning('No hay datos para exportar');
    }

    const flattenedData = data.map(item => {
      return {
        nombre: item?.nombre,
        identificacion: String(item?.identificacion),
        direccion: item?.direccion,
        telefono: String(item?.telefono),
        email: item?.email,
      };
    });
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  ///* columns
  const columns = useMemo<MRT_ColumnDef<Admin>[]>(
    () => [
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'nombre'),
      },

      {
        accessorKey: 'identificacion',
        header: 'Identificacion',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'identificacion'),
      },

      {
        accessorKey: 'direccion',
        header: 'Direccion',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'direccion'),
      },

      {
        accessorKey: 'telefono',
        header: 'Telefono',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'telefono'),
      },

      {
        accessorKey: 'email',
        header: 'Email',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'email'),
      },
    ],
    []
  );

  return (
    <SingleTableBoxScene
      title="Admin"
      createPageUrl={`${returnUrlAdmisnPage}/crear`}
    >
      <CustomSearch
        onChange={onChangeFilter}
        value={globalFilter}
        text="por nombre"
      />

      <CustomTable<Admin>
        columns={columns}
        data={AdmisnPagingRes?.data || []}
        isLoading={isLoading}
        isRefetching={isRefetching}
        // // search
        enableGlobalFilter={false}
        // // pagination
        pagination={pagination}
        onPaging={setPagination}
        rowCount={AdmisnPagingRes?.count}
        // // actions
        actionsColumnSize={180}
        // crud
        onEdit={onEdit}
        onDelete={onDelete}
        canDelete
        // excel
        renderTopToolbarCustomActions={() => {
          return <ExportExcelButton handleExportData={handleExportData} />;
        }}
      />
    </SingleTableBoxScene>
  );
};

export default EmpresasPage;
