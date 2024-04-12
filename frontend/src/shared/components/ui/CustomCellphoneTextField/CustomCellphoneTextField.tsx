import { FormControl, Grid, TextField } from '@mui/material';
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
  defaultValue?: string | number | undefined | null;
};

const CustomCellphoneTextField: React.FC<CustomTextFieldProps> = ({
  label,
  error,
  helperText,
  required = true,
  disabled = false,
  shrink = false,
  size = gridSize,
  type = 'tel',
  control,
  name,
  defaultValue,
}) => {
  return (
    <Grid item {...size}>
      <FormControl fullWidth variant="outlined">
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue || ''}
          disabled={disabled}
          render={({ field }) => {
            const onChange = (event: any) => {
              const currentValue = event.target.value;
              const isNumber = /^[0-9]*$/.test(currentValue);

              if (isNumber && currentValue.length <= 10) {
                field.onChange(currentValue);
              }
            };

            return (
              <TextField
                fullWidth
                variant="outlined"
                label={label}
                disabled={disabled}
                InputLabelProps={{ ...(shrink && { shrink: true }) }}
                {...field}
                error={!!error}
                helperText={helperText}
                type={type}
                required={required}
                onChange={onChange}
              />
            );
          }}
        ></Controller>
      </FormControl>
    </Grid>
  );
};

export default CustomCellphoneTextField;
