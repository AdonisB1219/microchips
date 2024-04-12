import { Box, Grid } from '@mui/material';

import { SxPropsThemeType } from '@/shared/interfaces';

export type CustomTabPanelProps = {
  children: React.ReactNode;
  index: number | string;
  value: number | string;

  sxBox?: SxPropsThemeType;
};

const CustomTabPanel: React.FC<CustomTabPanelProps> = ({
  children,
  value,
  index,
  sxBox = { padding: '0px 9px 0px 0px', minWidth: '100%' },
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={sxBox}>
          <Grid item container spacing={3} justifyContent="center">
            {children}
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default CustomTabPanel;
