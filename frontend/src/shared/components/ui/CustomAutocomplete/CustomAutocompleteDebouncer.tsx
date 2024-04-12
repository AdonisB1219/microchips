import { Autocomplete, Grid, TextField } from '@mui/material';
import { ClearIcon } from '@mui/x-date-pickers';
import { Control, Controller, FieldError } from 'react-hook-form';

import { gridSize } from '@/shared/constants';

export type CustomAutocompleteProps<T> = {
  name: string;
  loadingText?: string;
  label: string;
  disabled?: boolean;

  options: T[];
  valueKey: keyof T;
  actualValueKey?: keyof T;
  optionLabelForEdit?: string;
  isLoadingData: boolean;
  onChangeValue?: (value: any) => void;
  onChangeInputText?: (value: any) => void;
  onChangeRawValue?: (value: T) => void;

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
};

function CustomAutocompleteDebouncer<T>({
  name,
  options,
  isLoadingData,
  error,
  textFieldKey,
  defaultValue,
  control,
  loadingText = 'Cargando...',
  optionLabelForEdit,
  valueKey,
  helperText,
  required = true,
  label,
  actualValueKey,
  size = gridSize,
  disabled = false,
  onChangeValue,
  onChangeInputText,
  onChangeRawValue,
}: CustomAutocompleteProps<T>) {
  return (
    <Grid item {...size}>
      <Controller
        name={name}
        control={control}
        key={textFieldKey || defaultValue || ''}
        defaultValue={defaultValue || ''}
        render={({ field }) => {
          const onChange = (_event: any, data: any) => {
            const selectedValue = data?.[actualValueKey || valueKey] ?? '';
            field.onChange(selectedValue);

            // pensarle bien para el debouncer ??
            onChangeValue && onChangeValue(selectedValue); // label
            onChangeRawValue && onChangeRawValue(data); // T
          };

          return (
            <Autocomplete
              freeSolo
              loading={isLoadingData}
              loadingText={loadingText}
              options={options}
              getOptionLabel={(option: any) =>
                option?.[valueKey]?.toString() ??
                options
                  ?.find(opt => opt[actualValueKey || valueKey] === option)
                  ?.[valueKey]?.toString() ??
                optionLabelForEdit?.toString() ??
                ''
              }
              {...field}
              // // clear
              clearIcon={
                // to clear input and send new request in debouncer that reset data
                <ClearIcon
                  fontSize="small"
                  onClick={() => {
                    onChangeValue && onChangeValue('');
                    onChangeInputText && onChangeInputText('');
                  }}
                />
              }
              clearText="Limpiar"
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
                  onChange={e => {
                    onChangeInputText && onChangeInputText(e.target.value);
                  }}
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

export default CustomAutocompleteDebouncer;
