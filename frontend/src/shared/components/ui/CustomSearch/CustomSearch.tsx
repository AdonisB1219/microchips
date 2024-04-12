import { gridSizeMdLg6 } from '@/shared/constants';
import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
} from '@mui/material';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { SampleDatePicker } from '..';

export interface CustomSearchInterface {
  onChange: (value: any) => void;
  value: string;
  text: string;

  canFilterByDate?: boolean;
  form?: any;
  onChangeDesde?: (value: any) => void;
  labelDesde?: string;

  canFilterByDateHasta?: boolean;
  onChangeHasta?: (value: any) => void;
  labelHasta?: string;

  maxWidthSearch?: number;
}

const CustomSearch: React.FC<CustomSearchInterface> = ({
  onChange,
  value,
  text,

  canFilterByDate = false,
  form,
  onChangeDesde,
  labelDesde = 'Desde',

  canFilterByDateHasta = false,
  onChangeHasta,
  labelHasta = 'Hasta',
  maxWidthSearch = 500,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2} direction="row">
        <OutlinedInput
          fullWidth
          placeholder={`Buscar ${text}`}
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <HiMiniMagnifyingGlass />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: maxWidthSearch }}
          className="custom-search-form__input"
          value={value}
          onChange={e => {
            onChange(e.target.value);
          }}
        />
        <span className="spacer"></span>

        {/* ------ */}
        {canFilterByDate && onChangeDesde && form ? (
          <>
            <SampleDatePicker
              label={labelDesde}
              name="fecha"
              control={form.control}
              defaultValue={null}
              error={false as any}
              helperText={null as any}
              onChangeValue={onChangeDesde}
            />

            {form.getValues().fecha ? (
              <Button
                color="primary"
                onClick={() => {
                  form.setValue('fecha', null);
                  onChangeDesde(null);
                }}
              >
                Limpiar
              </Button>
            ) : null}

            {canFilterByDateHasta && onChangeHasta && form ? (
              <>
                <SampleDatePicker
                  label={labelHasta}
                  name="fechaFin"
                  control={form.control}
                  defaultValue={null}
                  size={gridSizeMdLg6}
                  error={false as any}
                  helperText={null as any}
                  onChangeValue={onChangeHasta}
                />

                {form.getValues().fechaFin ? (
                  <Button
                    color="primary"
                    onClick={() => {
                      form.setValue('fechaFin', null);
                      onChangeHasta(null);
                    }}
                  >
                    Limpiar
                  </Button>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
      </Stack>
    </Box>
  );
};

export default CustomSearch;
