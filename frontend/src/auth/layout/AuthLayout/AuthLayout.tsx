import { Box, Grid, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export interface AuthLayoutProps {}

const AuthLayout: React.FC<AuthLayoutProps> = () => {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        height: '100vh',
      }}
    >
      <Grid container sx={{ flex: '1 1 auto' }}>
        {/* ========= Image ========= */}
        <Grid
          item
          xs={12}
          lg={7}
          sx={{
            alignItems: 'center',
            background:
              'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            '& img': {
              maxWidth: '100%',
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: '24px',
                lineHeight: '32px',
                mb: 5,
              }}
              variant="h1"
            >
              Bienvenido
            </Typography>

            {/* <Typography
              align="center"
              sx={{ mb: 3, pt: 1 }}
              variant="subtitle1"
              style={{ color: '#B0B0B0' }}
            >
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              deleniti dolor quasi.
            </Typography> */}

            <Box
              sx={{
                height: '100%',
                // width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pt: 3,
              }}
            >
              <Box width="60%">
                <img alt="Settings" src="/logogatos.png" draggable={false} />
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* ========= Form - Outlet ========= */}
        <Grid
          item
          xs={12}
          lg={5}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthLayout;
