import { gridSize } from '@/shared/constants';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { Control, Controller, FieldError } from 'react-hook-form';

export type CustomAutocompleteArrString = {
  name: string;
  loadingText?: string;
  label: string;
  disabled?: boolean;
  options: string[];

  optionLabelForEdit?: string;
  isLoadingData: boolean;
  onChangeValue?: (value: any) => void;

  error: FieldError | undefined;
  helperText: React.ReactNode;
  required?: boolean;

  textFieldKey?: string;
  defaultValue: string | number;
  control: Control<any, any>;

  size?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };

  disableClearable?: boolean;
};

function CustomAutocompleteArrString({
  name,
  options,
  isLoadingData,
  error,
  textFieldKey,
  defaultValue,
  control,
  loadingText = 'Cargando...',
  helperText,
  required = true,
  label,
  onChangeValue,
  size = gridSize,
  disabled = false,
  disableClearable = false,
}: CustomAutocompleteArrString) {
  return (
    <Grid item {...size}>
      <Controller
        name={name}
        control={control}
        key={textFieldKey || defaultValue}
        defaultValue={defaultValue || ''}
        render={({ field }) => {
          const onChange = (_event: any, data: any) => {
            field.onChange(data || '');
            onChangeValue && onChangeValue(data);
          };

          return (
            <Autocomplete
              freeSolo
              loading={isLoadingData}
              loadingText={loadingText}
              options={options}
              getOptionLabel={(option: any) => option}
              disableClearable={disableClearable}
              {...field}
              disabled={disabled}
              renderInput={params => (
                <TextField
                  {...params}
                  label={label}
                  variant="outlined"
                  error={!!error}
                  helperText={helperText}
                  required={required}
                  disabled={disabled}
                />
              )}
              onChange={onChange}
            />
          );
        }}
      />
    </Grid>
  );
}

export default CustomAutocompleteArrString;
