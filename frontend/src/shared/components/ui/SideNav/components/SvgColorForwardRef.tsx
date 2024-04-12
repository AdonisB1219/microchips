import Box from '@mui/material/Box';
import { ForwardedRef, forwardRef } from 'react';

import { SxPropsThemeType } from '@/shared/interfaces';

interface SvgColorForwardRefProps {
  src: string;
  sx?: SxPropsThemeType;
  [key: string]: any;
}

const SvgColorForwardRef = forwardRef<HTMLSpanElement, SvgColorForwardRefProps>(
  ({ src, sx, ...other }, ref: ForwardedRef<HTMLSpanElement>) => (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: 24,
        height: 24,
        display: 'inline-block',
        bgcolor: 'currentColor',
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  )
);

export default SvgColorForwardRef;
