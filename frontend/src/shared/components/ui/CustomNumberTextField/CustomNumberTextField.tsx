import { FormControl, Grid, SxProps, TextField, Theme } from '@mui/material';
import { Controller, FieldError } from 'react-hook-form';

import { gridSize } from '@/shared/constants';

export type CustomNumberFieldProps = {
  label: string;
  // register: TextFieldProps;
  error: FieldError | undefined;
  helperText: React.ReactNode;
  disabled?: boolean;
  shrink?: boolean;
  required?: boolean;
  min?: number;
  max?: number;

  size?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };

  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;

  control: any;
  name: string;
  defaultValue?: string | number;
  onChangeValue?: (value: any) => void;
  sxInputText?: SxProps<Theme> | undefined;

  onlyIntegers?: boolean;
};

const CustomNumberTextField: React.FC<CustomNumberFieldProps> = ({
  error,
  helperText,
  label,
  disabled = false,
  required = true,
  shrink,
  size = gridSize,
  max = 100,
  min = 1,

  startAdornment,
  endAdornment,

  control,
  name,
  defaultValue,
  onChangeValue,
  sxInputText,
}) => {
  return (
    <Grid item {...size}>
      <FormControl fullWidth variant="outlined">
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          disabled={disabled}
          render={({ field }) => {
            const onChange = (event: any) => {
              const currentValue = event.target.value;

              // const isNumber = /^-?[0-9]*\.?[0-9]+$/.test(currentValue);
              const isNumber =
                /^-?(?!e)[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?$/.test(
                  currentValue
                );

              if (isNumber && currentValue.length <= 21) {
                field.onChange(currentValue);
                onChangeValue && onChangeValue(currentValue);
              }
            };

            return (
              <TextField
                fullWidth
                label={label}
                type="number"
                variant="outlined"
                InputProps={{
                  inputProps: {
                    min,
                    max,
                  },
                  startAdornment: startAdornment ?? null,
                  endAdornment: endAdornment ?? null,
                }}
                InputLabelProps={{ ...(shrink && { shrink: true }) }}
                {...field}
                error={!!error}
                helperText={helperText}
                required={required}
                disabled={disabled}
                onChange={onChange}
                sx={sxInputText}
              />
            );
          }}
        ></Controller>
      </FormControl>
    </Grid>
  );
};

export default CustomNumberTextField;
