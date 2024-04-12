import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export type TabTableBoxSceneProps = {
  title: string;
  createPageUrl?: string;
  tabs: React.ReactNode;
  children: React.ReactNode;
  showCreateBtn?: boolean;
  showCustomBtns?: boolean;
  customBtns?: React.ReactNode;

  createBtnText?: string;
  onClickCreateBtn?: () => void;
};

const TabTableBoxScene: React.FC<TabTableBoxSceneProps> = ({
  title,
  createPageUrl,
  children,
  tabs,
  showCreateBtn = true,
  showCustomBtns = false,
  customBtns,
  createBtnText = 'Crear',
  onClickCreateBtn,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pb: 8,
        pt: 6,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          {/* ============== title & create btn ============== */}
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
            pb={2}
          >
            <Stack spacing={1} pb={2}>
              <Typography variant="h4">{title}</Typography>
            </Stack>

            {showCreateBtn && (
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <FaPlus />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={
                    onClickCreateBtn ||
                    (() => createPageUrl && navigate(createPageUrl))
                  }
                >
                  {createBtnText}
                </Button>
              </div>
            )}

            {showCustomBtns && customBtns}
          </Stack>

          {/* ============== Tables ============== */}
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              {/* ======== tabs ======= */}
              <Grid item xs={12}>
                {tabs}
              </Grid>

              {/* ======== tab content ======= */}
              <Grid item xs={12}>
                {children}
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default TabTableBoxScene;
