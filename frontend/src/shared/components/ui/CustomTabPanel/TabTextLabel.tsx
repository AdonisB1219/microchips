import { Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

export type TabTextLabelProps = {
  text: string;
  pt?: string | number;
  pl?: string | number;
  mt?: string | number;
  pb?: string | number;
  variant?: Variant | 'inherit' | undefined;
  uppercase?: boolean;
  color?: string;
};

const TabTextLabel: React.FC<TabTextLabelProps> = ({
  text,
  pt = '0px',
  pl = '24px',
  mt = '15px',
  pb = '24px',
  variant = 'h6',
  uppercase = true,
  color = '#6c737fb0',
}) => {
  return (
    <Typography
      variant={variant}
      sx={{
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'start',
        width: '100%',
        pl,
        mt,
        pb,
        color,
        fontSize: '.9rem',
        pt,
      }}
    >
      {uppercase ? text.toUpperCase() : text}
    </Typography>
  );
};

export default TabTextLabel;
