import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import { alpha, Theme } from '@mui/material/styles';
import { useEffect } from 'react';

import { CustomRouterLink } from '@/shared/components/ui/SideNav';
import { NAV } from '@/shared/constants';
import { navConfig } from '@/shared/constants/__mock__';
import { usePathname, useResponsive } from '@/shared/hooks';
import { Scrollbar } from '..';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface NavProps {
  openNav: boolean;
  onCloseNav: () => void;
}

interface NavItemProps {
  item: {
    path: string;
    title: string;
    icon: React.ReactElement;
  };
}

export default function SideNav({ openNav, onCloseNav }: NavProps) {
  const pathname = usePathname();

  const user = useAuthStore(s => s.user);

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme: Theme) => alpha(theme.palette.grey[700], 0.03),
      }}
    >
      
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map(item => {
        if (item?.admin && (user?.rolId && user?.rolId <3)) {
          return null;
        }
        if (item?.superadmin && (user?.rolId && user?.rolId <4)) {
          return null;
        }

        return <NavItem key={item.title} item={item} />;
      })}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme: Theme) =>
              `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

function NavItem({ item }: NavItemProps) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={CustomRouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}
