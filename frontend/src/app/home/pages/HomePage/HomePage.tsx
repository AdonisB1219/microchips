import { Button } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CustomSearch,
  CustomTable,
  SingleTableBoxScene,
} from '@/shared/components';
import { useTableFilter } from '@/shared/hooks';
import { FreeMascotaInfo } from '@/shared/interfaces/app/home/free-info.interface';
import { useFetchFreeInfo } from '@/store/app/home/free-info.actions';
import { useAuthStore } from '@/store/auth';

export interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();

  ///* global state
  const isAuth = useAuthStore(s => s.isAuth);

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
  const { data, isLoading, isRefetching } = useFetchFreeInfo({
    page: pageIndex + 1,
    page_size: pageSize,
    search: searchTerm,
  });

  ///* columns
  const columns = useMemo<MRT_ColumnDef<FreeMascotaInfo>[]>(
    () => [
      {
        accessorKey: 'Responsable.user.nombre',
        header: 'Nombre veterinario',
        size: 200,
      },
      {
        accessorKey: 'Tutor.user.nombre',
        header: 'Nombre propetario',
        size: 200,
      },
      {
        accessorKey: 'nombre_mascota',
        header: 'Nombre animal de compañía',
        size: 200,
      },
      {
        accessorKey: 'especie',
        header: 'Especie',
        size: 100,
      },
      {
        accessorKey: 'raza',
        header: 'Raza',
        size: 140,
      },
      {
        accessorKey: 'codigo_chip',
        header: 'Numero microchip',
        size: 300,
      },
      {
        accessorKey: 'certificado',
        header: 'Certificado',
        size: 200,
        Cell: () => {
          return (
            <>
              {!isAuth ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate('/auth/login');
                  }}
                >
                  Iniciar sesion
                </Button>
              ) : (
                <Button
                  variant="text"
                  onClick={() => {
                    navigate('/dashboard/mascotas');
                  }}
                >
                  IR AL DASHBOARD
                </Button>
              )}
            </>
          );
        },
      },
    ],
    [isAuth, navigate]
  );

  return (
    <>
      <SingleTableBoxScene
        title="Consulta microchips"
        showCreateBtn={false}
        showBreadcrumbs={false}
        showCustomBtns
        customLabelBtn="Inicio Sesión"
        customBtn={
          <Button
            variant="contained"
            onClick={() => {
              isAuth
                ? navigate('/dashboard/home')
                : navigate('/auth/login');
            }}
          >
            {isAuth ? 'IR AL DASHBOARD' : 'Iniciar sesion'}
          </Button>
        }
      >
        <CustomSearch
          onChange={onChangeFilter}
          value={globalFilter}
          maxWidthSearch={700}
          text="por nombre veterinario, animal de companía, tutor, numero microchip..."
        />

        <CustomTable<any>
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          isRefetching={isRefetching}
          // // search
          enableGlobalFilter={false}
          // // pagination
          pagination={pagination}
          onPaging={setPagination}
          rowCount={data?.count}
          // // actions
          enableActionsColumn={false}
        />
      </SingleTableBoxScene>
    </>
  );
};

export default HomePage;
