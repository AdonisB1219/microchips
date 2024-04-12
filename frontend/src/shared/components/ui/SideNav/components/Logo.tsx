import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { forwardRef, ReactNode } from 'react';

import { SxPropsThemeType } from '@/shared/interfaces';
import { Avatar } from '@mui/material';
import { CustomRouterLink } from '.';

interface LogoProps {
  disabledLink?: boolean;
  sx?: SxPropsThemeType;
  [key: string]: any;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const logo: ReactNode = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 40,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <Avatar
          src="/ico.png"
          alt="logo"
          sx={{
            width: 40,
            height: 40,
          }}
        />
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={CustomRouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
