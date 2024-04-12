import { FormControl, Grid } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Control, Controller, FieldError } from 'react-hook-form';

import { gridSize } from '@/shared/constants';

export interface SampleDatePickerProps {
  label: string;
  onChangeValue?: (e?: any) => void;

  size?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };

  control: Control<any, any>;
  name: string;
  defaultValue: string | null;
  error: FieldError | undefined;
  helperText: React.ReactNode;

  textFieldKey?: string;
  minDate?: Date | string;
  maxDate?: Date | string;

  display?: string;

  required?: boolean;
  disabled?: boolean;
}

const SampleDatePicker: React.FC<SampleDatePickerProps> = ({
  label,
  name,
  onChangeValue,
  control,
  defaultValue,
  size = gridSize,
  textFieldKey,
  minDate,
  maxDate,
  error,
  helperText,
  display = 'flex',
  required = true,
  disabled = false,
}) => {
  return (
    <Grid
      item
      {...size}
      sx={{
        display: display,
      }}
    >
      <FormControl fullWidth>
        <Controller
          control={control}
          key={textFieldKey || defaultValue}
          name={name}
          defaultValue={defaultValue || ''}
          render={({ field }) => {
            const onChange = (date: any) => {
              field.onChange(dayjs(date).format('YYYY-MM-DD'));
              onChangeValue && onChangeValue(dayjs(date).format('YYYY-MM-DD'));
            };

            return (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  label={label}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      // size: 'small',
                      helperText: helperText,
                      error: !!error,
                      required: required,
                    },
                  }}
                  value={field.value ? dayjs(field.value) : ''}
                  onChange={onChange}
                  minDate={minDate ? dayjs(minDate) : null}
                  maxDate={maxDate ? dayjs(maxDate) : null}
                  disabled={disabled}
                />
              </LocalizationProvider>
            );
          }}
        />
      </FormControl>
    </Grid>
  );
};

export default SampleDatePicker;
