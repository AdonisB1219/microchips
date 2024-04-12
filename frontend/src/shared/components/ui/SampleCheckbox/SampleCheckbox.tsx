import { gridSize } from '@/shared/constants';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

export interface SampleCheckboxProps {
  label: string;

  onChangeValue?: (e?: boolean) => void;

  size?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };

  control: Control<any, any>;
  name: string;
  defaultValue: boolean;

  textFieldKey?: string;
  disabled?: boolean;
}

const SampleCheckbox: React.FC<SampleCheckboxProps> = ({
  label,
  name,
  onChangeValue,
  control,
  defaultValue,
  size = gridSize,
  textFieldKey,
  disabled,
}) => {
  return (
    <Grid item {...size}>
      <Controller
        name={name}
        control={control}
        key={textFieldKey || defaultValue + ''}
        render={({ field }) => {
          const onChange = (e: any) => {
            onChangeValue && onChangeValue(e.target.checked);
            field.onChange(e.target.checked);
          };

          return (
            <FormControlLabel
              label={label}
              control={
                <Checkbox
                  {...field}
                  size="small"
                  checked={field.value || false}
                  onChange={onChange}
                  disabled={disabled}
                />
              }
            />
          );
        }}
      />
    </Grid>
  );
};

export default SampleCheckbox;
