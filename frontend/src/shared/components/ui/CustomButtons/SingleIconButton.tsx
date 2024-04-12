import { GridSizeType } from '@/shared/constants';
import { Grid, IconButton, Tooltip } from '@mui/material';

export type SingleIconButtonProps = {
  label?: string;
  onClick?: () => void;
  startIcon: React.ReactNode;

  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'inherit'
    | 'success'
    | 'info'
    | 'warning';

  // new
  newCustomButton?: boolean;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  size?: GridSizeType;

  noThemeColor?: boolean;
};

const SingleIconButton: React.FC<SingleIconButtonProps> = ({
  startIcon,
  color = 'primary',
  label,
  onClick,
  size,
  noThemeColor = false,
}) => {
  return (
    <Grid item {...size}>
      <Tooltip title={label}>
        <IconButton
          color={color}
          onClick={() => onClick && onClick()}
          className={noThemeColor ? 'table__icon-button--no-color' : ''}
        >
          {startIcon}
        </IconButton>
      </Tooltip>
    </Grid>
  );
};

export default SingleIconButton;
