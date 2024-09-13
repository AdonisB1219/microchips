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
import { useIsSuperAdmin } from '@/shared/hooks';
import { useTableFilter } from '@/shared/hooks/useTableFilter';
import { Empresa } from '@/shared/interfaces';
import { emptyCellOneLevel } from '@/shared/utils';
import { useFetchEmpresas, useDeleteEmpresa } from '@/store/app/empresas';
import { useUiConfirmModalStore } from '@/store/ui';
import { toast } from 'react-toastify';

export const returnUrlEmpresasPage = '/dashboard/empresas';

export type EmpresasPageProps = {};

const EmpresasPage: React.FC<EmpresasPageProps> = () => {
  const navigate = useNavigate();
  useIsSuperAdmin();

  ///* global state
  const setConfirmDialog = useUiConfirmModalStore(s => s.setConfirmDialog);
  const setConfirmDialogIsOpen = useUiConfirmModalStore(
    s => s.setConfirmDialogIsOpen
  );

  ///* mutations
  const deleteEmpresa = useDeleteEmpresa();

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
    data: EmpresaPagingRes,
    isLoading,
    isRefetching,
  } = useFetchEmpresas({
    page: pageIndex + 1,
    page_size: pageSize,
    nombre_empresa: searchTerm,
  });

  ///* handlers
  const onEdit = (empresa: Empresa) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Editar empresa',
      subtitle: '¿Está seguro que desea editar esta empresa?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        navigate(`${returnUrlEmpresasPage}/editar/${empresa.id}`);
      },
    });
  };

  const onDelete = (empresa: Empresa) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar empresa',
      subtitle: '¿Está seguro que desea eliminar esta empresa?',
      onConfirm: () => {
        setConfirmDialogIsOpen(false);
        deleteEmpresa.mutate(empresa.id);
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
    const data = EmpresaPagingRes?.data || [];
    if (!data.length) {
      return toast.warning('No hay datos para exportar');
    }

    const flattenedData = data.map(item => {
      return {
        nombre: item?.nombre_empresa,
        direccion: item?.direccion,
        telefono: String(item?.telefono),
        email: item?.email,
      };
    });
    const csv = generateCsv(csvConfig)(flattenedData);
    download(csvConfig)(csv);
  };

  ///* columns
  const columns = useMemo<MRT_ColumnDef<Empresa>[]>(
    () => [
      {
        accessorKey: 'nombre',
        header: 'Nombre',
        size: 180,
        Cell: ({ row }) => emptyCellOneLevel(row, 'nombre_empresa'),
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
      title="Empresas"
      createPageUrl={`${returnUrlEmpresasPage}/crear`}
    >
      <CustomSearch
        onChange={onChangeFilter}
        value={globalFilter}
        text="por nombre"
      />

      <CustomTable<Empresa>
        columns={columns}
        data={EmpresaPagingRes?.data || []}
        isLoading={isLoading}
        isRefetching={isRefetching}
        // // search
        enableGlobalFilter={false}
        // // pagination
        pagination={pagination}
        onPaging={setPagination}
        rowCount={EmpresaPagingRes?.count}
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