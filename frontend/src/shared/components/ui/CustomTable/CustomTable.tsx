/* eslint-disable indent */
import { Box, Card, IconButton, Tooltip } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { MdDelete, MdEdit } from 'react-icons/md';

export interface CustomTableProps<T> {
  columns: any;
  data: T[] | any;

  isLoading?: boolean;
  isRefetching?: boolean;

  ///* search
  enableGlobalFilter?: boolean;
  onGlobalFilterChange?: (value: any) => void;

  ///* paging
  pagination?: any;
  onPaging?: any;
  rowCount?: number;
  paginationDisplayMode?: 'custom' | 'default' | 'pages' | undefined;
  canPaginate?: boolean;

  ///* actions
  actionsColumnSize?: number;

  // crud
  canDelete?: boolean;
  canEdit?: boolean;
  onDelete?: (original: T) => void;
  onEdit?: (original: T) => void;
  enableActionsColumn?: boolean;

  onConditionDelete?: (original: T) => boolean;
  onConditionEdit?: (original: T) => boolean;

  //
  enableSorting?: boolean;

  //
  positionActionsColumn?: 'first' | 'last';

  //
  showOneCustomButton?: boolean;
  oneCustomButton?: (original: T) => React.ReactNode;
  onConditionCustomButton?: (original: T) => boolean;

  renderTopToolbarCustomActions?: (data: any) => React.ReactNode;
}

function CustomTable<T>({
  columns,
  data,

  isLoading = false,
  isRefetching = false,

  ///* search
  enableGlobalFilter = true,
  onGlobalFilterChange,

  ///* paging
  canPaginate = true,
  pagination,
  onPaging,
  rowCount = 0,
  paginationDisplayMode = 'default',

  ///* actions
  actionsColumnSize = 90,
  canEdit = true,
  onEdit,
  canDelete = false,
  onDelete,
  enableActionsColumn = true,
  onConditionDelete = canDelete ? () => true : () => false,
  onConditionEdit = canEdit ? () => true : () => false,

  //
  enableSorting = true,

  //
  positionActionsColumn = 'first',

  //
  showOneCustomButton = false,
  onConditionCustomButton = showOneCustomButton ? () => true : () => false,
  oneCustomButton,

  renderTopToolbarCustomActions,
}: CustomTableProps<T>) {
  ///* defining table
  const table = useMaterialReactTable({
    columns,
    data,

    localization: MRT_Localization_ES,
    enableEditing: enableActionsColumn,
    enableDensityToggle: true,
    enableFullScreenToggle: false,
    // layoutMode: 'grid',

    ///* search
    enableGlobalFilter: enableGlobalFilter,
    positionGlobalFilter: 'left',
    // manualFiltering: true,
    onGlobalFilterChange: onGlobalFilterChange,
    columnFilterDisplayMode: 'popover',

    renderTopToolbarCustomActions: renderTopToolbarCustomActions,

    ///* paging
    enablePagination: canPaginate,
    ...(pagination && {
      manualPagination: true,
      onPaginationChange: onPaging,
      rowCount: rowCount,
      muiPaginationProps: {
        rowsPerPageOptions: [10, 25, 50, 100],
        // showRowsPerPage: false,
      },
    }),

    paginationDisplayMode: paginationDisplayMode,

    ///* actions
    enableColumnActions: true,
    positionActionsColumn: positionActionsColumn,
    displayColumnDefOptions: { 'mrt-row-actions': { size: actionsColumnSize } },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        {showOneCustomButton &&
        oneCustomButton &&
        onConditionCustomButton &&
        onConditionCustomButton(row.original as T)
          ? oneCustomButton(row.original as T)
          : null}

        {canEdit &&
        onEdit &&
        onConditionEdit &&
        onConditionEdit(row.original as T) ? (
          <Tooltip title="Editar">
            <IconButton
              onClick={() => {
                onEdit(row.original as T);
              }}
            >
              <MdEdit />
            </IconButton>
          </Tooltip>
        ) : null}

        {canDelete &&
        onConditionDelete &&
        onConditionDelete(row.original as T) ? (
          <Tooltip title="Eliminar">
            <IconButton
              onClick={() => {
                onDelete && onDelete(row.original as T);
              }}
            >
              <MdDelete color="#922D50" />
            </IconButton>
          </Tooltip>
        ) : null}

        {/* {showOneCustomButton &&
        oneCustomButton &&
        onConditionCustomButton &&
        onConditionCustomButton(row.original as T)
          ? oneCustomButton(row.original as T)
          : null} */}
      </Box>
    ),

    //
    muiTablePaperProps: {
      elevation: 0,
    },
    enableSorting: enableSorting,

    ///* state
    initialState: {
      showGlobalFilter: false,
    },
    state: {
      expanded: true,
      ...(pagination && { pagination }),
      isLoading,

      // search bar
      showProgressBars: isRefetching,
    },
  });

  return (
    <Card>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <MaterialReactTable table={table} />
      </Box>
    </Card>
  );
}

export default CustomTable;
