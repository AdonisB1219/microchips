import { Box, Typography } from '@mui/material';

export interface DashboardHomeProps {}

const DashboardHome: React.FC<DashboardHomeProps> = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '0 2%',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" component="h1" sx={{ margin: 0 }}>
        Bienvenido a
      </Typography>
      <Typography variant="h2" component="h2" sx={{ margin: 0, pb: 3 }}>
        MAULISCORP
      </Typography>

      
    </Box>
  );
};

export default DashboardHome;
