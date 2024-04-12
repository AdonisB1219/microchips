import { Theme } from '@emotion/react';
import { FormControl, Grid, SxProps, TextField } from '@mui/material';
import { Controller, FieldError } from 'react-hook-form';

import { gridSize } from '@/shared/constants';

type CustomTextFieldProps = {
  label: string;
  error: FieldError | undefined;
  helperText: React.ReactNode;
  disabled?: boolean;
  shrink?: boolean;
  required?: boolean;

  type?: React.HTMLInputTypeAttribute;

  size?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };

  control: any;
  name: string;
  defaultValue: string | number | undefined | null;
  onChangeValue?: (value: any) => void;

  sizeTextField?: 'medium' | 'small';
  startAdornment?: React.ReactNode;

  sxTextField?: SxProps<Theme> | undefined;
  placeholder?: string;

  startAdornmentInput?: React.ReactNode;
  endAdornmentInput?: React.ReactNode;

  overrideAsPassword?: boolean;
};

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  error,
  helperText,
  required = true,
  disabled = false,
  shrink = false,
  size = gridSize,
  type = 'text',
  overrideAsPassword = false,

  control,
  name,
  defaultValue,
  onChangeValue,
  sizeTextField = 'medium',

  startAdornment,
  sxTextField,
  placeholder,

  startAdornmentInput,
  endAdornmentInput,
}) => {
  return (
    <Grid item {...size}>
      <FormControl fullWidth variant="outlined">
        <Controller
          control={control}
          name={name!}
          defaultValue={defaultValue || ''}
          render={({ field }) => {
            const onChange = (event: any) => {
              const currentValue = event.target.value;

              if (overrideAsPassword) {
                onChangeValue && onChangeValue(currentValue);
                return field.onChange(currentValue);
              }

              if (
                type === 'number' ||
                type === 'email' ||
                type === 'password'
              ) {
                onChangeValue && onChangeValue(currentValue?.toUpperCase());
                return field.onChange(currentValue);
              }

              field.onChange(currentValue.toUpperCase());

              onChangeValue && onChangeValue(currentValue?.toUpperCase());
            };

            return (
              <TextField
                {...field}
                size={sizeTextField}
                fullWidth
                variant="outlined"
                label={label}
                InputLabelProps={{
                  ...(shrink && { shrink: true }),
                  ...(startAdornment && { startAdornment }),
                }}
                InputProps={{
                  startAdornment: startAdornmentInput ?? null,
                  endAdornment: endAdornmentInput ?? null,
                  readOnly: disabled,
                }}
                error={!!error}
                helperText={helperText}
                type={type}
                onChange={onChange}
                required={required}
                // disabled={disabled}
                sx={sxTextField}
                placeholder={placeholder}
              />
            );
          }}
        ></Controller>
      </FormControl>
    </Grid>
  );
};

export default CustomTextField;
